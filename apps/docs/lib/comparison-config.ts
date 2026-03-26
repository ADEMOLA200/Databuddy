export interface ComparisonFeature {
	name: string;
	databuddy: boolean;
	competitor: boolean;
	benefit: string;
	category: "privacy" | "performance" | "features" | "pricing" | "technical";
}

export interface CompetitorInfo {
	name: string;
	slug: string;
	description: string;
	website: string;
	tagline: string;
	color: string;
	pricing: {
		starting: string;
		note?: string;
	};
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface PricingTier {
	pageviews: string;
	competitor: string;
	databuddy: string;
}

export interface ComparisonData {
	competitor: CompetitorInfo;
	features: ComparisonFeature[];
	hero: {
		title: string;
		description: string;
		cta: string;
	};
	seo: {
		title: string;
		description: string;
	};
	faqs: FaqItem[];
	pricingTiers: PricingTier[];
}

export const competitors: Record<string, ComparisonData> = {
	"google-analytics": {
		competitor: {
			name: "Google Analytics",
			slug: "google-analytics",
			description: "Google's web analytics platform",
			website: "https://analytics.google.com",
			tagline: "The most popular web analytics platform",
			color: "#4285F4",
			pricing: {
				starting: "Free",
				note: "With data sampling and limits",
			},
		},
		hero: {
			title: "Databuddy vs Google Analytics",
			description:
				"GA4 is powerful but complex, privacy-invasive, and built to serve Google's ad ecosystem. Databuddy gives you the insights you need — without the baggage.",
			cta: "Switch to privacy-first analytics",
		},
		seo: {
			title: "Databuddy vs Google Analytics: Privacy-First Alternative 2026",
			description:
				"Compare Databuddy and Google Analytics. Discover why businesses are switching to privacy-first analytics with simpler setup, no data sampling, and full data ownership.",
		},
		features: [
			{
				name: "Cookie-free tracking",
				databuddy: true,
				competitor: false,
				benefit: "No consent banners needed, higher data accuracy",
				category: "privacy",
			},
			{
				name: "GDPR compliant by default",
				databuddy: true,
				competitor: false,
				benefit: "No DPA rulings, no configuration needed",
				category: "privacy",
			},
			{
				name: "No data sampling",
				databuddy: true,
				competitor: false,
				benefit: "Accurate data at every traffic volume",
				category: "features",
			},
			{
				name: "Data ownership",
				databuddy: true,
				competitor: false,
				benefit: "Your data stays yours — not shared with ad networks",
				category: "privacy",
			},
			{
				name: "Simple setup",
				databuddy: true,
				competitor: false,
				benefit: "One script tag, tracking in minutes — no GTM required",
				category: "features",
			},
			{
				name: "No ads influence",
				databuddy: true,
				competitor: false,
				benefit: "Pure analytics without advertising bias",
				category: "privacy",
			},
			{
				name: "Predictable costs",
				databuddy: true,
				competitor: false,
				benefit: "No BigQuery bills or consent platform fees",
				category: "pricing",
			},
			{
				name: "Lightweight script",
				databuddy: true,
				competitor: false,
				benefit: "3KB vs 17-45KB (gtag + GTM) — better Core Web Vitals",
				category: "performance",
			},
			{
				name: "AI insights (Databunny)",
				databuddy: true,
				competitor: true,
				benefit: "Ask questions in plain English vs navigating complex reports",
				category: "features",
			},
			{
				name: "Real-time analytics",
				databuddy: true,
				competitor: true,
				benefit: "Both offer real-time — Databuddy's is simpler to read",
				category: "features",
			},
			{
				name: "Event tracking",
				databuddy: true,
				competitor: true,
				benefit: "Simple custom events vs complex GA4 event schema",
				category: "features",
			},
			{
				name: "Custom reports",
				databuddy: true,
				competitor: true,
				benefit: "Ask Databunny vs building 40-step Explorations",
				category: "features",
			},
			{
				name: "Raw data export",
				databuddy: true,
				competitor: true,
				benefit: "Direct export vs requiring a GCP billing account",
				category: "features",
			},
			{
				name: "Multiple domains",
				databuddy: true,
				competitor: true,
				benefit: "Manage all your sites from one dashboard",
				category: "features",
			},
			{
				name: "API access",
				databuddy: true,
				competitor: true,
				benefit: "Build custom integrations and dashboards",
				category: "technical",
			},
		],
		faqs: [
			{
				question: "Is Google Analytics GDPR compliant?",
				answer:
					"GA4 has been ruled illegal by multiple EU data protection authorities (Austria, France, Italy, Denmark) without extensive configuration. Databuddy is GDPR compliant by default — no cookies, no personal data collection, no configuration needed.",
			},
			{
				question: "Does Google Analytics work without cookies?",
				answer:
					"No, GA4 uses first-party cookies by default. Databuddy is fully cookieless, meaning you never need a consent banner for analytics.",
			},
			{
				question: "How long does GA4 keep data?",
				answer:
					"GA4 UI caps data retention at 14 months (extendable to 25 months with configuration). Databuddy retains your data based on your plan with no arbitrary time caps.",
			},
			{
				question: "Can I use analytics without a cookie banner?",
				answer:
					"Yes, with Databuddy. Since it's fully cookieless and doesn't collect personal data, no consent banner is required under GDPR. GA4 requires consent management.",
			},
			{
				question: "Is there a free Google Analytics alternative?",
				answer:
					"Yes. Databuddy's free plan includes up to 10,000 pageviews/month with all features — AI insights, custom events, real-time analytics — with no hidden costs like BigQuery or consent platform fees.",
			},
		],
		pricingTiers: [
			{
				pageviews: "Up to 10K",
				competitor: "Free (with sampling, 14-mo retention)",
				databuddy: "Free (all features)",
			},
			{
				pageviews: "Consent platform",
				competitor: "$10–100/mo (CookieBot, OneTrust)",
				databuddy: "Not needed",
			},
			{
				pageviews: "BigQuery export",
				competitor: "$5–50+/mo (GCP storage/queries)",
				databuddy: "Included",
			},
			{
				pageviews: "Server-side GTM",
				competitor: "$50–200+/mo (Cloud Run)",
				databuddy: "Not needed",
			},
			{
				pageviews: "Enterprise",
				competitor: "GA360: ~$50,000+/year",
				databuddy: "Contact us",
			},
		],
	},
	plausible: {
		competitor: {
			name: "Plausible",
			slug: "plausible",
			description: "Privacy-focused web analytics",
			website: "https://plausible.io",
			tagline: "Simple and privacy-friendly Google Analytics alternative",
			color: "#5850EC",
			pricing: {
				starting: "$9/month",
				note: "For 10K monthly pageviews",
			},
		},
		hero: {
			title: "Databuddy vs Plausible",
			description:
				"Plausible shows you the numbers. Databuddy tells you what they mean. Same privacy values, dramatically more signal — with AI insights, product analytics, and a free plan.",
			cta: "Everything Plausible does, free — plus AI",
		},
		seo: {
			title: "Databuddy vs Plausible: Complete Analytics Comparison 2026",
			description:
				"Compare Databuddy and Plausible analytics. Databuddy offers AI insights, product analytics, user identification, and a free plan that Plausible doesn't have.",
		},
		features: [
			{
				name: "AI-powered insights (Databunny)",
				databuddy: true,
				competitor: false,
				benefit: "Ask questions in plain English, get instant answers",
				category: "features",
			},
			{
				name: "Product analytics (user-level)",
				databuddy: true,
				competitor: false,
				benefit: "Track user journeys, retention, and cohorts",
				category: "features",
			},
			{
				name: "User identification",
				databuddy: true,
				competitor: false,
				benefit: "Know who your users are, not just aggregate counts",
				category: "features",
			},
			{
				name: "Free plan forever",
				databuddy: true,
				competitor: false,
				benefit: "10K pageviews at $0/mo — Plausible starts at $9/mo",
				category: "pricing",
			},
			{
				name: "Feature flags",
				databuddy: true,
				competitor: false,
				benefit: "Roll out features gradually without extra tools",
				category: "features",
			},
			{
				name: "Custom dashboards",
				databuddy: true,
				competitor: false,
				benefit: "Build views for your workflow vs a single fixed page",
				category: "features",
			},
			{
				name: "Advanced event tracking",
				databuddy: true,
				competitor: false,
				benefit: "Rich custom events with properties and filtering",
				category: "features",
			},
			{
				name: "Raw data export",
				databuddy: true,
				competitor: false,
				benefit: "Export and integrate with your existing tools",
				category: "features",
			},
			{
				name: "Uptime monitoring",
				databuddy: true,
				competitor: false,
				benefit: "Know when your site goes down — no extra tool needed",
				category: "features",
			},
			{
				name: "Cookie-free tracking",
				databuddy: true,
				competitor: true,
				benefit: "No consent banners needed, higher data accuracy",
				category: "privacy",
			},
			{
				name: "GDPR compliant by default",
				databuddy: true,
				competitor: true,
				benefit: "Reduced legal risk and compliance costs",
				category: "privacy",
			},
			{
				name: "Open-source (AGPL-3.0)",
				databuddy: true,
				competitor: true,
				benefit: "Inspect the code, contribute, self-host",
				category: "technical",
			},
			{
				name: "Self-hosting option",
				databuddy: true,
				competitor: true,
				benefit: "Complete control over your infrastructure",
				category: "technical",
			},
			{
				name: "API access",
				databuddy: true,
				competitor: true,
				benefit: "Build custom integrations and dashboards",
				category: "technical",
			},
			{
				name: "Real-time analytics",
				databuddy: true,
				competitor: true,
				benefit: "Make data-driven decisions instantly",
				category: "features",
			},
		],
		faqs: [
			{
				question: "Is Plausible Analytics free?",
				answer:
					"No. Plausible starts at $9/month for 10K pageviews with a 30-day trial. Databuddy has a free forever plan with up to 10,000 pageviews/month and all features included.",
			},
			{
				question: "Does Plausible have AI analytics?",
				answer:
					"No. Plausible focuses on simple, aggregate web analytics. Databuddy includes Databunny, an AI agent that answers your analytics questions in plain English.",
			},
			{
				question: "What does Databuddy have that Plausible doesn't?",
				answer:
					"Product analytics with user-level tracking, AI-powered insights, user identification, feature flags, uptime monitoring, custom dashboards, raw data export, and a free forever plan.",
			},
			{
				question: "Is Databuddy open source?",
				answer:
					"Yes. Databuddy is AGPL-3.0 licensed — the same license Plausible uses. You can inspect the source code, self-host, and contribute.",
			},
			{
				question: "Can I switch from Plausible to Databuddy?",
				answer:
					"Yes. Add the 3KB Databuddy script to your site and start tracking immediately. No migration needed — you'll see data from the first visit.",
			},
		],
		pricingTiers: [
			{
				pageviews: "Up to 10K",
				competitor: "$9/mo (Starter)",
				databuddy: "Free",
			},
			{
				pageviews: "Funnels",
				competitor: "$19/mo (Business plan)",
				databuddy: "Free",
			},
			{
				pageviews: "Revenue tracking",
				competitor: "$19/mo (Business plan)",
				databuddy: "Free",
			},
			{
				pageviews: "AI insights",
				competitor: "Not available",
				databuddy: "Free",
			},
			{
				pageviews: "Product analytics",
				competitor: "Not available",
				databuddy: "Free",
			},
			{
				pageviews: "Feature flags",
				competitor: "Not available",
				databuddy: "Free",
			},
		],
	},
	fathom: {
		competitor: {
			name: "Fathom Analytics",
			slug: "fathom",
			description: "Simple, privacy-focused website analytics",
			website: "https://usefathom.com",
			tagline:
				"Google Analytics alternative that doesn't compromise visitor privacy",
			color: "#8B5A3C",
			pricing: {
				starting: "$14/month",
				note: "For 100K monthly pageviews",
			},
		},
		hero: {
			title: "Databuddy vs Fathom Analytics",
			description:
				"Both respect privacy, but Databuddy offers AI insights, advanced event tracking, and a free tier that Fathom doesn't have.",
			cta: "Get more for less",
		},
		seo: {
			title: "Databuddy vs Fathom Analytics: Feature & Price Comparison 2026",
			description:
				"Compare Databuddy and Fathom Analytics. See why Databuddy offers more features, AI insights, and a free tier for privacy-first analytics.",
		},
		features: [
			{
				name: "AI-powered insights (Databunny)",
				databuddy: true,
				competitor: false,
				benefit: "Ask questions in plain English, get instant answers",
				category: "features",
			},
			{
				name: "Advanced event tracking",
				databuddy: true,
				competitor: false,
				benefit: "Rich custom events with properties and filtering",
				category: "features",
			},
			{
				name: "Custom dashboards",
				databuddy: true,
				competitor: false,
				benefit: "Build views for your workflow",
				category: "features",
			},
			{
				name: "Raw data export",
				databuddy: true,
				competitor: false,
				benefit: "Export and integrate with your existing tools",
				category: "features",
			},
			{
				name: "Data ownership",
				databuddy: true,
				competitor: false,
				benefit: "Full control of your business data",
				category: "privacy",
			},
			{
				name: "Self-hosting option",
				databuddy: true,
				competitor: false,
				benefit: "Fathom is cloud-only; Databuddy is open-source",
				category: "technical",
			},
			{
				name: "Funnels & goals",
				databuddy: true,
				competitor: false,
				benefit: "Track conversion paths and key metrics",
				category: "features",
			},
			{
				name: "Free tier included",
				databuddy: true,
				competitor: false,
				benefit: "10K pageviews at $0/mo — Fathom has no free plan",
				category: "pricing",
			},
			{
				name: "Cookie-free tracking",
				databuddy: true,
				competitor: true,
				benefit: "No consent banners needed, higher data accuracy",
				category: "privacy",
			},
			{
				name: "GDPR compliant by default",
				databuddy: true,
				competitor: true,
				benefit: "Reduced legal risk and compliance costs",
				category: "privacy",
			},
			{
				name: "Real-time analytics",
				databuddy: true,
				competitor: true,
				benefit: "Make data-driven decisions instantly",
				category: "features",
			},
			{
				name: "Team collaboration",
				databuddy: true,
				competitor: true,
				benefit: "Share insights across your organization",
				category: "features",
			},
			{
				name: "API access",
				databuddy: true,
				competitor: true,
				benefit: "Build custom integrations and dashboards",
				category: "technical",
			},
			{
				name: "Multiple domains",
				databuddy: true,
				competitor: true,
				benefit: "Manage multiple websites from one dashboard",
				category: "features",
			},
		],
		faqs: [
			{
				question: "Does Fathom Analytics have AI?",
				answer:
					"No. Fathom focuses on simple, aggregate web analytics. Databuddy includes Databunny, an AI agent that answers analytics questions in plain English.",
			},
			{
				question: "Can Fathom track product funnels?",
				answer:
					"No. Fathom doesn't have a built-in funnel builder. Databuddy includes funnels and goals tracking on the free plan.",
			},
			{
				question: "Is Fathom cheaper than Databuddy?",
				answer:
					"No. Fathom starts at $14/month with no free plan. Databuddy is free for up to 10,000 pageviews/month with all features included.",
			},
			{
				question: "Can I self-host Fathom Analytics?",
				answer:
					"Fathom Lite (the old open-source version) can be self-hosted, but the commercial product is cloud-only. Databuddy is fully open-source (AGPL-3.0) and self-hostable.",
			},
			{
				question: "What does Databuddy have that Fathom doesn't?",
				answer:
					"AI-powered insights, advanced event tracking, custom dashboards, raw data export, funnels and goals, self-hosting, data ownership, and a free forever plan.",
			},
		],
		pricingTiers: [
			{
				pageviews: "Up to 10K",
				competitor: "$14/mo",
				databuddy: "Free",
			},
			{
				pageviews: "100K",
				competitor: "$14/mo",
				databuddy: "Paid plan",
			},
			{
				pageviews: "200K",
				competitor: "$25/mo",
				databuddy: "Paid plan",
			},
			{
				pageviews: "500K",
				competitor: "$45/mo",
				databuddy: "Paid plan",
			},
			{
				pageviews: "1M",
				competitor: "$60/mo",
				databuddy: "Paid plan",
			},
			{
				pageviews: "2M",
				competitor: "$100/mo",
				databuddy: "Paid plan",
			},
			{
				pageviews: "5M",
				competitor: "$140/mo",
				databuddy: "Paid plan",
			},
		],
	},
	posthog: {
		competitor: {
			name: "PostHog",
			slug: "posthog",
			description: "Open-source product analytics suite",
			website: "https://posthog.com",
			tagline:
				"All-in-one product analytics, session replay, and feature flags",
			color: "#1D4AFF",
			pricing: {
				starting: "Free",
				note: "Pay-as-you-go, costs scale fast",
			},
		},
		hero: {
			title: "Databuddy vs PostHog",
			description:
				"PostHog is 10+ products. You're probably only using 2. Databuddy gives you what matters — analytics and AI insights — at 1/17th the script size.",
			cta: "Lighter, faster, AI-native analytics",
		},
		seo: {
			title: "Databuddy vs PostHog: Lightweight Analytics Alternative 2026",
			description:
				"Compare Databuddy and PostHog. See why teams are choosing lighter, AI-native analytics over PostHog's heavyweight platform.",
		},
		features: [
			{
				name: "AI insights (Databunny NLP)",
				databuddy: true,
				competitor: false,
				benefit: "Ask questions in plain English, get instant answers",
				category: "features",
			},
			{
				name: "Lightweight script (3KB)",
				databuddy: true,
				competitor: false,
				benefit: "3KB vs 52KB+ — better Core Web Vitals",
				category: "performance",
			},
			{
				name: "Cookie-free by default",
				databuddy: true,
				competitor: false,
				benefit: "PostHog uses cookies by default, requires config to disable",
				category: "privacy",
			},
			{
				name: "GDPR compliant by default",
				databuddy: true,
				competitor: false,
				benefit: "No EU cloud config or self-hosting required for compliance",
				category: "privacy",
			},
			{
				name: "Simple setup",
				databuddy: true,
				competitor: false,
				benefit: "One script tag vs ClickHouse + Kafka + Redis + PostgreSQL",
				category: "technical",
			},
			{
				name: "Transparent pricing",
				databuddy: true,
				competitor: false,
				benefit: "Free tier + simple paid plans vs complex pay-as-you-go",
				category: "pricing",
			},
			{
				name: "Uptime monitoring",
				databuddy: true,
				competitor: false,
				benefit: "Know when your site goes down — no extra tool needed",
				category: "features",
			},
			{
				name: "Web + product analytics",
				databuddy: true,
				competitor: true,
				benefit: "Unified analytics for traffic and product usage",
				category: "features",
			},
			{
				name: "Feature flags",
				databuddy: true,
				competitor: true,
				benefit: "Roll out features gradually",
				category: "features",
			},
			{
				name: "Event tracking",
				databuddy: true,
				competitor: true,
				benefit: "Track custom user interactions and conversions",
				category: "features",
			},
			{
				name: "Open-source",
				databuddy: true,
				competitor: true,
				benefit: "Inspect the code, contribute, self-host",
				category: "technical",
			},
			{
				name: "API access",
				databuddy: true,
				competitor: true,
				benefit: "Build custom integrations and dashboards",
				category: "technical",
			},
			{
				name: "Session replay",
				databuddy: false,
				competitor: true,
				benefit: "PostHog includes session replay — Databuddy doesn't",
				category: "features",
			},
			{
				name: "A/B testing",
				databuddy: false,
				competitor: true,
				benefit: "PostHog includes experiments — Databuddy doesn't yet",
				category: "features",
			},
			{
				name: "Surveys",
				databuddy: false,
				competitor: true,
				benefit: "PostHog includes in-app surveys — Databuddy doesn't",
				category: "features",
			},
		],
		faqs: [
			{
				question: "Is PostHog free?",
				answer:
					"PostHog has a free tier, but costs scale quickly with usage. The median annual contract is ~$54,000/year according to Vendr data. Databuddy's free plan includes 10K pageviews with all features.",
			},
			{
				question: "Is PostHog overkill for most teams?",
				answer:
					"Often, yes. PostHog bundles 10+ products (analytics, session replay, A/B testing, surveys, data warehouse, etc.), but most teams only use 2-3. The 52KB+ script slows your site even for features you don't use.",
			},
			{
				question: "How does Databuddy compare to PostHog's self-hosting?",
				answer:
					"PostHog self-hosting requires ClickHouse, Kafka, Redis, and PostgreSQL — a complex infrastructure stack. Databuddy is significantly simpler to self-host.",
			},
			{
				question: "Does Databuddy have session replay?",
				answer:
					"Not yet. If session replay is critical for your workflow, PostHog is the better choice. Databuddy focuses on analytics, AI insights, and product analytics.",
			},
			{
				question: "Why choose Databuddy over PostHog?",
				answer:
					"If you need fast, lightweight, privacy-first analytics with AI insights and don't need session replay or A/B testing, Databuddy is the leaner choice — 3KB script vs 52KB+, simpler pricing, and GDPR compliant by default.",
			},
		],
		pricingTiers: [
			{
				pageviews: "Free tier",
				competitor: "1M events/mo (then $0.00031/event)",
				databuddy: "10K pageviews/mo (all features)",
			},
			{
				pageviews: "Session replay",
				competitor: "5K free, then $0.005/recording",
				databuddy: "Not available",
			},
			{
				pageviews: "Feature flags",
				competitor: "1M free, then $0.0001/request",
				databuddy: "Included",
			},
			{
				pageviews: "Typical annual cost",
				competitor: "~$54,000/year (Vendr median)",
				databuddy: "Free or paid plans",
			},
		],
	},
	umami: {
		competitor: {
			name: "Umami",
			slug: "umami",
			description: "Simple, fast, privacy-focused web analytics",
			website: "https://umami.is",
			tagline: "Open-source, privacy-focused alternative to Google Analytics",
			color: "#000000",
			pricing: {
				starting: "Free (self-hosted)",
				note: "Cloud: free for 10K events, then $9/mo",
			},
		},
		hero: {
			title: "Databuddy vs Umami",
			description:
				"Same privacy values, dramatically more signal. Umami shows numbers — Databuddy shows what they mean with AI insights, product analytics, and user identification.",
			cta: "Beyond basic analytics",
		},
		seo: {
			title: "Databuddy vs Umami: Analytics Comparison 2026",
			description:
				"Compare Databuddy and Umami analytics. Both are open-source and privacy-first. Databuddy adds AI insights, product analytics, and user identification.",
		},
		features: [
			{
				name: "AI insights (Databunny NLP)",
				databuddy: true,
				competitor: false,
				benefit: "Ask questions in plain English, get instant answers",
				category: "features",
			},
			{
				name: "Product analytics (user-level)",
				databuddy: true,
				competitor: false,
				benefit: "Track user journeys, retention, and cohorts",
				category: "features",
			},
			{
				name: "User identification",
				databuddy: true,
				competitor: false,
				benefit: "Know who your users are — Umami only does anonymous hashing",
				category: "features",
			},
			{
				name: "Feature flags",
				databuddy: true,
				competitor: false,
				benefit: "Roll out features gradually without extra tools",
				category: "features",
			},
			{
				name: "Uptime monitoring",
				databuddy: true,
				competitor: false,
				benefit: "Know when your site goes down — no extra tool needed",
				category: "features",
			},
			{
				name: "AI email reports",
				databuddy: true,
				competitor: false,
				benefit: "Auto-generated insights delivered to your inbox",
				category: "features",
			},
			{
				name: "Custom dashboards",
				databuddy: true,
				competitor: false,
				benefit: "Build views tailored to your workflow",
				category: "features",
			},
			{
				name: "Funnels & goals",
				databuddy: true,
				competitor: false,
				benefit: "Track conversion paths and key metrics",
				category: "features",
			},
			{
				name: "Cookie-free tracking",
				databuddy: true,
				competitor: true,
				benefit: "No consent banners needed",
				category: "privacy",
			},
			{
				name: "GDPR compliant",
				databuddy: true,
				competitor: true,
				benefit: "Privacy-first by design",
				category: "privacy",
			},
			{
				name: "Open-source",
				databuddy: true,
				competitor: true,
				benefit: "Databuddy: AGPL-3.0 / Umami: MIT",
				category: "technical",
			},
			{
				name: "Self-hosting option",
				databuddy: true,
				competitor: true,
				benefit: "Complete control over your infrastructure",
				category: "technical",
			},
			{
				name: "Custom events",
				databuddy: true,
				competitor: true,
				benefit: "Track user interactions beyond pageviews",
				category: "features",
			},
			{
				name: "Real-time analytics",
				databuddy: true,
				competitor: true,
				benefit: "See live visitor activity",
				category: "features",
			},
		],
		faqs: [
			{
				question: "Is Umami free?",
				answer:
					"Umami is free to self-host (MIT license). Umami Cloud offers 10K events free, then starts at $9/month. Databuddy's free plan includes 10K pageviews with all features including AI insights.",
			},
			{
				question: "What does Databuddy have that Umami doesn't?",
				answer:
					"AI-powered insights (Databunny), product analytics with user-level tracking, user identification, feature flags, uptime monitoring, custom dashboards, funnels, and AI-generated email reports.",
			},
			{
				question: "Can Umami identify individual users?",
				answer:
					"No. Umami uses anonymous hashing and doesn't support user identification by design. Databuddy supports user identification for product analytics use cases.",
			},
			{
				question: "Which is better for developers?",
				answer:
					"Both are developer-friendly. If you just need basic pageview analytics, Umami is great. If you want AI insights, product analytics, and feature flags alongside web analytics, Databuddy is the better fit.",
			},
		],
		pricingTiers: [
			{
				pageviews: "Self-hosted",
				competitor: "Free (MIT)",
				databuddy: "Free (AGPL-3.0)",
			},
			{
				pageviews: "Cloud (10K events)",
				competitor: "Free",
				databuddy: "Free (all features)",
			},
			{
				pageviews: "Cloud (100K events)",
				competitor: "$9/mo",
				databuddy: "Paid plan",
			},
			{
				pageviews: "AI insights",
				competitor: "Not available",
				databuddy: "Included",
			},
			{
				pageviews: "Product analytics",
				competitor: "Not available",
				databuddy: "Included",
			},
		],
	},
};

export function getComparisonData(slug: string): ComparisonData | null {
	return competitors[slug] ?? null;
}

export function getAllCompetitorSlugs(): string[] {
	return Object.keys(competitors);
}
