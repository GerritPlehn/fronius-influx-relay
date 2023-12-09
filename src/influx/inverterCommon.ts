import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./index.ts";
import type { InverterCommon } from "../types/InverterCommon.ts";

export const writeInverterCommon = async (data: InverterCommon) => {
  const invertercommon = data.Body.Data;
  const measurementTime = data.Head.Timestamp;

  const numericPoints = new Map<string, number | null>();

  numericPoints.set("FAC", invertercommon.FAC?.Value ?? null);
  numericPoints.set("IAC", invertercommon.IAC.Value);
  numericPoints.set("IDC", invertercommon.IDC.Value);
  numericPoints.set("IDC_2", invertercommon.IDC_2.Value);
  numericPoints.set("PAC", invertercommon.PAC.Value);
  numericPoints.set("SAC", invertercommon.SAC.Value);
  numericPoints.set("TOTAL_ENERGY", invertercommon.TOTAL_ENERGY.Value);
  numericPoints.set("UAC", invertercommon.UAC.Value);
  numericPoints.set("UDC", invertercommon.UDC.Value);
  numericPoints.set("UDC_2", invertercommon.UDC_2.Value);

  const influxPoint = new Point("InverterCommon").timestamp(measurementTime);

  for (const [key, value] of numericPoints.entries()) {
    if (!value) {
      continue;
    }
    influxPoint.floatField(key, value);
  }

  writeApi.writePoint(influxPoint);
  console.log(`${influxPoint.toLineProtocol(writeApi)}`);
};
