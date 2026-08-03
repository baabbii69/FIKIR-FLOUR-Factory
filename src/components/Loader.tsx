import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoOrbit from "./LogoOrbit";
import { LOW_POWER } from "../lib/perf";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * How long the mark is guaranteed to be on screen. Long enough to read as a
 * deliberate brand moment, short enough not to feel like waiting.
 */
const MIN_VISIBLE_MS = 650;

/** Never hold the site hostage to a slow font or a stalled request. */
const SAFETY_CAP_MS = 2000;

/**
 * First-load brand splash: the orbiting mark on an ink field, held briefly,
 * then the panel slides up to reveal the site. Only on a real page load —
 * in-app navigation uses the page-transition curtain. Reduced motion gets a
 * plain fade.
 *
 * Two things here were making the boot feel slow, and both are deliberate now:
 *
 * 1. It used to wait for `window.load`, which does not fire until *every*
 *    image and the hero video have finished downloading. On a slow connection
 *    that meant sitting on the splash until the 4s cap — the site itself was
 *    ready and painted seconds earlier. We now wait on `document.fonts.ready`,
 *    which is the only asset that would actually reflow visible text.
 *
 * 2. `ScrollTrigger.refresh()` ran the moment the exit began, so a full
 *    recalculation of every pinned and horizontal trigger landed in the same
 *    frames as the 0.85s slide. That is the stutter people saw. It now runs
 *    after the curtain is gone, when there is nothing to compete with.
 */
export default function Loader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      window.setTimeout(() => setDone(true), wait);
    };

    // Fonts are the one asset whose absence would visibly reflow the hero.
    // Everything else can stream in behind the site.
    const fonts = document.fonts?.ready;
    if (fonts) fonts.then(finish).catch(finish);
    else finish();

    const capId = window.setTimeout(finish, SAFETY_CAP_MS);
    return () => window.clearTimeout(capId);
  }, []);

  // Clear the pre-mount ink background (set in index.html to avoid a white
  // flash) as the splash starts leaving, so the cream site shows through.
  useEffect(() => {
    if (done) document.documentElement.style.backgroundColor = "";
  }, [done]);

  // Hold scroll for the whole splash, including the slide-out.
  useEffect(() => {
    if (revealed) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [revealed]);

  // The scrollbar returning changes the viewport width, so pinned and
  // horizontal ScrollTriggers measured while locked need a recompute — but
  // only once the animation is finished and the main thread is free.
  useEffect(() => {
    if (!revealed) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [revealed]);

  return (
    <AnimatePresence onExitComplete={() => setRevealed(true)}>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.3 : 0.6, ease: EASE }}
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
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <LogoOrbit size={136} label />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
