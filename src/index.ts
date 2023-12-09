import { Elysia } from "elysia";

import { close } from "./influx/index";
import { writePowerFlow } from "./influx/powerFlow";
import { writeMeter } from "./influx/meter";
import { writeInverter3P } from "./influx/inverter3P";
import { writeInverterCommon } from "./influx/inverterCommon";
import { writeInverterCumulation } from "./influx/inverterCumulation";
import { env } from "./env";

const app = new Elysia()
  .post("/powerflow", ({ body }) => writePowerFlow(body))
  .post("/meter", ({ body }) => writeMeter(body))
  .post("/inverter3P", ({ body }) => writeInverter3P(body))
  .post("/inverterCommon", ({ body }) => writeInverterCommon(body))
  .post("/inverterCumulation", ({ body }) => writeInverterCumulation(body))
  .listen(env.RELAY_PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const gracefulShutdown = async () => {
  await app.stop();
  await close();
  console.log("closed connections");
  process.exit();
};

process.on("beforeExit", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
