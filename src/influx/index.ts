import { InfluxDB, HttpError } from "@influxdata/influxdb-client";

import { env } from "../env.ts";
import { hostname } from "node:os";

const { url, token, org, bucket } = env;

// create a write API, expecting point timestamps in nanoseconds (can be also 's', 'ms', 'us')
export const writeApi = new InfluxDB({ url, token }).getWriteApi(
  org,
  bucket,
  "ns"
);
// setup default tags for all writes through this API

export const close = async () => {
  // WriteApi always buffer data into batches to optimize data transfer to InfluxDB server.
  // writeApi.flush() can be called to flush the buffered data. The data is always written
  // asynchronously, Moreover, a failed write (caused by a temporary networking or server failure)
  // is retried automatically. Read `writeAdvanced.js` for better explanation and details.
  //
  // close() flushes the remaining buffered data and then cancels pending retries.
  try {
    await writeApi.close();
    console.log("Closed influx connection");
  } catch (e) {
    console.error(e);
    if (e instanceof HttpError && e.statusCode === 401) {
      console.log("Run ./onboarding.js to setup a new InfluxDB database.");
    }
    console.log("\nFinished ERROR");
  }
};
