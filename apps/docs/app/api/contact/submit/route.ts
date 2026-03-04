import { type NextRequest, NextResponse } from "next/server";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";
const SLACK_TIMEOUT_MS = 10_000;

const MIN_NAME_LENGTH = 2;

interface ContactFormData {
	fullName: string;
	businessName: string;
	website: string;
	email: string;
	phone?: string;
}

type ValidationResult =
	| { valid: true; data: ContactFormData }
	| { valid: false; errors: string[] };

function getClientIP(request: NextRequest): string {
	const cfConnectingIP = request.headers.get("cf-connecting-ip");
	if (cfConnectingIP) {
		return cfConnectingIP.trim();
	}

	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		const firstIP = forwarded.split(",")[0]?.trim();
		if (firstIP) {
			return firstIP;
		}
	}

	const realIP = request.headers.get("x-real-ip");
	if (realIP) {
		return realIP.trim();
	}

	return "unknown";
}

function isValidEmail(email: string): boolean {
	return email.includes("@") && email.includes(".") && email.length > 3;
}

function isValidUrl(value: string): boolean {
	const url =
		value.startsWith("http") || value.startsWith("//")
			? value
			: `https://${value}`;
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

function validateFormData(data: unknown): ValidationResult {
	if (!data || typeof data !== "object") {
		return { valid: false, errors: ["Invalid form data"] };
	}

	const formData = data as Record<string, unknown>;
	const errors: string[] = [];

	const fullName = formData.fullName;
	if (
		!fullName ||
		typeof fullName !== "string" ||
		fullName.trim().length < MIN_NAME_LENGTH
	) {
		errors.push("Full name is required and must be at least 2 characters");
	}

	const businessName = formData.businessName;
	if (
		!businessName ||
		typeof businessName !== "string" ||
		businessName.trim().length < MIN_NAME_LENGTH
	) {
		errors.push(
			"Business or website name is required and must be at least 2 characters"
		);
	}

	const website = formData.website;
	if (!website || typeof website !== "string" || !isValidUrl(website.trim())) {
		errors.push("Valid website URL is required");
	}

	const email = formData.email;
	if (!email || typeof email !== "string" || !isValidEmail(email)) {
		errors.push("Valid email is required");
	}

	if (errors.length > 0) {
		return { valid: false, errors };
	}

	const phone = formData.phone;

	const normalizedWebsite = String(website).trim();
	const websiteUrl =
		normalizedWebsite.startsWith("http") || normalizedWebsite.startsWith("//")
			? normalizedWebsite
			: `https://${normalizedWebsite}`;

	return {
		valid: true,
		data: {
			fullName: String(fullName).trim(),
			businessName: String(businessName).trim(),
			website: websiteUrl,
			email: String(email).trim(),
			phone:
				phone && typeof phone === "string" && phone.trim().length > 0
					? phone.trim()
					: undefined,
		},
	};
}

function createSlackField(label: string, value: string) {
	return {
		type: "mrkdwn" as const,
		text: `*${label}:*\n${value}`,
	};
}

function buildSlackBlocks(data: ContactFormData, ip: string): unknown[] {
	const fields = [
		createSlackField("Full Name", data.fullName),
		createSlackField("Business / Website", data.businessName),
		createSlackField("Website", data.website),
		createSlackField("Email", data.email),
		createSlackField("Phone", data.phone || "Not provided"),
		createSlackField("IP", ip),
	];

	const blocks: unknown[] = [
		{
			type: "header",
			text: {
				type: "plain_text",
				text: "📬 New Contact Lead",
				emoji: true,
			},
		},
	];

	for (let i = 0; i < fields.length; i += 2) {
		blocks.push({
			type: "section",
			fields: fields.slice(i, i + 2),
		});
	}

	return blocks;
}

async function sendToSlack(data: ContactFormData, ip: string): Promise<void> {
	if (!SLACK_WEBHOOK_URL) {
		return;
	}

	const blocks = buildSlackBlocks(data, ip);
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), SLACK_TIMEOUT_MS);

	try {
		await fetch(SLACK_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ blocks }),
			signal: controller.signal,
		});
	} catch (fetchError) {
		if (fetchError instanceof Error && fetchError.name !== "AbortError") {
			throw fetchError;
		}
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function POST(request: NextRequest) {
	const clientIP = getClientIP(request);

	try {
		let formData: unknown;
		try {
			formData = await request.json();
		} catch {
			return NextResponse.json(
				{ error: "Invalid JSON format in request body" },
				{ status: 400 }
			);
		}

		const validation = validateFormData(formData);

		if (!validation.valid) {
			return NextResponse.json(
				{ error: "Validation failed", details: validation.errors },
				{ status: 400 }
			);
		}

		const contactData = validation.data;

		await sendToSlack(contactData, clientIP);

		return NextResponse.json({
			success: true,
			message: "Contact form submitted successfully",
		});
	} catch {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
