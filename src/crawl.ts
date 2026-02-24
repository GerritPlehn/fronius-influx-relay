import { writeApi } from "./influx";
import { inverter3PEndpoint } from "./influx/inverter3P";
import { inverterCommonEndpoint } from "./influx/inverterCommon";
import { inverterCumulationEndpoint } from "./influx/inverterCumulation";
import { meterEndpoint } from "./influx/meter";
import { powerFlowEndpoint } from "./influx/powerFlow";
import { storageEndpoint } from "./influx/storage";

type Writer = (data: unknown) => Promise<string | undefined>;
export type Endpoint = { url: string; writer: Writer; name: string };

const endpoints: Endpoint[] = [
	inverter3PEndpoint,
	inverterCommonEndpoint,
	inverterCumulationEndpoint,
	meterEndpoint,
	storageEndpoint,
	powerFlowEndpoint,
];

export const crawlEndpoint = async (endpoint: Endpoint) => {
	const inverterResponse = await fetch(endpoint.url, {
		method: "GET",
	});
	const body = await inverterResponse.json();
	const lineProtocol = await endpoint.writer(body);
	console.log(`${new Date().toISOString()}: ${lineProtocol}`);
};

export const crawlFronius = async () => {
	for (const endpoint of endpoints) {
		try {
			await crawlEndpoint(endpoint);
		} catch (error) {
			console.error(
				`${new Date().toISOString()}: Error while fetching endpoint`,
				error,
			);
		}
	}
	try {
		await writeApi.flush();
		console.log(`${new Date().toISOString()}: Successfully flushed to Influx`);
	} catch (error) {
		console.error(
			`${new Date().toISOString()}: Error while flushing writes to Influx`,
			error,
		);
	}
};
