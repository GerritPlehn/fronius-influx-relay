import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./index.ts";
import { meterSchema } from "../types/Meter.ts";

export const writeMeter = async (rawData: unknown) => {
  const data = meterSchema.parse(rawData);

  const meter = data.Body.Data;
  const measurementTime = data.Head.Timestamp;

  const numericPoints = new Map<string, number | null>();

  numericPoints.set("Current_AC_Phase_1", meter.Current_AC_Phase_1);
  numericPoints.set("Current_AC_Phase_2", meter.Current_AC_Phase_2);
  numericPoints.set("Current_AC_Phase_3", meter.Current_AC_Phase_3);
  numericPoints.set("Current_AC_Sum", meter.Current_AC_Sum);
  numericPoints.set(
    "EnergyReactive_VArAC_Sum_Consumed",
    meter.EnergyReactive_VArAC_Sum_Consumed
  );
  numericPoints.set(
    "EnergyReactive_VArAC_Sum_Produced",
    meter.EnergyReactive_VArAC_Sum_Produced
  );
  numericPoints.set(
    "EnergyReal_WAC_Minus_Absolute",
    meter.EnergyReal_WAC_Minus_Absolute
  );
  numericPoints.set(
    "EnergyReal_WAC_Plus_Absolute",
    meter.EnergyReal_WAC_Plus_Absolute
  );
  numericPoints.set(
    "EnergyReal_WAC_Sum_Consumed",
    meter.EnergyReal_WAC_Sum_Consumed
  );
  numericPoints.set(
    "EnergyReal_WAC_Sum_Produced",
    meter.EnergyReal_WAC_Sum_Produced
  );
  numericPoints.set("Frequency_Phase_Average", meter.Frequency_Phase_Average);
  numericPoints.set("PowerApparent_S_Phase_1", meter.PowerApparent_S_Phase_1);
  numericPoints.set("PowerApparent_S_Phase_2", meter.PowerApparent_S_Phase_2);
  numericPoints.set("PowerApparent_S_Phase_3", meter.PowerApparent_S_Phase_3);
  numericPoints.set("PowerApparent_S_Sum", meter.PowerApparent_S_Sum);
  numericPoints.set("PowerFactor_Phase_1", meter.PowerFactor_Phase_1);
  numericPoints.set("PowerFactor_Phase_2", meter.PowerFactor_Phase_2);
  numericPoints.set("PowerFactor_Phase_3", meter.PowerFactor_Phase_3);
  numericPoints.set("PowerFactor_Sum", meter.PowerFactor_Sum);
  numericPoints.set("PowerReactive_Q_Phase_1", meter.PowerReactive_Q_Phase_1);
  numericPoints.set("PowerReactive_Q_Phase_2", meter.PowerReactive_Q_Phase_2);
  numericPoints.set("PowerReactive_Q_Phase_3", meter.PowerReactive_Q_Phase_3);
  numericPoints.set("PowerReactive_Q_Sum", meter.PowerReactive_Q_Sum);
  numericPoints.set("PowerReal_P_Phase_1", meter.PowerReal_P_Phase_1);
  numericPoints.set("PowerReal_P_Phase_2", meter.PowerReal_P_Phase_2);
  numericPoints.set("PowerReal_P_Phase_3", meter.PowerReal_P_Phase_3);
  numericPoints.set("PowerReal_P_Sum", meter.PowerReal_P_Sum);
  numericPoints.set(
    "Voltage_AC_PhaseToPhase_12",
    meter.Voltage_AC_PhaseToPhase_12
  );
  numericPoints.set(
    "Voltage_AC_PhaseToPhase_23",
    meter.Voltage_AC_PhaseToPhase_23
  );
  numericPoints.set(
    "Voltage_AC_PhaseToPhase_31",
    meter.Voltage_AC_PhaseToPhase_31
  );
  numericPoints.set("Voltage_AC_Phase_1", meter.Voltage_AC_Phase_1);
  numericPoints.set("Voltage_AC_Phase_2", meter.Voltage_AC_Phase_2);
  numericPoints.set("Voltage_AC_Phase_3", meter.Voltage_AC_Phase_3);

  const influxPoint = new Point("Meter").timestamp(measurementTime);

  for (const [key, value] of numericPoints.entries()) {
    if (value == null) continue;
    influxPoint.floatField(key, value);
  }

  writeApi.writePoint(influxPoint);
  console.log(`${influxPoint.toLineProtocol(writeApi)}`);
};
