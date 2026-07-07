import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS } from "../data/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * Signature scroll moment: vertical scroll pans horizontally through the
 * milling process, telling the grain-to-flour story in sequence.
 * Desktop only; collapses to a swipeable horizontal strip on mobile and
 * under prefers-reduced-motion.
 */
export default function ProcessPan() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      if (!wrap.current || !track.current) return;
      const distance = () => track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={wrap} className="overflow-hidden bg-ink" aria-label="The milling process">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-0 overflow-x-auto lg:h-[100dvh] lg:snap-none lg:overflow-x-visible"
      >
        {/* Intro panel */}
        <div className="flex w-[88vw] shrink-0 snap-start flex-col justify-center px-8 py-16 sm:w-[70vw] md:px-14 lg:h-full lg:w-[42vw] lg:py-0">
          <span className="eyebrow">How we mill</span>
          <h2 className="display-2 mt-5 text-4xl !text-cream md:text-5xl lg:text-6xl">
            From grain
            <br />
            to flour, in
            <br />
            <em className="pb-1 leading-[1.1] text-gold">five movements.</em>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-cream/65">
            A 14-stage process controlled at every point, from the moment wheat arrives to the
            moment flour ships.
          </p>
        </div>

        {PROCESS.map((p, i) => (
          <div
            key={p.step}
            className="relative flex w-[88vw] shrink-0 snap-start flex-col justify-end overflow-hidden sm:w-[70vw] lg:h-full lg:w-[46vw]"
          >
            <img
              src={p.image}
              alt={p.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/35 to-ink/10" />
            <div className="relative min-h-[460px] p-8 pt-40 md:p-12 lg:min-h-0 lg:pt-12">
              <div className="font-display text-6xl font-semibold text-gold/90 md:text-7xl">
                {i + 1}
              </div>
              <h3 className="mt-3 font-display text-3xl font-semibold text-cream md:text-4xl">
                {p.step}
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream/75">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
