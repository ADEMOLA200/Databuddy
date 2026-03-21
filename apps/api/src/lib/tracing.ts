import { log } from "evlog";
import { useLogger } from "evlog/elysia";

/**
 * Run a named operation. Kept for call-site compatibility; request-level timing
 * is emitted by evlog on the wide event.
 */
export function record<T>(_name: string, fn: () => Promise<T> | T): Promise<T> {
	return Promise.resolve().then(() => fn());
}

/**
 * Merge structured fields into the active request wide event.
 */
export function setAttributes(
	attributes: Record<string, string | number | boolean>
): void {
	try {
		useLogger().set(attributes as Record<string, unknown>);
	} catch {
		log.info({ service: "api", ...attributes });
	}
}

/**
 * Attach an error to the active request wide event when inside the evlog
 * middleware; otherwise emit a global structured log line.
 */
export function captureError(
	error: unknown,
	attributes?: Record<string, string | number | boolean>
): void {
	const err = error instanceof Error ? error : new Error(String(error));
	try {
		const requestLog = useLogger();
		if (attributes) {
			requestLog.error(err, attributes as Record<string, unknown>);
		} else {
			requestLog.error(err);
		}
	} catch {
		log.error({
			service: "api",
			error: err.message,
			...(attributes ?? {}),
		});
	}
}
