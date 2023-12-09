import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./index.ts";
import type { Storage } from "../types/Storage.ts";

export const writeStorage = async (data: Storage) => {
  const storage = data.Body.Data.Controller;
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
    if (!value) {
      continue;
    }
    influxPoint.floatField(key, value);
  }

  influxPoint.stringField("Status_BatteryCell", storage.Status_BatteryCell);

  writeApi.writePoint(influxPoint);
  console.log(`${influxPoint.toLineProtocol(writeApi)}`);
};
