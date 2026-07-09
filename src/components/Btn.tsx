import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";

type Variant = "gold" | "outline-ink" | "outline-cream";

const base =
  "group inline-flex items-center justify-center gap-2.5 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.18em] whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  // "gold" is the default key kept for call sites, but it is now the green logo
  // primary (green-deep bg + cream text is AA; brightens to logo green on hover).
  gold: "bg-green-deep text-cream hover:bg-green",
  "outline-ink": "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-cream",
  "outline-cream": "border border-cream/40 text-cream hover:border-cream hover:bg-cream hover:text-ink",
};

export default function Btn({
  to,
  href,
  variant = "gold",
  arrow = false,
  children,
  type,
  className = "",
}: {
  to?: string;
  href?: string;
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
  type?: "submit" | "button";
  className?: string;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (
        <ArrowRight
          size={14}
          weight="bold"
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} className={cls}>
      {inner}
    </button>
  );
}
