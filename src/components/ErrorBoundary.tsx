import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

/**
 * Guarantees the app never shows a raw blank/white page. If any route throws
 * during render, we show a styled fallback with the actual error text so the
 * problem is visible instead of silent.
 */
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface in the console so it is inspectable during development.
    console.error("Route render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <section className="flex min-h-[100dvh] items-center bg-ink">
          <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
              Something broke
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold text-cream md:text-5xl">
              This page hit an error.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-cream/65">
              Try reloading. If it keeps happening, the message below helps us fix it.
            </p>
            <pre className="mx-auto mt-8 max-w-lg overflow-x-auto whitespace-pre-wrap bg-cream/10 p-4 text-left font-mono text-xs text-cream/70">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 inline-flex items-center bg-gold px-8 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-bright"
            >
              Reload page
            </button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
