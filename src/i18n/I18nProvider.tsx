import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { AM } from "./am";
import { OM } from "./om";

export type Lang = "en" | "am" | "om";

// Non-English dictionaries. English is always the inline fallback passed to t(),
// so any missing key in any language simply renders English — the UI never
// breaks. To add another language, drop a dictionary here and a Lang entry.
const DICTS: Partial<Record<Lang, Record<string, string>>> = { am: AM, om: OM };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate: returns the active language's string for `key`, else the English
   *  fallback passed inline. Missing keys fall back to English. */
  t: (key: string, en: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);
const STORAGE = "fikir-lang";
const VALID: Lang[] = ["en", "am", "om"];

function initialLang(): Lang {
  try {
    const s = localStorage.getItem(STORAGE) as Lang | null;
    if (s && VALID.includes(s)) return s;
  } catch {
    /* SSR / disabled storage */
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    // Drives the [lang] font override (Ethiopic for am; Latin fonts for om/en).
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback(
    (key: string, en: string) => (lang === "en" ? en : DICTS[lang]?.[key] ?? en),
    [lang]
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
