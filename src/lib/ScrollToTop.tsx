import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./lenisStore";

/**
 * Reset scroll on every route change.
 *
 * Two things previously caused a blank page until refresh:
 *  1. Lenis kept the previous page's scroll target, so it re-scrolled the new
 *     (often shorter) page past all its content. Every section is a whileInView
 *     reveal starting at opacity:0, so nothing ever entered view -> blank.
 *  2. The pinned process section leaves ScrollTrigger measurements that are
 *     stale on the next page.
 * We reset the window and Lenis synchronously, then refresh ScrollTrigger.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    try {
      getLenis()?.scrollTo(0, { immediate: true, force: true });
    } catch {
      /* Lenis not active (reduced motion) — window reset already handled it. */
    }

    // Recompute triggers after the new route has painted so any leftover pin
    // spacing from the previous page is cleared and reveals re-evaluate.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
