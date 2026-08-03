import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { LOW_POWER } from "../lib/perf";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Fullscreen player for the complete film.
 *
 * Lives in its own module because the hero now opens it too. Only mounted
 * content is fetched, so the ~67 MB full cut is never requested until someone
 * actually presses play — the ambient loop on the page is a separate 2.6 MB
 * file.
 */
export default function FilmPlayer({
  open,
  onClose,
  src,
  poster,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  poster: string;
}) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // No film configured in the CMS: render nothing rather than an empty player.
  if (!src) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-[95] flex flex-col bg-ink/97 ${LOW_POWER ? "" : "backdrop-blur-sm"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          role="dialog"
          aria-modal="true"
          aria-label={t("film.aria", "The Fikir company film")}
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">
              {t("film.playerLabel", "Inside Fikir Food Processing")}
            </span>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label={t("film.close", "Close")}
              className="inline-flex h-11 w-11 items-center justify-center text-cream/80 transition-colors hover:text-cream"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-6 md:px-8">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-full w-full max-w-[1200px] bg-black shadow-2xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
