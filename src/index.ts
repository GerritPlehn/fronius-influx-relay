import { Elysia } from "elysia";

import { close } from "./influx/index";
import { powerFlowSchema } from "./types/PowerFlow";
import { writePowerFlow } from "./influx/powerFlow";
import { writeMeter } from "./influx/meter";
import { MeterSchema } from "./types/Meter";
import { writeInverter3P } from "./influx/inverter3P";
import { writeInverterCommon } from "./influx/inverterCommon";
import { writeInverterCumulation } from "./influx/inverterCumulation";
import { inverter3PSchema } from "./types/Inverter3P";
import { inverterCommonSchema } from "./types/InverterCommon";
import { inverterCumulationSchema } from "./types/InverterCumulation";
import { env } from "./env";

const app = new Elysia()
  .post("/powerflow", ({ body }) => writePowerFlow(powerFlowSchema.parse(body)))
  .post("/meter", ({ body }) => writeMeter(MeterSchema.parse(body)))
  .post("/inverter3P", ({ body }) =>
    writeInverter3P(inverter3PSchema.parse(body))
  )
  .post("/inverterCommon", ({ body }) =>
    writeInverterCommon(inverterCommonSchema.parse(body))
  )
  .post("/inverterCumulation", ({ body }) =>
    writeInverterCumulation(inverterCumulationSchema.parse(body))
  )
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
