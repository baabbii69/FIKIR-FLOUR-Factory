import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { AM } from "./am";
import { OM } from "./om";
import { useCms } from "../lib/cms/CmsProvider";
import { flattenToKeys } from "../lib/cms/flattenKeys";

export type Lang = "en" | "am" | "om";

// Non-English dictionaries. English is always the inline fallback passed to t(),
// so any missing key in any language simply renders English — the UI never
// breaks. To add another language, drop a dictionary here and a Lang entry.
const DICTS: Partial<Record<Lang, Record<string, string>>> = { am: AM, om: OM };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate: CMS content wins, then the built-in dictionary, then the
   *  English fallback passed inline. A missing value at any level simply falls
   *  through, so the UI never breaks. */
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
  const cms = useCms();

  useEffect(() => {
    // Drives the [lang] font override (Ethiopic for am; Latin fonts for om/en).
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  /**
   * CMS page documents, flattened back onto the keys the components already
   * use. This is what lets an editor change any page's copy in Sanity without
   * a single component being touched. Recomputed only when the content object
   * or the language actually changes.
   */
  const cmsDict = useMemo(() => flattenToKeys(cms, lang), [cms, lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: string, en: string) => cmsDict[key] ?? (lang === "en" ? en : DICTS[lang]?.[key] ?? en),
    [cmsDict, lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
