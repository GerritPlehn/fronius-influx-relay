import { Point } from "@influxdata/influxdb-client";
import { baseUrl, type Endpoint } from "../crawl.ts";
import { inverter3PSchema } from "../types/Inverter3P.ts";
import { writeApi } from "./index.ts";

export const writeInverter3P = async (rawData: unknown) => {
	const input = inverter3PSchema.safeParse(rawData);

	if (!input.success) {
		console.warn(
			`${new Date().toISOString()}: got unexpected data`,
			input.error,
		);
		return;
	}
	const { data } = input;

	const inverter3p = data.Body.Data;
	const measurementTime = data.Head.Timestamp;

	const numericPoints = new Map<string, number | null>();

	numericPoints.set("IAC_L1", inverter3p.IAC_L1.Value);
	numericPoints.set("IAC_L2", inverter3p.IAC_L2.Value);
	numericPoints.set("IAC_L3", inverter3p.IAC_L3.Value);
	numericPoints.set("UAC_L1", inverter3p.UAC_L1.Value);
	numericPoints.set("UAC_L2", inverter3p.UAC_L2.Value);
	numericPoints.set("UAC_L3", inverter3p.UAC_L3.Value);

	const influxPoint = new Point("Inverter3P").timestamp(measurementTime);

	for (const [key, value] of numericPoints.entries()) {
		if (value == null) continue;
		influxPoint.floatField(key, value);
	}

	writeApi.writePoint(influxPoint);
	return influxPoint.toLineProtocol(writeApi);
};

export const inverter3PEndpoint: Endpoint = {
	url: `${baseUrl}/GetInverterRealtimeData.cgi?${new URLSearchParams({
		Scope: "Device",
		DataCollection: "3PInverterData",
	})}`,
	writer: writeInverter3P,
	name: "Inverter3P",
};
