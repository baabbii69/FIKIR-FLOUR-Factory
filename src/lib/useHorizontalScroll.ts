import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOW_POWER } from "./perf";

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal scroll-scrub via CSS `position: sticky` + a transform — deliberately
 * NOT GSAP's `pin: true`. Pin inserts a pin-spacer and relocates DOM nodes, which
 * corrupts React reconciliation on route change (the page then needs a refresh).
 * Sticky keeps the DOM React-owned; ScrollTrigger only reads progress and moves
 * the track. On mobile / reduced-motion the markup falls back to native swipe.
 *
 * Markup contract:
 *   <section ref={sectionRef} class="relative">
 *     <div class="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
 *       <div ref={trackRef} class="flex overflow-x-auto lg:overflow-visible">…panels…</div>
 *     </div>
 *   </section>
 */
export function useHorizontalScroll<
  S extends HTMLElement = HTMLElement,
  T extends HTMLElement = HTMLElement
>() {
  const sectionRef = useRef<S>(null);
  const trackRef = useRef<T>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const sticky = track.parentElement as HTMLElement | null;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const sizeSection = () => {
        // Sticky element height (which may be < viewport due to a top offset)
        // plus the horizontal travel = how long the section stays pinned.
        const base = sticky?.offsetHeight || window.innerHeight;
        section.style.height = `${base + distance()}px`;
      };
      sizeSection();

      // On a GPU we promote the track to its own layer (force3D + will-change)
      // for buttery scrubbing. On a software renderer that extra layer is
      // composited on the CPU and costs more than it saves, so we translate in
      // 2D and skip the layer hint. The animation still runs — just cheaper.
      if (!LOW_POWER) gsap.set(track, { willChange: "transform" });
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        force3D: !LOW_POWER,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          // Smoothed catch-up on GPU; instant 1:1 link on software renderers
          // (the smoothing needs extra repaint frames the CPU can't spare).
          scrub: LOW_POWER ? true : 0.7,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.addEventListener("refreshInit", sizeSection);
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", sizeSection);
        tween.scrollTrigger?.kill();
        tween.kill();
        section.style.height = "";
        gsap.set(track, { clearProps: "transform,will-change" });
      };
    });

    return () => mm.revert();
  }, []);

  return { sectionRef, trackRef };
}
