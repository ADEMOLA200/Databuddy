import { z } from "zod";

export const insightSchema = z.object({
	title: z
		.string()
		.describe(
			"Brief headline under 60 chars with the key number. Never paste raw URL paths that contain opaque ID segments (long random slugs). Use human labels from Top Pages 'Human label' (e.g. 'Demo page', 'Pricing page', 'Home') instead of paths like /demo/xYz12…"
		),
	description: z
		.string()
		.describe(
			"2-5 complete sentences with specific numbers from BOTH periods; use more sentences when the insight ties together multiple metrics (e.g. traffic + geography + vitals). End with a full stop. Do not truncate mid-sentence or end with '...'. Name pages using human labels when the path has opaque IDs. Explain cause only when grounded in the data or annotations."
		),
	suggestion: z
		.string()
		.describe(
			"One or two sentences tied to THIS product's data only: cite concrete figures from tool results (e.g. two page paths, two visitor counts, or bounce/session metrics). Do not give generic marketing platitudes or hypothetical tactics; if you recommend a CTA or experiment, anchor it to numbers you stated above."
		),
	severity: z.enum(["critical", "warning", "info"]),
	sentiment: z
		.enum(["positive", "neutral", "negative"])
		.describe(
			"positive = improving metric, neutral = stable, negative = declining or broken"
		),
	priority: z
		.number()
		.min(1)
		.max(10)
		.describe(
			"1-10 from actionability × business impact, NOT raw % magnitude. User-facing errors, conversion/session drops, or reliability issues outrank vanity traffic spikes. A 5% drop in a meaningful engagement metric can score higher than a 70% visitor increase with no conversion context. Reserve 8-10 for issues that hurt users or revenue signals in the data."
		),
	type: z.enum([
		"error_spike",
		"new_errors",
		"vitals_degraded",
		"custom_event_spike",
		"traffic_drop",
		"traffic_spike",
		"bounce_rate_change",
		"engagement_change",
		"referrer_change",
		"page_trend",
		"positive_trend",
		"performance",
		"uptime_issue",
	]),
	changePercent: z
		.number()
		.optional()
		.describe(
			"Signed week-over-week % for the primary metric in this insight: (current−previous)/previous×100. Positive when that metric rose (more visitors, more errors, higher rate), negative when it fell. Must match the headline magnitude; do not flip the sign based on sentiment (e.g. channel-risk stories still use a positive % when traffic grew)."
		),
});

export const insightsOutputSchema = z.object({
	insights: z
		.array(insightSchema)
		.max(3)
		.describe(
			"1-3 insights ranked by actionability × business impact. When the week is mostly positive, at least one insight MUST still call out a material risk or watch (e.g. session duration down, bounce up, single-channel dependency, volatile referrer, error count up in absolute terms) if those signals appear in the data—do not only celebrate wins. Skip repeating a narrative already listed under recently reported insights unless the change is materially new."
		),
});

export type ParsedInsight = z.infer<typeof insightSchema>;
