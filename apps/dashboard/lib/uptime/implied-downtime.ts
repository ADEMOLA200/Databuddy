const SECONDS_PER_DAY = 86_400;

function formatDurationSeconds(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds <= 0) {
		return "0s";
	}
	if (seconds < 60) {
		return `${Math.round(seconds)}s`;
	}

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.round(seconds % 60);

	if (minutes < 60) {
		return remainingSeconds > 0
			? `${minutes}m ${remainingSeconds}s`
			: `${minutes}m`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function formatImpliedDailyDowntimeDuration(
	uptimePercent: number
): string {
	const clamped = Math.min(100, Math.max(0, uptimePercent));
	const downtimeSeconds = ((100 - clamped) / 100) * SECONDS_PER_DAY;
	return formatDurationSeconds(downtimeSeconds);
}
