import { z } from "zod";

export const inverter3PSchema = z.object({
  Body: z.object({
    Data: z.object({
      IAC_L1: z.object({ Unit: z.string(), Value: z.number().nullable() }),
      IAC_L2: z.object({ Unit: z.string(), Value: z.number().nullable() }),
      IAC_L3: z.object({ Unit: z.string(), Value: z.number().nullable() }),
      UAC_L1: z.object({ Unit: z.string(), Value: z.number().nullable() }),
      UAC_L2: z.object({ Unit: z.string(), Value: z.number().nullable() }),
      UAC_L3: z.object({ Unit: z.string(), Value: z.number().nullable() }),
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

export type Inverter3P = z.infer<typeof inverter3PSchema>;
