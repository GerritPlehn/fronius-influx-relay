import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./index.ts";
import { inverterCumulationSchema } from "../types/InverterCumulation.ts";

export const writeInverterCumulation = async (rawData: unknown) => {
  const data = inverterCumulationSchema.parse(rawData);

  const invertercumulation = data.Body.Data;
  const measurementTime = data.Head.Timestamp;

  const numericPoints = new Map<string, number | null>();

  numericPoints.set("PAC", invertercumulation.PAC.Values[1]);
  numericPoints.set("TOTAL_ENERGY", invertercumulation.TOTAL_ENERGY.Values[1]);

  const influxPoint = new Point("InverterCumulation").timestamp(
    measurementTime
  );

  for (const [key, value] of numericPoints.entries()) {
    if (!value) {
      continue;
    }
    influxPoint.floatField(key, value);
  }

  writeApi.writePoint(influxPoint);
  console.log(`${influxPoint.toLineProtocol(writeApi)}`);
};
