import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import Img from "./Img";
import { CERT_SHOTS } from "../data/site";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Auto-advancing frame for the certificate and award scans.
 *
 * The scans are portrait documents of differing shapes, so they are rendered
 * `object-contain` on a light card — cropping them would cut off seals and
 * signatures, which are the whole point. Pauses on hover and on
 * prefers-reduced-motion, where it becomes a plain manual gallery.
 */
export default function CertRotator() {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const paused = useRef(false);
  const reduce = useReducedMotion();
  const n = CERT_SHOTS.length;

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
    }, 5000);
    return () => window.clearInterval(id);
  }, [go, reduce]);

  const shot = CERT_SHOTS[i];

  return (
    <div
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream/[0.04] ring-1 ring-cream/10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 p-4 md:p-6"
          >
            <Img
              src={shot.src}
              alt={t(`cert.shot.${i}`, shot.caption)}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <p className="max-w-[42ch] text-sm leading-relaxed text-cream/70">
          {t(`cert.shot.${i}`, shot.caption)}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="mr-2 font-mono text-[10px] tabular-nums text-cream/40">
            {i + 1} / {n}
          </span>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t("cert.prev", "Previous document")}
            className="inline-flex h-9 w-9 items-center justify-center border border-cream/25 text-cream/70 transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowLeft size={14} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t("cert.next", "Next document")}
            className="inline-flex h-9 w-9 items-center justify-center border border-cream/25 text-cream/70 transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowRight size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
