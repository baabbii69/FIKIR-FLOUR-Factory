import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "./lenisStore";
import { LOW_POWER } from "./perf";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide inertia scrolling, driven by the GSAP ticker so Lenis and
 * ScrollTrigger share one clock (prevents jitter on pinned sections).
 * Skipped under prefers-reduced-motion and on software renderers, where a
 * continuous rAF repaint of the whole page is the main source of scroll lag —
 * native scrolling is smoother there.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (LOW_POWER) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
