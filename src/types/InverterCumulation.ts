import { z } from "zod";

export const inverterCumulationSchema = z.object({
  Body: z.object({
    Data: z.object({
      DAY_ENERGY: z.object({
        Unit: z.string(),
        Values: z.object({ 1: z.null() }),
      }),
      PAC: z.object({ Unit: z.string(), Values: z.object({ 1: z.number() }) }),
      TOTAL_ENERGY: z.object({
        Unit: z.string(),
        Values: z.object({ 1: z.number() }),
      }),
      YEAR_ENERGY: z.object({
        Unit: z.string(),
        Values: z.object({ 1: z.null() }),
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
