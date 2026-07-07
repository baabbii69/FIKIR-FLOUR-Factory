import { useEffect } from "react";

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) {
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute("content", description);
    }
  }, [title, description]);
}
