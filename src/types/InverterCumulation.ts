import { z } from "zod";

export const inverterCumulationSchema = z.object({
  Body: z.object({
    Data: z.object({
      DAY_ENERGY: z.object({
        Unit: z.string(),
        Value: z.number().nullable(),
      }),
      DeviceStatus: z.object({
        ErrorCode: z.number(),
        InverterState: z.string(),
        StatusCode: z.number(),
      }),
      PAC: z.object({ Unit: z.string(), Value: z.number().nullable() }),
      TOTAL_ENERGY: z.object({
        Unit: z.string(),
        Value: z.number(),
      }),
      YEAR_ENERGY: z.object({
        Unit: z.string(),
        Value: z.number().nullable(),
      }),
    }),
  }),
  Head: z.object({
    RequestArguments: z.object({ Scope: z.string() }),
    Status: z.object({
      Code: z.number(),
      Reason: z.string(),
      UserMessage: z.string(),
    }),
    Timestamp: z.coerce.date(),
  }),
});

export type InverterCumulation = z.infer<typeof inverterCumulationSchema>;
