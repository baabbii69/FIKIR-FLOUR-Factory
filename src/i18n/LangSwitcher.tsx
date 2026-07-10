import { useId } from "react";
import { motion } from "motion/react";
import { Globe } from "@phosphor-icons/react";
import { useI18n } from "./I18nProvider";
import type { Lang } from "./I18nProvider";

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "am", label: "አማ" },
];

/** Segmented EN / አማ toggle with a sliding pill. `tone` matches the header state. */
export default function LangSwitcher({ tone = "solid" }: { tone?: "solid" | "transparent" }) {
  const { lang, setLang } = useI18n();
  const id = useId();
  const trans = tone === "transparent";

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center gap-1.5 rounded-full border p-0.5 pl-2 ${
        trans ? "border-cream/25" : "border-linen"
      }`}
    >
      <Globe size={13} weight="bold" className={trans ? "text-cream/60" : "text-clay/60"} />
      <div className="relative inline-flex">
        {LANGS.map((l) => {
          const on = lang === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              aria-pressed={on}
              className={`relative rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200 ${
                on ? "text-cream" : trans ? "text-cream/60 hover:text-cream" : "text-clay hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId={`lang-pill-${id}`}
                  className="absolute inset-0 -z-0 rounded-full bg-green-deep"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{l.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
