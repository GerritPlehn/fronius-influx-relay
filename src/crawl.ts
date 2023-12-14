import { env } from "./env";
import { writeInverter3P } from "./influx/inverter3P";
import { writeInverterCommon } from "./influx/inverterCommon";
import { writeInverterCumulation } from "./influx/inverterCumulation";
import { writeMeter } from "./influx/meter";
import { writePowerFlow } from "./influx/powerFlow";
import { writeStorage } from "./influx/storage";

const baseUrl = `${env.INVERTER_URL}/solar_api/v1`;

type Writer = (data: unknown) => Promise<void>;
type Endpoint = { url: string; writer: Writer };

const endpoints: Endpoint[] = [
  {
    url:
      baseUrl +
      "/GetInverterRealtimeData.cgi?" +
      new URLSearchParams({
        Scope: "Device",
        DataCollection: "3PInverterData",
      }),
    writer: writeInverter3P,
  },
  {
    url:
      baseUrl +
      "/GetInverterRealtimeData.cgi?" +
      new URLSearchParams({
        Scope: "Device",
        DataCollection: "CommonInverterData",
      }),
    writer: writeInverterCommon,
  },
  {
    url:
      baseUrl +
      "/GetInverterRealtimeData.cgi?" +
      new URLSearchParams({
        Scope: "Device",
        DataCollection: "CumulationInverterData",
      }),
    writer: writeInverterCumulation,
  },
  {
    url:
      baseUrl +
      "/GetMeterRealtimeData.cgi?" +
      new URLSearchParams({
        Scope: "Device",
        DeviceId: "0",
      }),
    writer: writeMeter,
  },
  {
    url:
      baseUrl +
      "/GetStorageRealtimeData.cgi?" +
      new URLSearchParams({
        Scope: "Device",
        DeviceId: "0",
      }),
    writer: writeStorage,
  },
  {
    url: baseUrl + "/GetPowerFlowRealtimeData.fcgi",
    writer: writePowerFlow,
  },
];

export const crawlEndpoint = async (endpoint: Endpoint) => {
  const inverterResponse = await fetch(endpoint.url, {
    method: "GET",
  });
  const body = await inverterResponse.json();
  await endpoint.writer(body);
};

export const crawlFronius = async () => {
  for (const endpoint of endpoints) {
    try {
      await crawlEndpoint(endpoint);
    } catch (error) {
      console.error("Error while fetching endpoint", error);
    }
  }
};
