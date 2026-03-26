"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { useState } from "react";
import type { FaqItem } from "@/lib/comparison-config";

function FaqRow({ faq }: { faq: FaqItem }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="border-border/50 border-b last:border-b-0">
			<button
				aria-expanded={open}
				className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/20"
				onClick={() => setOpen((prev) => !prev)}
				type="button"
			>
				<span className="font-medium text-foreground text-sm">
					{faq.question}
				</span>
				<CaretDownIcon
					className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
					weight="bold"
				/>
			</button>
			{open && (
				<div className="px-5 pb-4">
					<p className="text-muted-foreground text-sm leading-relaxed">
						{faq.answer}
					</p>
				</div>
			)}
		</div>
	);
}

export function FaqSection({
	faqs,
	competitorName,
}: {
	faqs: FaqItem[];
	competitorName: string;
}) {
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};

	return (
		<div>
			<script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
				type="application/ld+json"
			/>
			<div className="mb-8 text-center">
				<h2 className="mb-2 font-semibold text-2xl sm:text-3xl">
					Frequently asked{" "}
					<span className="text-muted-foreground">questions</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					Common questions about Databuddy vs {competitorName}
				</p>
			</div>

			<div className="rounded border border-border bg-card/30 backdrop-blur-sm">
				{faqs.map((faq) => (
					<FaqRow faq={faq} key={faq.question} />
				))}
			</div>
		</div>
	);
}
