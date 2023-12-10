# Fronius InfluxDB Relay

Extracts realtime information from Fronius branded inverters and saves it into an InfluxDB.

The Fronius inverters expose an HTTP API ("Solar API") on the local network that can be used to query realtime information about the system.

This tool exposes an HTTP API on its own that takes in responses of the Solar API and saves them to an InfluxDB. This allows you to use your scheduling system, or easier integration with other automation platforms like node-red or n8n.

Alternatively there's a built-in crawler that can query the Solar API without the need for an external scheduling system or automation platform.

## Configuration

Use environment variables to provide configuration options.

- `INFLUX_URL` (required) URL of your InfluxDB - example: `https://my.influx.db`
- `INFLUX_TOKEN` (required) Access Token for InfluxDB
- `INFLUX_ORG` (optional) InfluxDB Organization - defaults to `default`
- `INFLUX_BUCKET` (optional) InfluxDB Bucket - defaults to `fronius`
- `CRAWL` (optional) `true` or `false` whether or not to automatically crawl - defaults to `false`
- `INVERTER_URL` (required) URL to the inverter, set arbitrary value if `CRAWL=false` - example `http://192.168.0.123`

Note: the crawling interval is set to once per minute. Configuration option for this will follow in a future update.

## Supported Endpoints

We use the Solar API V1, documentation for which is unfortunately gated content on the Fronius website [here](https://www.fronius.com/en/solar-energy/installers-partners/technical-data/all-products/system-monitoring/open-interfaces/fronius-solar-api-json-). Document Version 18 (42,0410,2012,EN 018­21042023) was used for implementation.

Currently only one meter and storage device each is supported. The implementation focused on the endpoints for GEN24 devices. PRs for Hybrid/Non Hybrid inverters are welcome.

Note that metrics with `null` values will be discarded from the data point.

| Endpoint                      | Parameter 1  | Parameter 2                           | InfluxDB Point     |
| ----------------------------- | ------------ | ------------------------------------- | ------------------ |
| GetInverterRealtimeData.cgi   | Scope=Device | DataCollection=CumulationInverterData | InverterCumulation |
| GetInverterRealtimeData.cgi   | Scope=Device | DataCollection=CommonInverterData     | InverterCommon     |
| GetInverterRealtimeData.cgi   | Scope=Device | DataCollection=3PInverterData         | Inverter3P         |
| GetStorageRealtimeData.cgi    | Scope=Device | DeviceId=0                            | Storage            |
| GetMeterRealtimeData.cgi      | Scope=Device | DeviceId=0                            | Meter              |
| GetPowerFlowRealtimeData.fcgi |              |                                       | PowerFlow          |

## Deploying with Docker

Refer to the [Github container registry for this project](https://ghcr.io/gerritplehn/fronius-influx-relay) and the [Configuration](#configuration) section of this document.

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

This project was created using Bun. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

This project is not an official product by Fronius. It is provided as is.
