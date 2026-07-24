import { useEffect, useState, type ReactNode } from "react";
import { useLocation, type Location } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "../lib/lenisStore";
import LogoOrbit from "./LogoOrbit";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Branded page transition. Routes are rendered against a *delayed* location so
 * the sequence is: curtain sweeps up to cover the old page → swap + scroll reset
 * happen while fully covered → curtain sweeps off the top to reveal the new page.
 * A green accent panel leads and the ink panel (with the orbiting mark) follows
 * for a layered wipe. Reduced motion swaps instantly with no curtain.
 *
 * `children` is a render prop given the location to render — pass it to
 * <Routes location={loc}> so the delayed location drives what's shown.
 */
export default function PageTransition({
  children,
}: {
  children: (location: Location) => ReactNode;
}) {
  const location = useLocation();
  const reduce = useReducedMotion();
  const [displayed, setDisplayed] = useState(location);
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");

  const resetScroll = () => {
    window.scrollTo(0, 0);
    try {
      getLenis()?.scrollTo(0, { immediate: true, force: true });
    } catch {
      /* Lenis inactive (reduced motion / low power) — window reset is enough. */
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  useEffect(() => {
    if (location.pathname === displayed.pathname) return;
    if (reduce) {
      setDisplayed(location);
      resetScroll();
      return;
    }
    setPhase("cover");
    // Only react to a genuine path change; displayed is updated deliberately below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // "cover" drives panels to y:0 (covering); "reveal" drives them off the top.
  const y = phase === "reveal" ? "-100%" : "0%";

  return (
    <>
      {children(displayed)}

      {phase !== "idle" && (
        <div className="fixed inset-0 z-[95] overflow-hidden">
          {/* Accent panel leads the wipe */}
          <motion.div
            className="absolute inset-0 bg-leaf"
            initial={{ y: "100%" }}
            animate={{ y }}
            transition={{ duration: 0.5, ease: EASE }}
          />
          {/* Ink panel + orbiting mark follows a beat behind */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-ink"
            initial={{ y: "100%" }}
            animate={{ y }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.06 }}
            onAnimationComplete={() => {
              if (phase === "cover") {
                resetScroll();
                setDisplayed(location);
                setPhase("reveal");
              } else if (phase === "reveal") {
                setPhase("idle");
              }
            }}
          >
            <LogoOrbit size={76} />
          </motion.div>
        </div>
      )}
    </>
  );
}
