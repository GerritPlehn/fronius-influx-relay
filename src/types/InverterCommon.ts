import { z } from "zod";

export const inverterCommonSchema = z.object({
  Body: z.object({
    Data: z.object({
      DAY_ENERGY: z.object({ Unit: z.string(), Value: z.null() }),
      DeviceStatus: z.object({
        ErrorCode: z.number(),
        InverterState: z.string(),
        StatusCode: z.number(),
      }),
      FAC: z.object({ Unit: z.string(), Value: z.number() }).optional(),
      IAC: z.object({ Unit: z.string(), Value: z.number() }),
      IDC: z.object({ Unit: z.string(), Value: z.number() }),
      IDC_2: z.object({ Unit: z.string(), Value: z.number() }),
      IDC_3: z.object({ Unit: z.string(), Value: z.null() }),
      IDC_4: z.object({ Unit: z.string(), Value: z.null() }),
      PAC: z.object({ Unit: z.string(), Value: z.number() }),
      SAC: z.object({ Unit: z.string(), Value: z.number() }),
      TOTAL_ENERGY: z.object({ Unit: z.string(), Value: z.number() }),
      UAC: z.object({ Unit: z.string(), Value: z.number() }),
      UDC: z.object({ Unit: z.string(), Value: z.number() }),
      UDC_2: z.object({ Unit: z.string(), Value: z.number() }),
      UDC_3: z.object({ Unit: z.string(), Value: z.null() }),
      UDC_4: z.object({ Unit: z.string(), Value: z.null() }),
      YEAR_ENERGY: z.object({ Unit: z.string(), Value: z.null() }),
    }),
  }),
  Head: z.object({
    RequestArguments: z.object({
      DataCollection: z.string(),
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

export type InverterCommon = z.infer<typeof inverterCommonSchema>;
