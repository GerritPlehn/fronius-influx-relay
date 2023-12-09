import { z } from "zod";

export const MeterSchema = z.object({
  Body: z.object({
    Data: z.object({
      0: z.object({
        Current_AC_Phase_1: z.number(),
        Current_AC_Phase_2: z.number(),
        Current_AC_Phase_3: z.number(),
        Current_AC_Sum: z.number(),
        Details: z.object({
          Manufacturer: z.string(),
          Model: z.string(),
          Serial: z.string(),
        }),
        Enable: z.number(),
        EnergyReactive_VArAC_Sum_Consumed: z.number(),
        EnergyReactive_VArAC_Sum_Produced: z.number(),
        EnergyReal_WAC_Minus_Absolute: z.number(),
        EnergyReal_WAC_Plus_Absolute: z.number(),
        EnergyReal_WAC_Sum_Consumed: z.number(),
        EnergyReal_WAC_Sum_Produced: z.number(),
        Frequency_Phase_Average: z.number(),
        Meter_Location_Current: z.number(),
        PowerApparent_S_Phase_1: z.number(),
        PowerApparent_S_Phase_2: z.number(),
        PowerApparent_S_Phase_3: z.number(),
        PowerApparent_S_Sum: z.number(),
        PowerFactor_Phase_1: z.number(),
        PowerFactor_Phase_2: z.number(),
        PowerFactor_Phase_3: z.number(),
        PowerFactor_Sum: z.number(),
        PowerReactive_Q_Phase_1: z.number(),
        PowerReactive_Q_Phase_2: z.number(),
        PowerReactive_Q_Phase_3: z.number(),
        PowerReactive_Q_Sum: z.number(),
        PowerReal_P_Phase_1: z.number(),
        PowerReal_P_Phase_2: z.number(),
        PowerReal_P_Phase_3: z.number(),
        PowerReal_P_Sum: z.number(),
        TimeStamp: z.number(),
        Visible: z.number(),
        Voltage_AC_PhaseToPhase_12: z.number(),
        Voltage_AC_PhaseToPhase_23: z.number(),
        Voltage_AC_PhaseToPhase_31: z.number(),
        Voltage_AC_Phase_1: z.number(),
        Voltage_AC_Phase_2: z.number(),
        Voltage_AC_Phase_3: z.number(),
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

export type Meter = z.infer<typeof MeterSchema>;
