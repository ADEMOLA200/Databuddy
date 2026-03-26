export interface NormalizedPlan {
	id: string;
	name: string;
	priceMonthly: number;
	includedEventsMonthly: number;
	eventTiers: Array<{ to: number | "inf"; amount: number }> | null;
	assistantMessagesPerDay: number | null;
}
