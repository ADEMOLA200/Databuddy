import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/compare/faq-section";
import { FeatureTable } from "@/components/compare/feature-table";
import { MigrationCtaSection } from "@/components/compare/migration-cta-section";
import { PricingSection } from "@/components/compare/pricing-section";
import { SocialProof } from "@/components/compare/social-proof";
import { StatsCards } from "@/components/compare/stats-cards";
import { SciFiButton } from "@/components/landing/scifi-btn";
import Section from "@/components/landing/section";
import { Spotlight } from "@/components/landing/spotlight";
import { StructuredData } from "@/components/structured-data";
import {
	getAllCompetitorSlugs,
	getComparisonData,
} from "@/lib/comparison-config";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export function generateStaticParams() {
	return getAllCompetitorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const data = getComparisonData(slug);

	if (!data) {
		return { title: "Comparison Not Found | Databuddy" };
	}

	const compareUrl = `https://www.databuddy.cc/compare/${slug}`;

	return {
		title: data.seo.title,
		description: data.seo.description,
		openGraph: {
			title: data.seo.title,
			description: data.seo.description,
			url: compareUrl,
		},
		alternates: { canonical: compareUrl },
	};
}

export default async function ComparisonPage({ params }: PageProps) {
	const { slug } = await params;
	const data = getComparisonData(slug);

	if (!data) {
		notFound();
	}

	const { competitor, features, hero, seo, faqs, pricingTiers, migrationSection } =
		data;
	const featuresWin = features.filter(
		(f) => f.databuddy && !f.competitor,
	).length;

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://www.databuddy.cc",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Compare",
				item: "https://www.databuddy.cc/compare",
			},
			{
				"@type": "ListItem",
				position: 3,
				name: `vs ${competitor.name}`,
				item: `https://www.databuddy.cc/compare/${slug}`,
			},
		],
	};

	return (
		<div className="overflow-hidden">
			<StructuredData
				page={{
					title: seo.title,
					description: seo.description,
					url: `https://www.databuddy.cc/compare/${slug}`,
				}}
			/>
			<script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
				type="application/ld+json"
			/>
			<Spotlight transform="translateX(-60%) translateY(-50%)" />

			<div className="container mx-auto px-4 pt-8">
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Link
						className="transition-colors hover:text-foreground"
						href="/"
					>
						Home
					</Link>
					<span>/</span>
					<Link
						className="transition-colors hover:text-foreground"
						href="/compare"
					>
						Compare
					</Link>
					<span>/</span>
					<span className="text-foreground">{competitor.name}</span>
				</div>
			</div>

			<Section className="overflow-hidden" customPaddings id="comparison-hero">
				<section className="relative w-full pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
					<div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
						<div className="mb-10 text-center">
							<h1 className="mb-4 text-balance font-semibold text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
								{hero.title.split(" vs ").at(0)}{" "}
								<span className="text-muted-foreground">vs</span>{" "}
								<span className="text-muted-foreground">
									{hero.title.split(" vs ").at(1)}
								</span>
							</h1>
							<p className="mx-auto max-w-2xl text-balance text-muted-foreground text-sm leading-relaxed sm:text-base">
								{hero.description}
							</p>
						</div>

						<StatsCards
							competitor={competitor}
							featuresWin={featuresWin}
							totalFeatures={features.length}
						/>
					</div>
				</section>
			</Section>

			<Section
				className="border-border border-t border-b bg-background/50"
				id="features-comparison"
			>
				<div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
					<div className="mb-8 text-center">
						<h2 className="mb-2 font-semibold text-2xl sm:text-3xl">
							Feature{" "}
							<span className="text-muted-foreground">comparison</span>
						</h2>
						<p className="text-muted-foreground text-sm sm:text-base">
							How Databuddy compares to {competitor.name} across key features
						</p>
					</div>

					<FeatureTable
						competitorName={competitor.name}
						features={features}
					/>

					<p className="mt-4 text-center text-muted-foreground text-xs">
						All Databuddy features available on the free plan — up to 10,000
						monthly pageviews
					</p>

					{migrationSection && (
						<div className="mt-10">
							<MigrationCtaSection
								guideHref={migrationSection.guideHref}
								guideLabel={migrationSection.guideLabel}
								heading={migrationSection.heading}
								steps={migrationSection.steps}
							/>
						</div>
					)}
				</div>
			</Section>

			{pricingTiers.length > 0 && (
				<Section id="pricing-comparison">
					<div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
						<PricingSection
							competitorName={competitor.name}
							tiers={pricingTiers}
						/>
					</div>
				</Section>
			)}

			{faqs.length > 0 && (
				<Section
					className="border-border border-t bg-background/50"
					id="faq"
				>
					<div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
						<FaqSection
							competitorName={competitor.name}
							faqs={faqs}
						/>
					</div>
				</Section>
			)}

			<Section className="bg-background/30" id="final-cta">
				<div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
					<SocialProof />

					<h3 className="mt-8 mb-3 text-balance font-semibold text-xl text-foreground sm:text-2xl">
						{hero.cta}
					</h3>
					<p className="mb-6 text-pretty text-muted-foreground">
						Start with 10K pageviews free. No credit card required.
					</p>
					<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
						<SciFiButton asChild className="w-full sm:w-auto">
							<Link
								href="https://app.databuddy.cc/login"
								rel="noopener noreferrer"
								target="_blank"
							>
								Start Free — No Credit Card
							</Link>
						</SciFiButton>
						<Link
							className="group inline-flex items-center justify-center gap-2 rounded border border-border bg-foreground/5 px-5 py-2 font-medium text-foreground text-sm backdrop-blur-sm transition-colors hover:bg-foreground/10 active:scale-[0.98]"
							href="/demo"
						>
							View Live Demo
							<ArrowRightIcon
								className="size-3.5 transition-transform group-hover:translate-x-0.5"
								weight="fill"
							/>
						</Link>
					</div>
				</div>
			</Section>
		</div>
	);
}
