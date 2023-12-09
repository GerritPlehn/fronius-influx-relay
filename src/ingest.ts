import { writeApi } from "./influx/index";
import { readdirSync } from "fs";
import { powerFlowSchema } from "./types/PowerFlow";
import { writePowerFlow } from "./influx/powerFlow";
import { writeInverterCumulation } from "./influx/inverterCumulation";
import { inverterCumulationSchema } from "./types/InverterCumulation";
import { MeterSchema } from "./types/Meter";
import { writeMeter } from "./influx/meter";

const files = readdirSync("./data/powerflow");
for (const file of files) {
  console.log(file);
  const content = await Bun.file("./data/powerflow/" + file).json();
  writePowerFlow(powerFlowSchema.parse(content));
}
await writeApi.close();
