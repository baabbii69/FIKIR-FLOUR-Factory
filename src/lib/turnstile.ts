type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  execute: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile_unavailable")));
    script.onerror = () => reject(new Error("turnstile_unavailable"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Turnstile is optional locally. When TURNSTILE_SECRET_KEY is set on Vercel,
 * VITE_TURNSTILE_SITE_KEY must also be set at build time or submissions fail closed.
 */
export async function getTurnstileToken(): Promise<string | undefined> {
  if (!siteKey) return undefined;

  const turnstile = await loadTurnstile();
  const container = document.createElement("div");
  container.className = "sr-only";
  document.body.appendChild(container);

  return new Promise((resolve, reject) => {
    let widgetId = "";
    const cleanup = () => {
      if (widgetId) turnstile.remove(widgetId);
      container.remove();
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("turnstile_timeout"));
    }, 15_000);

    widgetId = turnstile.render(container, {
      sitekey: siteKey,
      size: "invisible",
      callback: (token: string) => {
        window.clearTimeout(timeout);
        cleanup();
        resolve(token);
      },
      "error-callback": () => {
        window.clearTimeout(timeout);
        cleanup();
        reject(new Error("turnstile_unavailable"));
      },
      "expired-callback": () => {
        window.clearTimeout(timeout);
        cleanup();
        reject(new Error("turnstile_expired"));
      },
    });
    turnstile.execute(widgetId);
  });
}