"use client";

import {
	ArrowClockwiseIcon,
	CheckCircleIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { EmptyState } from "@/components/empty-state";
import { RightSidebar } from "@/components/right-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/orpc";
import { AnomalyCard } from "./anomaly-card";

interface AnomaliesPageContentProps {
	params: Promise<{ id: string }>;
}

interface Anomaly {
	metric: "pageviews" | "custom_events" | "errors";
	type: "spike" | "drop";
	severity: "warning" | "critical";
	currentValue: number;
	baselineMean: number;
	baselineStdDev: number;
	zScore: number;
	percentChange: number;
	detectedAt: string;
	periodStart: string;
	periodEnd: string;
	eventName?: string;
}

export function AnomaliesPageContent({ params }: AnomaliesPageContentProps) {
	const { id: websiteId } = use(params);

	const {
		data: anomalies,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		...orpc.anomalies.detect.queryOptions({
			input: { websiteId },
		}),
		refetchInterval: 300_000,
	});

	const items = (anomalies ?? []) as Anomaly[];
	const criticalCount = items.filter((a) => a.severity === "critical").length;
	const warningCount = items.filter((a) => a.severity === "warning").length;
	const spikeCount = items.filter((a) => a.type === "spike").length;
	const dropCount = items.filter((a) => a.type === "drop").length;

	const metricCounts = new Map<string, number>();
	for (const item of items) {
		const key = item.eventName ?? item.metric;
		metricCounts.set(key, (metricCounts.get(key) ?? 0) + 1);
	}

	return (
		<div className="h-full lg:grid lg:grid-cols-[1fr_18rem]">
			<div className="flex flex-col overflow-y-auto">
				{/* Header */}
				<div className="flex shrink-0 flex-col justify-between gap-3 border-b p-4 sm:flex-row sm:items-center sm:p-5">
					<div className="flex items-center gap-3">
						<div className="rounded-lg border bg-secondary p-2.5">
							<WarningIcon
								className="size-5 text-accent-foreground"
								weight="duotone"
							/>
						</div>
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<h1 className="text-balance font-medium text-foreground text-xl">
									Anomaly Detection
								</h1>
								{!isLoading && items.length > 0 && (
									<Badge variant={criticalCount > 0 ? "destructive" : "amber"}>
										{items.length}
									</Badge>
								)}
							</div>
							<p className="text-muted-foreground text-xs">
								Automatic detection of unusual patterns in your event data
							</p>
						</div>
					</div>
					<Button
						disabled={isFetching}
						onClick={() => refetch()}
						size="sm"
						variant="outline"
					>
						<ArrowClockwiseIcon
							className={`mr-1.5 size-4 ${isFetching ? "animate-spin" : ""}`}
						/>
						{isFetching ? "Scanning..." : "Scan Now"}
					</Button>
				</div>

				{/* Loading */}
				{isLoading && (
					<div className="space-y-3 p-4 sm:p-5">
						{Array.from({ length: 3 }).map((_, i) => (
							<div className="rounded border p-4" key={`skel-${i + 1}`}>
								<div className="flex items-start gap-3">
									<Skeleton className="size-9 shrink-0 rounded" />
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2">
											<Skeleton className="h-5 w-32" />
											<Skeleton className="h-5 w-16" />
										</div>
										<Skeleton className="h-4 w-56" />
									</div>
									<Skeleton className="h-5 w-16" />
								</div>
								<Skeleton className="mt-3 h-14 w-full rounded" />
							</div>
						))}
					</div>
				)}

				{/* No anomalies */}
				{!isLoading && items.length === 0 && (
					<div className="flex flex-1 items-center justify-center py-16">
						<EmptyState
							description="No unusual patterns detected in the last hour compared to your 7-day baseline. We check pageviews, errors, and custom events automatically."
							icon={<CheckCircleIcon weight="duotone" />}
							title="All clear"
							variant="minimal"
						/>
					</div>
				)}

				{/* Anomaly list */}
				{!isLoading && items.length > 0 && (
					<div className="space-y-3 p-4 sm:p-5">
						{items.map((anomaly, idx) => (
							<AnomalyCard
								baselineMean={anomaly.baselineMean}
								currentValue={anomaly.currentValue}
								eventName={anomaly.eventName}
								key={`${anomaly.metric}-${anomaly.eventName ?? ""}-${idx}`}
								metric={anomaly.metric}
								percentChange={anomaly.percentChange}
								periodEnd={anomaly.periodEnd}
								periodStart={anomaly.periodStart}
								severity={anomaly.severity}
								type={anomaly.type}
								zScore={anomaly.zScore}
							/>
						))}
					</div>
				)}
			</div>

			<RightSidebar className="gap-0 p-0">
				<RightSidebar.Section border title="Summary">
					{isLoading ? (
						<div className="space-y-2.5">
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-full" />
						</div>
					) : (
						<div className="space-y-2.5">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Critical</span>
								<span className="font-medium text-sm tabular-nums">
									{criticalCount}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Warning</span>
								<span className="font-medium text-sm tabular-nums">
									{warningCount}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Spikes</span>
								<span className="font-medium text-sm tabular-nums">
									{spikeCount}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Drops</span>
								<span className="font-medium text-sm tabular-nums">
									{dropCount}
								</span>
							</div>
						</div>
					)}
				</RightSidebar.Section>

				<RightSidebar.Section border title="Affected Metrics">
					{isLoading ? (
						<div className="space-y-2">
							<Skeleton className="h-5 w-full" />
						</div>
					) : metricCounts.size > 0 ? (
						<div className="space-y-2">
							{[...metricCounts.entries()].map(([name, count]) => (
								<div className="flex items-center justify-between" key={name}>
									<span className="truncate text-muted-foreground text-sm">
										{name}
									</span>
									<Badge variant="outline">{count}</Badge>
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground text-xs">No anomalies found</p>
					)}
				</RightSidebar.Section>

				<RightSidebar.Section>
					<RightSidebar.Tip description="Anomalies are detected by comparing the last completed hour against a rolling 7-day hourly baseline using Z-score analysis. Create a traffic_spike or error_rate alarm in Notifications to get alerted." />
				</RightSidebar.Section>
			</RightSidebar>
		</div>
	);
}
