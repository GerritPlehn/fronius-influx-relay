import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./index.ts";
import { powerFlowSchema } from "../types/PowerFlow";

export const writePowerFlow = async (rawData: unknown) => {
  const data = powerFlowSchema.parse(rawData);

  const inverter = data.Body.Data.Inverters[1];
  const site = data.Body.Data.Site;
  const measurementTime = data.Head.Timestamp;

  const numericPoints = new Map<string, number | null>();

  numericPoints.set("E_Total", inverter.E_Total);
  numericPoints.set("P", inverter.P);
  numericPoints.set("P_Akku", site.P_Akku);
  numericPoints.set("P_Grid", site.P_Grid);
  numericPoints.set("P_Load", site.P_Load);
  numericPoints.set("P_PV", site.P_PV);
  numericPoints.set("rel_Autonomy", site.rel_Autonomy);
  numericPoints.set("rel_SelfConsumption", site.rel_SelfConsumption);

  const influxPoint = new Point("PowerFlow").timestamp(measurementTime);

  for (const [key, value] of numericPoints.entries()) {
    if (value == null) continue;
    influxPoint.floatField(key, value);
  }

  if (inverter.Battery_Mode) {
    influxPoint.stringField("Battery_Mode", inverter.Battery_Mode);
  }

  writeApi.writePoint(influxPoint);
  console.log(`${influxPoint.toLineProtocol(writeApi)}`);
};
