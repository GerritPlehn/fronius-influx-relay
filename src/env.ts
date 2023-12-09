import { z } from "zod";

const envShape = z.object({
  INFLUX_URL: z.string().min(1),
  INFLUX_TOKEN: z.string().min(1),
  INFLUX_ORG: z.string().default("default"),
  INFLUX_BUCKET: z.string().default("fronius"),
  RELAY_PORT: z.coerce.number().default(3000),
  INVERTER_URL: z.string(),
});

const env = envShape.parse(process.env);

export const influx = {
  url: env.INFLUX_URL,
  token: env.INFLUX_TOKEN,
  org: env.INFLUX_ORG,
  bucket: env.INFLUX_BUCKET,
};

export { env };
