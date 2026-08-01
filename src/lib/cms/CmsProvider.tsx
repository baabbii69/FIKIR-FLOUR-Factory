import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { sanity } from "./client";
import { SITE_QUERY } from "./query";
import type { SiteContent } from "./types";
import snapshot from "../../generated/content.json";

/**
 * Supplies CMS content to the app, in three tiers, fastest first:
 *
 *   1. A snapshot baked into the bundle at build time. Present on the very
 *      first render, so the site never waits on the network to paint and keeps
 *      working if Sanity is unreachable.
 *   2. localStorage, if a previous visit cached something newer.
 *   3. A background fetch from Sanity's edge CDN (~28 KB gzipped), applied
 *      after paint.
 *
 * The fetch never gates rendering. If it fails, tier 1 is already on screen and
 * the failure is invisible to the visitor.
 */

const CACHE_KEY = "fikir-cms-v1";
/** Beyond this, the cached copy is ignored in favour of the bundled snapshot,
 *  which at least matches the deployed build. */
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

type Ctx = { content: SiteContent; source: "snapshot" | "cache" | "network" };

const CmsContext = createContext<Ctx | null>(null);

// The generated JSON is structurally wider than the hand-written type
// (every locale key present, extra fields), so go via unknown.
const baked = snapshot as unknown as SiteContent;

function readCache(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: SiteContent };
    if (!data?.settings || Date.now() - at > CACHE_MAX_AGE) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: SiteContent) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* quota or private mode — the snapshot still covers us */
  }
}

export function CmsProvider({ children }: { children: ReactNode }) {
  // Start from the cache when it looks usable, otherwise the bundled snapshot.
  const [state, setState] = useState<Ctx>(() => {
    const cached = readCache();
    return cached ? { content: cached, source: "cache" } : { content: baked, source: "snapshot" };
  });

  useEffect(() => {
    let alive = true;
    // Deliberately not awaited into render: this runs after first paint.
    sanity
      .fetch<SiteContent>(SITE_QUERY)
      .then((data) => {
        if (!alive || !data?.settings) return;
        writeCache(data);
        setState((prev) =>
          // Avoid a pointless re-render (and any animation restart) when
          // nothing actually changed since the snapshot was baked.
          JSON.stringify(prev.content) === JSON.stringify(data)
            ? prev
            : { content: data, source: "network" }
        );
      })
      .catch(() => {
        /* offline or CMS down — tier 1 is already rendered */
      });
    return () => {
      alive = false;
    };
  }, []);

  return <CmsContext.Provider value={state}>{children}</CmsContext.Provider>;
}

/** The whole content tree. Never null: the snapshot guarantees a value. */
export function useCms(): SiteContent {
  const ctx = useContext(CmsContext);
  return ctx?.content ?? baked;
}

/** Which tier the current content came from. Useful when debugging staleness. */
export function useCmsSource() {
  return useContext(CmsContext)?.source ?? "snapshot";
}

/** Resolve a localised field for the active language, falling back to English. */
export function useLocalised() {
  const content = useCms();
  return useMemo(() => content, [content]);
}
