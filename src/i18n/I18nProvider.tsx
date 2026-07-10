import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { AM } from "./am";

export type Lang = "en" | "am";
type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate: returns the Amharic string for `key` when in Amharic, else the
   *  English fallback passed inline. Missing keys fall back to English, so the
   *  UI never breaks or shows blanks. */
  t: (key: string, en: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);
const STORAGE = "fikir-lang";

function initialLang(): Lang {
  try {
    const s = localStorage.getItem(STORAGE);
    if (s === "am" || s === "en") return s;
  } catch {
    /* SSR / disabled storage */
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback((key: string, en: string) => (lang === "am" ? AM[key] ?? en : en), [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
