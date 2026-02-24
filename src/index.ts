import { CronJob } from "cron";
import { Elysia } from "elysia";
import { crawlFronius } from "./crawl";
import { env } from "./env";
import { close } from "./influx/index";
import { writeInverter3P } from "./influx/inverter3P";
import { writeInverterCommon } from "./influx/inverterCommon";
import { writeInverterCumulation } from "./influx/inverterCumulation";
import { writeMeter } from "./influx/meter";
import { writePowerFlow } from "./influx/powerFlow";

const app = new Elysia()
	.post("/powerflow", ({ body }) => writePowerFlow(body))
	.post("/meter", ({ body }) => writeMeter(body))
	.post("/inverter3P", ({ body }) => writeInverter3P(body))
	.post("/inverterCommon", ({ body }) => writeInverterCommon(body))
	.post("/inverterCumulation", ({ body }) => writeInverterCumulation(body))
	.listen(env.RELAY_PORT);

console.log(
	`${new Date().toISOString()}: Proxy is running at ${app.server?.hostname}:${app.server?.port}`,
);

const crawlJob = new CronJob(
	"0 * * * * *", // cronTime
	crawlFronius, // onTick
);

const gracefulShutdown = async () => {
	await app.stop();
	await close();
	console.log(`${new Date().toISOString()}: closed connections`);
	process.exit();
};

process.on("beforeExit", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

if (env.CRAWL) {
	console.log(
		`${new Date().toISOString()}: started crawl schedule ${crawlJob.cronTime.toString()}`,
	);
	crawlJob.start();
}
