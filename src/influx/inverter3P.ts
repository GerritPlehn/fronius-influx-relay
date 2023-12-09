import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./index.ts";
import { inverter3PSchema } from "../types/Inverter3P.ts";

export const writeInverter3P = async (rawData: unknown) => {
  const data = inverter3PSchema.parse(rawData);

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
  console.log(`${influxPoint.toLineProtocol(writeApi)}`);
};
