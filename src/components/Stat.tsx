import { useEffect, useRef } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

export default function Stat({
  value,
  suffix,
  label,
  dark = false,
}: {
  value: number;
  suffix: string;
  label: string;
  dark?: boolean;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = numRef.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = value.toLocaleString();
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <div ref={rootRef}>
      <div
        className={`font-display text-4xl font-semibold md:text-5xl ${dark ? "text-cream" : "text-ink"}`}
      >
        <span ref={numRef}>0</span>
        <span className="text-gold">{suffix}</span>
      </div>
      <div
        className={`mt-2 font-mono text-[11px] uppercase tracking-[0.2em] ${dark ? "text-cream/60" : "text-clay/80"}`}
      >
        {label}
      </div>
    </div>
  );
}
