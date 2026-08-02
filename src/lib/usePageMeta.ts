import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ORIGIN = "https://fikirfoods.et";

/** Create the tag if it is missing, then set its content. */
function meta(selector: string, create: () => HTMLMetaElement, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Keeps the document title, description, canonical URL and social tags in step
 * with the current route.
 *
 * A single-page app never reloads, so without this every route would report the
 * home page's title and description — and every share of an inner page would
 * preview as the home page.
 *
 * The canonical URL matters here specifically because `/products?cat=flour`
 * renders the same page as `/products`; pointing both at `/products` stops them
 * being read as duplicate content.
 */
export function usePageMeta(title: string, description?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;

    const url = `${ORIGIN}${pathname === "/" ? "/" : pathname}`;

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    meta('meta[property="og:url"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:url");
      return m;
    }, url);

    meta('meta[property="og:title"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:title");
      return m;
    }, title);

    meta('meta[name="twitter:title"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "twitter:title");
      return m;
    }, title);

    if (description) {
      meta('meta[name="description"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        return m;
      }, description);

      meta('meta[property="og:description"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:description");
        return m;
      }, description);

      meta('meta[name="twitter:description"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:description");
        return m;
      }, description);
    }
  }, [title, description, pathname]);
}
