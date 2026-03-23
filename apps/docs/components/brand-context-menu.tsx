"use client";

import {
	CheckIcon,
	CopyIcon,
	DownloadSimpleIcon,
	FileIcon,
	ImageIcon,
} from "@phosphor-icons/react";
import { type ReactNode, useCallback, useState } from "react";
import { toast } from "sonner";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

interface BrandAsset {
	label: string;
	darkPath: string;
	lightPath: string;
}

const BRAND_ASSETS: BrandAsset[] = [
	{
		label: "Logo",
		darkPath: "/brand/logomark/white.svg",
		lightPath: "/brand/logomark/black.svg",
	},
	{
		label: "Wordmark",
		darkPath: "/brand/wordmark/white.svg",
		lightPath: "/brand/wordmark/black.svg",
	},
	{
		label: "Primary",
		darkPath: "/brand/primary-logo/white.svg",
		lightPath: "/brand/primary-logo/black.svg",
	},
	{
		label: "Stacked",
		darkPath: "/brand/secondary-logo/white.svg",
		lightPath: "/brand/secondary-logo/black.svg",
	},
];

type CardVariant = "dark" | "light";

interface FlatAsset {
	label: string;
	path: string;
	variant: CardVariant;
	filename: string;
}

const FLAT_ASSETS: FlatAsset[] = BRAND_ASSETS.flatMap((asset) => [
	{
		label: asset.label,
		path: asset.lightPath,
		variant: "light" as const,
		filename: `${asset.label.toLowerCase()}-light`,
	},
	{
		label: asset.label,
		path: asset.darkPath,
		variant: "dark" as const,
		filename: `${asset.label.toLowerCase()}-dark`,
	},
]);

async function fetchSvgText(path: string): Promise<string> {
	const response = await fetch(path);
	return response.text();
}

async function copySvgAction(path: string, label: string) {
	const svg = await fetchSvgText(path);
	await navigator.clipboard.writeText(svg);
	toast.success(`${label} SVG copied`);
}

async function copyPngAction(path: string, label: string) {
	const svg = await fetchSvgText(path);
	const img = new Image();
	const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(blob);

	await new Promise<void>((resolve, reject) => {
		img.onload = () => {
			const scale = 4;
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth * scale;
			canvas.height = img.naturalHeight * scale;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Canvas context unavailable"));
				return;
			}
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.toBlob(async (pngBlob) => {
				if (!pngBlob) {
					reject(new Error("Failed to create PNG"));
					return;
				}
				try {
					await navigator.clipboard.write([
						new ClipboardItem({ "image/png": pngBlob }),
					]);
					toast.success(`${label} PNG copied`);
					resolve();
				} catch (e) {
					reject(e);
				}
			}, "image/png");
			URL.revokeObjectURL(url);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Failed to load SVG"));
		};
	});
}

function downloadAction(path: string, filename: string) {
	const a = document.createElement("a");
	a.href = path;
	a.download = `databuddy-${filename}.svg`;
	document.body.appendChild(a);
	a.click();
	a.remove();
}

interface ActionButtonProps {
	ariaLabel: string;
	children: ReactNode;
	variant: CardVariant;
	onClickAction: () => Promise<void> | void;
}

function ActionButton({
	ariaLabel,
	children,
	variant,
	onClickAction,
}: ActionButtonProps) {
	const [flash, setFlash] = useState(false);

	const handleClick = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation();
			try {
				await onClickAction();
				setFlash(true);
				setTimeout(() => setFlash(false), 1200);
			} catch {
				toast.error("Action failed");
			}
		},
		[onClickAction]
	);

	return (
		<button
			aria-label={ariaLabel}
			className={cn(
				"flex size-7 cursor-pointer items-center justify-center rounded transition-all active:scale-90",
				flash
					? "bg-emerald-500/40 text-emerald-300"
					: variant === "dark"
						? "bg-white/90 text-neutral-900 hover:bg-white"
						: "bg-neutral-900/80 text-white hover:bg-neutral-900"
			)}
			onClick={handleClick}
			type="button"
		>
			{flash ? <CheckIcon className="size-3.5" weight="bold" /> : children}
		</button>
	);
}

interface AssetCardProps {
	item: FlatAsset;
}

function AssetCard({ item }: AssetCardProps) {
	return (
		<div className="group/card flex flex-col gap-1">
			<div
				className={cn(
					"relative flex aspect-3/2 items-center justify-center overflow-hidden rounded border p-3",
					item.variant === "dark"
						? "border-white/10 bg-neutral-950"
						: "border-black/8 bg-neutral-50"
				)}
			>
				<img
					alt={`${item.label} — ${item.variant}`}
					className="max-h-full max-w-full object-contain"
					height={64}
					src={item.path}
					width={128}
				/>
				<div
					className={cn(
						"absolute inset-0 flex items-end justify-center gap-1 p-1.5 opacity-0 transition-opacity group-hover/card:opacity-100",
						item.variant === "dark" ? "bg-black/50" : "bg-white/60"
					)}
				>
					<ActionButton
						ariaLabel={`Copy ${item.label} SVG`}
						onClickAction={() => copySvgAction(item.path, item.label)}
						variant={item.variant}
					>
						<CopyIcon className="size-3.5" />
					</ActionButton>
					<ActionButton
						ariaLabel={`Copy ${item.label} PNG`}
						onClickAction={() => copyPngAction(item.path, item.label)}
						variant={item.variant}
					>
						<ImageIcon className="size-3.5" />
					</ActionButton>
					<ActionButton
						ariaLabel={`Download ${item.label} SVG`}
						onClickAction={() => downloadAction(item.path, item.filename)}
						variant={item.variant}
					>
						<DownloadSimpleIcon className="size-3.5" />
					</ActionButton>
				</div>
			</div>
			<div className="flex items-center justify-between px-0.5">
				<span className="text-popover-foreground text-xs">{item.label}</span>
				<span className="text-[10px] text-muted-foreground">
					{item.variant === "dark" ? "Dark" : "Light"}
				</span>
			</div>
		</div>
	);
}

interface BrandContextMenuProps {
	children: ReactNode;
}

export function BrandContextMenu({ children }: BrandContextMenuProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className="w-[520px] p-3">
				<div className="mb-2.5 flex items-center gap-2">
					<FileIcon
						className="size-3.5 text-muted-foreground"
						weight="duotone"
					/>
					<span className="font-medium text-popover-foreground text-xs">
						Brand Assets
					</span>
					<span className="text-[10px] text-muted-foreground">
						Hover for actions
					</span>
				</div>
				<div className="grid grid-cols-3 gap-2">
					{FLAT_ASSETS.map((item) => (
						<AssetCard item={item} key={`${item.label}-${item.variant}`} />
					))}
				</div>
			</ContextMenuContent>
		</ContextMenu>
	);
}
