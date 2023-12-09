import { Elysia } from "elysia";
import { CronJob } from "cron";

import { close } from "./influx/index";
import { writePowerFlow } from "./influx/powerFlow";
import { writeMeter } from "./influx/meter";
import { writeInverter3P } from "./influx/inverter3P";
import { writeInverterCommon } from "./influx/inverterCommon";
import { writeInverterCumulation } from "./influx/inverterCumulation";
import { env } from "./env";
import { crawlFronius } from "./crawl";

const app = new Elysia()
  .post("/powerflow", ({ body }) => writePowerFlow(body))
  .post("/meter", ({ body }) => writeMeter(body))
  .post("/inverter3P", ({ body }) => writeInverter3P(body))
  .post("/inverterCommon", ({ body }) => writeInverterCommon(body))
  .post("/inverterCumulation", ({ body }) => writeInverterCumulation(body))
  .listen(env.RELAY_PORT);

console.log(`Proxy is running at ${app.server?.hostname}:${app.server?.port}`);

const crawlJob = new CronJob(
  "0 * * * * *", // cronTime
  crawlFronius // onTick
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

if (env.CRAWL) {
  console.log(`started crawl schedule ${crawlJob.cronTime.toString()}`);
  crawlJob.start();
}
