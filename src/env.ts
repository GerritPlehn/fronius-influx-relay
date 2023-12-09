import { z } from "zod";

const envShape = z.object({
  url: z.string(),
  token: z.string(),
  org: z.string(),
  bucket: z.string(),
});

const env = envShape.parse({
  url: process.env.URL,
  token: process.env.TOKEN,
  org: process.env.ORG,
  bucket: process.env.BUCKET,
});

export { env };
