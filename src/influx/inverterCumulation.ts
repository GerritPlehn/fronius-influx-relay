import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./index.ts";
import { inverterCumulationSchema } from "../types/InverterCumulation.ts";

export const writeInverterCumulation = async (rawData: unknown) => {
  const input = inverterCumulationSchema.safeParse(rawData);

  if (!input.success) {
    console.warn("got unexpected data", input.error);
    return;
  }
  const { data } = input;

  const invertercumulation = data.Body.Data;
  const measurementTime = data.Head.Timestamp;

  const numericPoints = new Map<string, number | null>();

  numericPoints.set("PAC", invertercumulation.PAC.Value);
  numericPoints.set("TOTAL_ENERGY", invertercumulation.TOTAL_ENERGY.Value);

  const influxPoint = new Point("InverterCumulation").timestamp(
    measurementTime
  );

  for (const [key, value] of numericPoints.entries()) {
    if (value == null) continue;
    influxPoint.floatField(key, value);
  }

  writeApi.writePoint(influxPoint);
  console.log(`${influxPoint.toLineProtocol(writeApi)}`);
};
