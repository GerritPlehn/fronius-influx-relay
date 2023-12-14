import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./index.ts";
import { inverterCommonSchema } from "../types/InverterCommon.ts";

export const writeInverterCommon = async (rawData: unknown) => {
  const input = inverterCommonSchema.safeParse(rawData);

  if (!input.success) {
    console.warn("got unexpected data", input.error);
    return;
  }
  const { data } = input;

  const invertercommon = data.Body.Data;
  const measurementTime = data.Head.Timestamp;

  const numericPoints = new Map<string, number | null>();

  numericPoints.set("PAC", invertercommon.PAC.Value);
  numericPoints.set("SAC", invertercommon.SAC.Value);
  numericPoints.set("IAC", invertercommon.IAC.Value);
  numericPoints.set("UAC", invertercommon.UAC.Value);
  numericPoints.set("FAC", invertercommon.FAC?.Value ?? null);
  numericPoints.set("IDC", invertercommon.IDC.Value);
  numericPoints.set("IDC_2", invertercommon.IDC_2.Value);
  numericPoints.set("IDC_3", invertercommon.IDC_3.Value);
  numericPoints.set("IDC_4", invertercommon.IDC_4.Value);
  numericPoints.set("UDC", invertercommon.UDC.Value);
  numericPoints.set("UDC_2", invertercommon.UDC_2.Value);
  numericPoints.set("UDC_3", invertercommon.UDC_3.Value);
  numericPoints.set("UDC_4", invertercommon.UDC_4.Value);
  numericPoints.set("TOTAL_ENERGY", invertercommon.TOTAL_ENERGY.Value);

  const influxPoint = new Point("InverterCommon").timestamp(measurementTime);

  for (const [key, value] of numericPoints.entries()) {
    if (value == null) continue;
    influxPoint.floatField(key, value);
  }

  writeApi.writePoint(influxPoint);
  console.log(`${influxPoint.toLineProtocol(writeApi)}`);
};
