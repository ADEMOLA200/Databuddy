"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ChartErrorBoundaryProps {
	children: ReactNode;
	fallbackClassName?: string;
}

interface ChartErrorBoundaryState {
	hasError: boolean;
}

export class ChartErrorBoundary extends Component<
	ChartErrorBoundaryProps,
	ChartErrorBoundaryState
> {
	constructor(props: ChartErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ChartErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("[ChartErrorBoundary]", error.message, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div
					className={`flex items-center justify-center ${this.props.fallbackClassName ?? ""}`}
				>
					<button
						className="text-muted-foreground text-xs transition-colors hover:text-foreground"
						onClick={() => this.setState({ hasError: false })}
						type="button"
					>
						Failed to render chart — click to retry
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
