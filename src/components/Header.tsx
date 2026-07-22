import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { NAV, CONTACT } from "../data/site";
import { useI18n } from "../i18n/I18nProvider";
import LangSwitcher from "../i18n/LangSwitcher";
import Btn from "./Btn";

const NAV_KEY: Record<string, string> = {
  "/": "nav.home",
  "/products": "nav.products",
  "/about": "nav.about",
  "/facility": "nav.facility",
  "/careers": "nav.careers",
  "/contact": "nav.contact",
};

function Wordmark({ solid }: { solid: boolean }) {
  // solid = over a light (cream) header -> full-colour mark + ink text.
  // !solid = over the dark hero (or dark mobile menu) -> cream line-art mark + cream text.
  const { t } = useI18n();
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="FIKIR FOOD PROCESSING home">
      <img
        src={solid ? "/logo-mark.png" : "/logo-mark-cream.png"}
        alt=""
        className="h-11 w-auto"
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[22px] font-bold tracking-tight transition-colors duration-300 ${solid ? "text-ink" : "text-cream"}`}
        >
          Fikir
        </span>
        <span
          className={`mt-1 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors duration-300 ${solid ? "text-clay/80" : "text-cream/70"}`}
        >
          {t("brand.sub", "Food Processing")}
        </span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const reduce = useReducedMotion();
  const { t } = useI18n();

  // Sentinel-based sticky state: no scroll listeners.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Close menu on navigation, lock body scroll while open.
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="absolute top-0 h-px w-full" />

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          solid
            ? "border-b border-linen bg-cream/92 shadow-[0_8px_40px_rgba(28,19,8,0.06)] backdrop-blur-md"
            : "border-b border-cream/10 bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
          <Wordmark solid={solid} />

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300 ${
                    isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                  } ${
                    solid
                      ? isActive
                        ? "text-ink"
                        : "text-clay hover:text-ink"
                      : isActive
                        ? "text-cream"
                        : "text-cream/75 hover:text-cream"
                  }`
                }
              >
                {t(NAV_KEY[item.to] ?? "", item.label)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <LangSwitcher tone={solid ? "solid" : "transparent"} />
            </div>
            <Btn to="/contact" className="hidden !px-6 !py-3 lg:inline-flex">
              {t("header.quote", "Request a Quote")}
            </Btn>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`inline-flex h-11 w-11 items-center justify-center transition-colors lg:hidden ${solid ? "text-ink" : "text-cream"}`}
            >
              <List size={26} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-ink"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-[72px] items-center justify-between px-5 md:px-10">
              <Wordmark solid={false} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center text-cream"
              >
                <X size={26} />
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col justify-center gap-1 px-8 md:px-16"
              aria-label="Mobile"
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block py-3 font-display text-5xl font-semibold transition-colors ${
                        isActive ? "text-gold" : "text-cream hover:text-gold"
                      }`
                    }
                  >
                    {t(NAV_KEY[item.to] ?? "", item.label)}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="flex flex-col items-start gap-4 border-t border-cream/10 px-8 py-6 sm:flex-row sm:items-center sm:justify-between md:px-16"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <p className="min-w-0 break-words font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
                {CONTACT.phone}
                <span className="mx-3 text-gold">·</span>
                {CONTACT.email}
              </p>
              <div className="shrink-0">
                <LangSwitcher tone="transparent" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
