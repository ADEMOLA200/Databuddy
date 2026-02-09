"use client";

import type { DynamicQueryFilter } from "@databuddy/shared/types/api";
import dayjs from "dayjs";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import { useOrganizationsContext } from "@/components/providers/organizations-provider";
import { useWebsitesLight } from "@/hooks/use-websites";

type RefreshFn = () => void;

/**
 * "no-website" = events not tied to any website (default)
 * "all" = all events across the organization
 * string = a specific websiteId
 */
export type WebsiteFilterMode = "no-website" | "all" | string;

interface EventsPageContextValue {
	websiteFilterMode: WebsiteFilterMode;
	setWebsiteFilterMode: (mode: WebsiteFilterMode) => void;
	selectedWebsite: { id: string; name: string; domain: string } | undefined;
	websites: Array<{ id: string; name: string; domain: string }>;
	isLoadingWebsites: boolean;
	queryOptions: { websiteId?: string; organizationId?: string };
	websiteFilters: DynamicQueryFilter[];
	hasQueryId: boolean;
	dateRange: {
		start_date: string;
		end_date: string;
		granularity: "daily" | "hourly";
	};
	isLoadingOrg: boolean;
	registerRefresh: (fn: RefreshFn) => () => void;
	refresh: () => void;
	isFetching: boolean;
	setIsFetching: (fetching: boolean) => void;
}

const EventsPageContext = createContext<EventsPageContextValue | null>(null);

export const DEFAULT_DATE_RANGE = {
	start_date: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
	end_date: dayjs().format("YYYY-MM-DD"),
	granularity: "daily" as const,
};

export function EventsPageProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { activeOrganization, isLoading: isLoadingOrg } =
		useOrganizationsContext();
	const { websites, isLoading: isLoadingWebsites } = useWebsitesLight();
	const [websiteFilterMode, setWebsiteFilterMode] =
		useState<WebsiteFilterMode>("no-website");
	const [isFetching, setIsFetching] = useState(false);
	const refreshFnsRef = useRef<Set<RefreshFn>>(new Set());

	const registerRefresh = useCallback((fn: RefreshFn) => {
		refreshFnsRef.current.add(fn);
		return () => {
			refreshFnsRef.current.delete(fn);
		};
	}, []);

	const refresh = useCallback(() => {
		for (const fn of refreshFnsRef.current) {
			fn();
		}
	}, []);

	const isSpecificWebsite =
		websiteFilterMode !== "no-website" && websiteFilterMode !== "all";

	const queryOptions = useMemo(() => {
		if (isSpecificWebsite) {
			return { websiteId: websiteFilterMode };
		}
		if (activeOrganization?.id) {
			return { organizationId: activeOrganization.id };
		}
		return {};
	}, [isSpecificWebsite, websiteFilterMode, activeOrganization?.id]);

	const websiteFilters = useMemo<DynamicQueryFilter[]>(() => {
		if (websiteFilterMode === "no-website") {
			return [{ field: "website_id", operator: "eq", value: "" }];
		}
		return [];
	}, [websiteFilterMode]);

	const hasQueryId = !!(isSpecificWebsite || activeOrganization?.id);
	const selectedWebsite = isSpecificWebsite
		? websites.find((w) => w.id === websiteFilterMode)
		: undefined;

	const value = useMemo(
		() => ({
			websiteFilterMode,
			setWebsiteFilterMode,
			selectedWebsite,
			websites,
			isLoadingWebsites,
			queryOptions,
			websiteFilters,
			hasQueryId,
			dateRange: DEFAULT_DATE_RANGE,
			isLoadingOrg,
			registerRefresh,
			refresh,
			isFetching,
			setIsFetching,
		}),
		[
			websiteFilterMode,
			selectedWebsite,
			websites,
			isLoadingWebsites,
			queryOptions,
			websiteFilters,
			hasQueryId,
			isLoadingOrg,
			registerRefresh,
			refresh,
			isFetching,
		]
	);

	return (
		<EventsPageContext.Provider value={value}>
			{children}
		</EventsPageContext.Provider>
	);
}

export function useEventsPageContext() {
	const context = useContext(EventsPageContext);
	if (!context) {
		throw new Error(
			"useEventsPageContext must be used within EventsPageProvider"
		);
	}
	return context;
}
