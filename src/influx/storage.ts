import { Point } from "@influxdata/influxdb-client";
import type { Endpoint } from "../crawl.ts";
import { fronius } from "../env.ts";
import { storageSchema } from "../types/Storage.ts";
import { writeApi } from "./index.ts";

export const writeStorage = async (rawData: unknown) => {
	const input = storageSchema.safeParse(rawData);

	if (!input.success) {
		console.warn(
			`${new Date().toISOString()}: got unexpected data`,
			input.error,
		);
		return;
	}
	const { data } = input;

	const storage = data.Body.Data.Controller;
	if (!storage) {
		console.warn(`${new Date().toISOString()}: No Storage data available`);
		return;
	}
	const measurementTime = data.Head.Timestamp;

	const numericPoints = new Map<string, number | null>();

	numericPoints.set("Capacity_Maximum", storage.Capacity_Maximum);
	numericPoints.set("Current_DC", storage.Current_DC);
	numericPoints.set("DesignedCapacity", storage.DesignedCapacity);
	numericPoints.set("Enable", storage.Enable);
	numericPoints.set("StateOfCharge_Relative", storage.StateOfCharge_Relative);
	numericPoints.set("Temperature_Cell", storage.Temperature_Cell);
	numericPoints.set("TimeStamp", storage.TimeStamp);
	numericPoints.set("Voltage_DC", storage.Voltage_DC);

	const influxPoint = new Point("Storage").timestamp(measurementTime);

	for (const [key, value] of numericPoints.entries()) {
		if (value == null) continue;
		influxPoint.floatField(key, value);
	}

	influxPoint.stringField("Status_BatteryCell", storage.Status_BatteryCell);

	writeApi.writePoint(influxPoint);
	return influxPoint.toLineProtocol(writeApi);
};

export const storageEndpoint: Endpoint = {
	url: `${fronius.baseUrl}/GetStorageRealtimeData.cgi?${new URLSearchParams({
		Scope: "Device",
		DeviceId: "0",
	})}`,
	writer: writeStorage,
	name: "Storage",
};
