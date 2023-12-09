import { z } from "zod";

const batteryCellStatusSchema = z.number().transform((statusNumber) => {
  switch (statusNumber) {
    case 0:
      return "STANDBY";
    case 1:
      return "INACTIVE";
    case 2:
      return "DARKSTART";
    case 3:
      return "ACTIVE";
    case 4:
      return "FAULT";
    case 5:
      return "UPDATING";
    default:
      return statusNumber.toString();
  }
});

export const storageSchema = z.object({
  Body: z.object({
    Data: z.object({
      Controller: z
        .object({
          Capacity_Maximum: z.number(),
          Current_DC: z.number(),
          DesignedCapacity: z.number(),
          Enable: z.number(),
          StateOfCharge_Relative: z.number(),
          Status_BatteryCell: batteryCellStatusSchema,
          Temperature_Cell: z.number(),
          TimeStamp: z.number(),
          Voltage_DC: z.number(),
          Details: z.object({
            Manufacturer: z.string(),
            Model: z.string(),
            Serial: z.string(),
          }),
        })
        .optional(),
    }),
  }),
  Head: z.object({
    RequestArguments: z.object({
      DeviceId: z.string(),
      Scope: z.string(),
    }),
    Status: z.object({
      Code: z.number(),
      Reason: z.string(),
      UserMessage: z.string(),
    }),
    Timestamp: z.coerce.date(),
  }),
});

export type Storage = z.infer<typeof storageSchema>;
