import { localDayjs } from "@/lib/time";

export interface UptimeHeatmapDay {
	date: Date;
	dateStr: string;
	hasData: boolean;
	uptime: number;
}

export function buildUptimeHeatmapDays(
	data: Array<{ date: string; uptime_percentage?: number }>,
	days: number
): UptimeHeatmapDay[] {
	const result: UptimeHeatmapDay[] = [];
	const today = localDayjs().endOf("day");

	for (let i = days - 1; i >= 0; i--) {
		const date = today.subtract(i, "day");
		const dateStr = date.format("YYYY-MM-DD");

		const dayData = data.find(
			(d) => localDayjs(d.date).format("YYYY-MM-DD") === dateStr
		);

		result.push({
			date: date.toDate(),
			dateStr,
			hasData: !!dayData,
			uptime: dayData?.uptime_percentage ?? 0,
		});
	}
	return result;
}
