import { GithubLogoIcon, StarIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export function SocialProof() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<Link
				className="inline-flex items-center gap-2 rounded border border-border bg-card/50 px-4 py-2 text-sm transition-colors hover:bg-card/80"
				href="https://github.com/databuddy-cc/databuddy"
				rel="noopener"
				target="_blank"
			>
				<GithubLogoIcon className="size-4 text-foreground" weight="duotone" />
				<StarIcon className="size-3.5 text-amber-500" weight="fill" />
				<span className="font-medium text-foreground tabular-nums">900+</span>
				<span className="text-muted-foreground">stars on GitHub</span>
			</Link>

			<div className="inline-flex items-center gap-2 rounded border border-border bg-card/50 px-4 py-2 text-sm">
				<span className="text-muted-foreground">
					Used by <span className="font-medium text-foreground">500+</span>{" "}
					websites
				</span>
			</div>
		</div>
	);
}
