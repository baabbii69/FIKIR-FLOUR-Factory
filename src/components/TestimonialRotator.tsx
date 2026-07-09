import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Quotes } from "@phosphor-icons/react";
import { TESTIMONIALS } from "../data/site";

/** Auto-advancing single-quote rotator. Pauses on hover / reduced motion. */
export default function TestimonialRotator() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const paused = useRef(false);
  const reduce = useReducedMotion();
  const n = TESTIMONIALS.length;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setI((p) => (p + d + n) % n);
    },
    [n]
  );

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (!paused.current) go(1);
    }, 6500);
    return () => window.clearInterval(id);
  }, [go, reduce]);

  const t = TESTIMONIALS[i];

  return (
    <div
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <Quotes size={48} weight="fill" className="text-gold/40" />
      <div className="relative mt-6 min-h-[220px] sm:min-h-[180px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.blockquote
            key={i}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-2xl font-medium leading-snug text-ink md:text-4xl md:leading-[1.2]"
          >
            &ldquo;{t.quote}&rdquo;
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-6 border-t border-linen pt-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 font-display text-lg font-semibold text-gold-deep">
            {t.name.charAt(0)}
          </span>
          <div>
            <div className="font-display text-lg font-semibold text-ink">{t.name}</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-clay/70">{t.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-2 font-mono text-[11px] tabular-nums text-clay/60">
            {i + 1} / {n}
          </span>
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="inline-flex h-10 w-10 items-center justify-center border border-linen text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="inline-flex h-10 w-10 items-center justify-center border border-linen text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
