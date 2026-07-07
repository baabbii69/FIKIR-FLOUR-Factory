import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "./lenisStore";

/**
 * Reset scroll on route change. Must go through Lenis when it is active,
 * otherwise Lenis restores its internal position and the new page appears
 * scrolled past its content.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
