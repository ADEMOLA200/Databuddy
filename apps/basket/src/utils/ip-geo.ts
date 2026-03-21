import { createHash } from "node:crypto";
import { cacheable } from "@databuddy/redis";
import { captureError, record } from "@lib/tracing";
import { log } from "evlog";
import { useLogger } from "evlog/elysia";
import type { City } from "@maxmind/geoip2-node";
import {
	AddressNotFoundError,
	BadMethodCallError,
	Reader,
} from "@maxmind/geoip2-node";

interface GeoIPReader extends Reader {
	city(ip: string): City;
}

function mergeGeoWideEvent(context: Record<string, unknown>): void {
	try {
		useLogger().set({ geo: context });
	} catch {
		log.info({ geo: context });
	}
}

const CDN_URL = "https://cdn.databuddy.cc/mmdb/GeoLite2-City.mmdb";

let reader: GeoIPReader | null = null;
let isLoading = false;
let loadPromise: Promise<void> | null = null;
let loadError: Error | null = null;
let dbBuffer: Buffer | null = null;

function loadDatabaseFromCdn(): Promise<Buffer> {
	return record("loadDatabaseFromCdn", async () => {
		try {
			const response = await fetch(CDN_URL);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch database from CDN: ${response.status} ${response.statusText}`
				);
			}

			const arrayBuffer = await response.arrayBuffer();
			const buf = Buffer.from(arrayBuffer);

			if (buf.length < 1_000_000) {
				throw new Error(`Database file seems too small: ${buf.length} bytes`);
			}

			return buf;
		} catch (error) {
			captureError(error, { message: "Failed to load database from CDN" });
			throw error;
		}
	});
}

function loadDatabase() {
	if (loadError) {
		throw loadError;
	}

	if (isLoading && loadPromise) {
		return loadPromise;
	}

	if (reader) {
		return;
	}

	isLoading = true;
	loadPromise = (async () => {
		try {
			dbBuffer = await loadDatabaseFromCdn();
			reader = Reader.openBuffer(dbBuffer) as GeoIPReader;
		} catch (error) {
			captureError(error, { message: "Failed to load GeoIP database" });
			loadError = error as Error;
			reader = null;
			dbBuffer = null;
		} finally {
			isLoading = false;
		}
	})();

	return loadPromise;
}

const ignore = ["127.0.0.1", "::1"];

const ipv4Regex =
	/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

function isValidIp(ip: string): boolean {
	return Boolean(ip && (ipv4Regex.test(ip) || ipv6Regex.test(ip)));
}

function getCloudflareCountry(headers: Headers): string | undefined {
	const cfCountry = headers.get("cf-ipcountry");
	if (cfCountry && cfCountry.length === 2) {
		return cfCountry;
	}
	return undefined;
}

function lookupGeoLocation(ip: string): Promise<{
	country: string | undefined;
	region: string | undefined;
	city: string | undefined;
}> {
	return record("lookupGeoLocation", async () => {
		if (!(reader || isLoading || loadError)) {
			try {
				await loadDatabase();
			} catch (error) {
				captureError(error, {
					message: "Failed to load database for IP lookup",
				});
				return { country: undefined, region: undefined, city: undefined };
			}
		}

		if (!reader) {
			return { country: undefined, region: undefined, city: undefined };
		}

		try {
			const response = reader.city(ip);
			return {
				country: response.country?.names?.en,
				region: response.subdivisions?.[0]?.names?.en,
				city: response.city?.names?.en,
			};
		} catch (error) {
			if (
				error instanceof AddressNotFoundError ||
				error instanceof BadMethodCallError
			) {
				return { country: undefined, region: undefined, city: undefined };
			}
			captureError(error, { message: "Error looking up IP" });
			return { country: undefined, region: undefined, city: undefined };
		}
	});
}

const getGeoLocation = cacheable(lookupGeoLocation, {
	expireInSec: 86_400 * 7,
	prefix: "geoip_location",
	staleWhileRevalidate: true,
	staleTime: 86_400,
});

export function anonymizeIp(ip: string): string {
	if (!ip) {
		return "";
	}

	const salt = process.env.IP_HASH_SALT || "databuddy-ip-salt";
	const hash = createHash("sha256");
	hash.update(`${ip}${salt}`);
	return hash.digest("hex").substring(0, 12);
}

export function getGeo(ip: string, request?: Request) {
	return record("getGeo", async () => {
		if (!ip || ignore.includes(ip) || !isValidIp(ip)) {
			mergeGeoWideEvent({ skipped: true, reason: "invalid_or_local_ip" });
			return {
				anonymizedIP: anonymizeIp(ip),
				country: undefined,
				region: undefined,
				city: undefined,
			};
		}

		const geo = await getGeoLocation(ip);

		if (!geo.country && request?.headers) {
			const cfCountry = getCloudflareCountry(request.headers);
			if (cfCountry) {
				mergeGeoWideEvent({
					source: "cloudflare_header",
					country: cfCountry,
				});
				return {
					anonymizedIP: anonymizeIp(ip),
					country: cfCountry,
					region: undefined,
					city: undefined,
				};
			}
		}

		return {
			anonymizedIP: anonymizeIp(ip),
			country: geo.country,
			region: geo.region,
			city: geo.city,
		};
	});
}

export function extractIpFromRequest(request: Request): string {
	const cfIp = request.headers.get("cf-connecting-ip");
	if (cfIp) {
		return cfIp.trim();
	}

	const forwardedFor = request.headers.get("x-forwarded-for");
	const firstIp = forwardedFor?.split(",")[0]?.trim();
	if (firstIp) {
		return firstIp;
	}

	const realIp = request.headers.get("x-real-ip");
	if (realIp) {
		return realIp.trim();
	}

	return "";
}

export function closeGeoIPReader(): void {
	if (reader) {
		reader = null;
	}
	if (dbBuffer) {
		dbBuffer = null;
	}
	loadPromise = null;
	loadError = null;
	isLoading = false;
}
