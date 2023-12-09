import { z } from "zod";
export const powerFlowSchema = z.object({
  Body: z.object({
    Data: z.object({
      Inverters: z.object({
        1: z.object({
          DT: z.number(),
          E_Day: z.number().nullable(),
          E_Total: z.number(),
          E_Year: z.number().nullable(),
          P: z.number(),
          Battery_Mode: z.string().optional(),
        }),
      }),
      SecondaryMeters: z.object({}),
      Site: z.object({
        BackupMode: z.boolean(),
        E_Day: z.number().nullable(),
        E_Total: z.number(),
        E_Year: z.number().nullable(),
        Meter_Location: z.string(),
        Mode: z.string(),
        P_Akku: z.number().nullable(),
        P_Grid: z.number(),
        P_Load: z.number(),
        P_PV: z.number(),
        rel_Autonomy: z.number(),
        rel_SelfConsumption: z.number().nullable(),
      }),
      Smartloads: z.object({ Ohmpilots: z.object({}) }),
      Version: z.string(),
    }),
  }),
  Head: z.object({
    RequestArguments: z.object({}),
    Status: z.object({
      Code: z.number(),
      Reason: z.string(),
      UserMessage: z.string(),
    }),
    Timestamp: z.coerce.date(),
  }),
});

export type PowerFlow = z.infer<typeof powerFlowSchema>;
