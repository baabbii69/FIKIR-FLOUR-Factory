import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { TESTIMONIALS } from "../data/site";

/** One large rotating quote instead of a generic three-card row. */
export default function TestimonialRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const t = TESTIMONIALS[index];

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(id);
  }, [reduce, paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative"
    >
      <div className="min-h-[240px] md:min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <blockquote className="display-2 max-w-4xl text-2xl leading-snug md:text-4xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold font-display text-xl font-semibold text-ink">
                {t.name.charAt(0)}
              </span>
              <span>
                <span className="block font-medium text-ink">{t.name}</span>
                <span className="mt-0.5 block text-sm text-clay/80">{t.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center gap-3">
        <button
          onClick={() => setIndex((index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
          aria-label="Previous testimonial"
          className="inline-flex h-12 w-12 items-center justify-center border border-linen text-ink transition-all duration-300 hover:border-gold hover:bg-gold active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => setIndex((index + 1) % TESTIMONIALS.length)}
          aria-label="Next testimonial"
          className="inline-flex h-12 w-12 items-center justify-center border border-linen text-ink transition-all duration-300 hover:border-gold hover:bg-gold active:scale-95"
        >
          <ArrowRight size={18} />
        </button>
        <span className="ml-4 font-mono text-[11px] uppercase tracking-[0.2em] text-clay/70">
          {index + 1} of {TESTIMONIALS.length}
        </span>
      </div>
    </div>
  );
}
