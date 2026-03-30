"use client";

import {
	ArrowDownIcon,
	ArrowUpIcon,
	BugIcon,
	EyeIcon,
	LightningIcon,
	WarningCircleIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import type { ElementType } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AnomalyCardProps {
	metric: string;
	type: "spike" | "drop";
	severity: "warning" | "critical";
	currentValue: number;
	baselineMean: number;
	zScore: number;
	percentChange: number;
	periodStart: string;
	periodEnd: string;
	eventName?: string;
}

const METRIC_CONFIG: Record<
	string,
	{ label: string; icon: ElementType; color: string }
> = {
	pageviews: {
		label: "Pageviews",
		icon: EyeIcon,
		color: "text-blue-500",
	},
	custom_events: {
		label: "Custom Event",
		icon: LightningIcon,
		color: "text-violet-500",
	},
	errors: {
		label: "Errors",
		icon: BugIcon,
		color: "text-red-500",
	},
};

function formatCompact(value: number): string {
	return Intl.NumberFormat(undefined, {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

function formatPeriod(start: string, end: string): string {
	const startDate = new Date(`${start.replace(" ", "T")}Z`);
	const endDate = new Date(`${end.replace(" ", "T")}Z`);

	const formatter = new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});

	return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

export function AnomalyCard({
	metric,
	type,
	severity,
	currentValue,
	baselineMean,
	zScore,
	percentChange,
	periodStart,
	periodEnd,
	eventName,
}: AnomalyCardProps) {
	const config = METRIC_CONFIG[metric] ?? METRIC_CONFIG.pageviews;
	const MetricIcon = config.icon;
	const DirectionIcon = type === "spike" ? ArrowUpIcon : ArrowDownIcon;
	const SeverityIcon =
		severity === "critical" ? WarningCircleIcon : WarningIcon;

	const isCritical = severity === "critical";

	return (
		<div
			className={cn(
				"group rounded border p-4 transition-colors hover:bg-accent/50",
				isCritical && "border-destructive/30 bg-destructive/5"
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-start gap-3">
					<div
						className={cn(
							"flex size-9 shrink-0 items-center justify-center rounded bg-accent",
							isCritical && "bg-destructive/10"
						)}
					>
						<MetricIcon
							className={cn("size-4", config.color)}
							weight="duotone"
						/>
					</div>
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<span className="font-medium text-foreground text-sm">
								{eventName ?? config.label}
							</span>
							<Badge
								className="gap-1"
								variant={isCritical ? "destructive" : "amber"}
							>
								<SeverityIcon className="size-3" weight="fill" />
								{severity}
							</Badge>
						</div>
						<p className="mt-0.5 text-pretty text-muted-foreground text-xs">
							{type === "spike" ? "Unusually high" : "Unusually low"} compared
							to the 7-day hourly baseline
						</p>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-1.5 text-right">
					<DirectionIcon
						className={cn(
							"size-4",
							type === "spike" ? "text-destructive" : "text-blue-500"
						)}
						weight="fill"
					/>
					<span
						className={cn(
							"font-semibold text-sm tabular-nums",
							type === "spike" ? "text-destructive" : "text-blue-500"
						)}
					>
						{percentChange > 0 ? "+" : ""}
						{percentChange.toFixed(1)}%
					</span>
				</div>
			</div>

			<div className="mt-3 grid grid-cols-3 gap-3 rounded bg-accent/50 p-2.5">
				<div>
					<p className="text-[10px] text-muted-foreground uppercase tracking-wider">
						Current
					</p>
					<p className="mt-0.5 font-semibold text-foreground text-sm tabular-nums">
						{formatCompact(currentValue)}
					</p>
				</div>
				<div>
					<p className="text-[10px] text-muted-foreground uppercase tracking-wider">
						Baseline
					</p>
					<p className="mt-0.5 font-semibold text-foreground text-sm tabular-nums">
						{formatCompact(baselineMean)}
					</p>
				</div>
				<div>
					<p className="text-[10px] text-muted-foreground uppercase tracking-wider">
						Z-Score
					</p>
					<p className="mt-0.5 font-semibold text-foreground text-sm tabular-nums">
						{zScore > 0 ? "+" : ""}
						{zScore.toFixed(2)}
					</p>
				</div>
			</div>

			<p className="mt-2 text-[11px] text-muted-foreground tabular-nums">
				{formatPeriod(periodStart, periodEnd)}
			</p>
		</div>
	);
}
