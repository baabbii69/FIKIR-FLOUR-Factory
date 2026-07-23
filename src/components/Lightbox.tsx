import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { LOW_POWER } from "../lib/perf";

type Caption = string | ((i: number) => string);

/**
 * Full-screen image viewer. Controlled by `open` + `initialIndex`; owns the
 * active index internally while open. Keyboard (Esc / ← / →), swipe, backdrop
 * click, and a counter. Reused by product galleries and the gallery page.
 */
export default function Lightbox({
  images,
  open,
  initialIndex = 0,
  onClose,
  caption,
}: {
  images: string[];
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
  caption?: Caption;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(initialIndex);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, go]);

  const many = images.length > 1;
  const cap = typeof caption === "function" ? caption(index) : caption;

  // Portal to <body> so the fixed overlay escapes any transformed ancestor
  // (the horizontal-scroll track applies translateX, which would otherwise
  // re-anchor `position: fixed` to the track instead of the viewport).
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-[90] flex flex-col bg-ink/95 ${
            LOW_POWER ? "" : "backdrop-blur-sm"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={onClose}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 md:px-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">
              {many ? `${index + 1} / ${images.length}` : ""}
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-11 w-11 items-center justify-center text-cream/80 transition-colors hover:text-cream"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stage */}
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current == null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50 && many) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            {many && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous image"
                className="absolute left-2 z-10 inline-flex h-12 w-12 items-center justify-center bg-cream/10 text-cream transition-colors hover:bg-cream/20 md:left-6"
              >
                <CaretLeft size={22} weight="bold" />
              </button>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={index}
                src={images[index]}
                alt={cap ?? "Fikir"}
                onClick={(e) => e.stopPropagation()}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="max-h-full max-w-full select-none object-contain shadow-2xl"
                draggable={false}
              />
            </AnimatePresence>

            {many && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next image"
                className="absolute right-2 z-10 inline-flex h-12 w-12 items-center justify-center bg-cream/10 text-cream transition-colors hover:bg-cream/20 md:right-6"
              >
                <CaretRight size={22} weight="bold" />
              </button>
            )}
          </div>

          {/* Caption */}
          {cap && (
            <div className="px-5 pb-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60 md:pb-8">
              {cap}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
