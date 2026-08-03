import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Play, SpeakerSimpleSlash } from "@phosphor-icons/react";
import Img from "./Img";
import FilmPlayer from "./FilmPlayer";
import { LOW_POWER } from "../lib/perf";
import { useFilm } from "../content";
import { useI18n } from "../i18n/I18nProvider";
import { Accent } from "../i18n/Accent";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The homepage film moment: a full-bleed, scroll-scaled ambient montage with a
 * rotating "watch the film" dial that opens the complete film in a fullscreen
 * player.
 *
 * The background is a ~2.7 MB, 24s silent loop, NOT the 70 MB film — the full
 * cut is only fetched when someone actually asks for it. On reduced-motion or
 * software-rendered devices the loop is replaced by a still, so no device ever
 * pays for a continuously decoding video it did not ask for.
 */
export default function FilmSection() {
  const { t } = useI18n();
  const film = useFilm();
  const reduce = useReducedMotion();
  const ambient = !reduce && !LOW_POWER;
  const poster = "/media/factory-aerial.jpg";
  const wrap = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start end", "end start"],
  });
  // Slow push-in as the section travels through the viewport.
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <>
      <section
        ref={wrap}
        className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink"
        aria-label={t("film.aria", "The Fikir company film")}
      >
        {/* Media layer */}
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { scale, y }}
        >
          {ambient ? (
            <video
              src={film.loopUrl}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              tabIndex={-1}
              className="h-full w-full object-cover"
            />
          ) : (
            <Img
              src={poster}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>

        {/* Legibility gradients */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />

        {/* Content */}
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
          <div className="grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <motion.span
                className="eyebrow"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {t("film.eyebrow", "The film")}
              </motion.span>

              <motion.h2
                className="display-2 mt-6 max-w-2xl text-4xl !text-cream md:text-6xl"
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
              >
                <Accent
                  text={t("film.title", "Eight minutes inside *the plant behind the pack.*")}
                  tone="dark"
                />
              </motion.h2>

              <motion.p
                className="mt-6 max-w-lg text-base leading-relaxed text-cream/70"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
              >
                {t(
                  "film.body",
                  "Grain arriving, mills turning, dough rising, every batch tested, and a fleet heading out before dawn. This is an ordinary day in Adama."
                )}
              </motion.p>
            </div>

            {/* Watch dial */}
            <motion.div
              className="lg:col-span-4 lg:col-start-9 lg:justify-self-end"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group relative inline-flex h-40 w-40 items-center justify-center md:h-48 md:w-48"
              >
                {/* Rotating caption ring */}
                <svg viewBox="0 0 100 100" aria-hidden className="ring-spin absolute inset-0 h-full w-full">
                  <defs>
                    <path
                      id="film-ring"
                      fill="none"
                      d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                    />
                  </defs>
                  <text className="fill-cream/70 font-mono uppercase" fontSize="7.4" letterSpacing="2.6">
                    {/* xlinkHref kept alongside href for older Safari, which
                        ignores the SVG2 `href` form on <textPath>. */}
                    <textPath href="#film-ring" xlinkHref="#film-ring" startOffset="0">
                      {t("film.ring", "Watch the film · Watch the film · ")}
                    </textPath>
                  </text>
                </svg>

                {/* Hairline circle */}
                <span className="absolute inset-6 rounded-full border border-cream/25 transition-colors duration-500 group-hover:border-gold/60" />

                {/* Core */}
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 md:h-20 md:w-20">
                  <Play size={26} weight="fill" className="ml-1" />
                </span>
              </button>

              <div className="mt-5 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50 lg:justify-end">
                <span className="tabular-nums">{film.duration}</span>
                <span aria-hidden className="h-3 w-px bg-cream/25" />
                <span className="inline-flex items-center gap-1.5">
                  <SpeakerSimpleSlash size={13} />
                  {t("film.silent", "Silent")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FilmPlayer open={open} onClose={() => setOpen(false)} src={film.fullUrl} poster={poster} />
    </>
  );
}
