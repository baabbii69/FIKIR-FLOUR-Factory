import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoOrbit from "./LogoOrbit";
import { LOW_POWER } from "../lib/perf";

const EASE = [0.76, 0, 0.24, 1] as const;
const MIN_VISIBLE_MS = 1400;
const SAFETY_CAP_MS = 4000;

/**
 * First-load brand splash: the orbiting mark on an ink field, held for a short
 * minimum and until the window finishes loading, then the whole panel slides up
 * to reveal the site. Only shows on a real page load — in-app navigation uses
 * the page-transition curtain instead. Respects reduced motion (quick fade).
 */
export default function Loader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let capId = 0;

    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      window.setTimeout(() => setDone(true), wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    // Never hang, even if `load` never fires.
    capId = window.setTimeout(() => setDone(true), SAFETY_CAP_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(capId);
    };
  }, []);

  // Clear the pre-mount ink background (set in index.html to avoid a white
  // flash) once the splash is on its way out, so the cream site shows through.
  useEffect(() => {
    if (done) document.documentElement.style.backgroundColor = "";
  }, [done]);

  // Hold scroll while the splash is up.
  useEffect(() => {
    if (done) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
      // The scrollbar returning changes the viewport width, so any pinned/
      // horizontal ScrollTriggers measured while locked need a recompute.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.35 : 0.85, ease: EASE }}
        >
          {/* Soft brand glow behind the mark (skipped on software renderers,
              where a moving blur is costly). */}
          {!LOW_POWER && (
            <div
              aria-hidden
              className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-40 blur-[90px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(79,178,63,0.35) 0%, rgba(251,188,16,0.18) 45%, transparent 70%)",
              }}
            />
          )}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <LogoOrbit size={136} label />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
