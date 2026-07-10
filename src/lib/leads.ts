import { getTurnstileToken } from "./turnstile";

/**
 * Protected lead flow:
 * 1. Send through the rate-limited Telegram endpoint.
 * 2. If Telegram is unavailable, preserve the existing Web3Forms browser fallback.
 *
 * Web3Forms documents this as a browser-side API and the current key is already
 * domain-restricted to the deployed site. It intentionally remains public.
 */
const WEB3FORMS_KEY = "de0b1467-d5d9-4e39-83b8-c8423e387928";

type Fields = Record<string, string>;
type LeadResponse = { success?: boolean; error?: string };

export class LeadSubmissionError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

async function sendViaProtectedEndpoint(fields: Fields): Promise<"sent" | "fallback"> {
  let turnstileToken: string | undefined;
  try {
    turnstileToken = await getTurnstileToken();
  } catch {
    throw new LeadSubmissionError("captcha_unavailable");
  }

  let response: Response;
  try {
    response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(turnstileToken ? { "cf-turnstile-response": turnstileToken } : {}),
      },
      body: JSON.stringify(fields),
    });
  } catch {
    return "fallback";
  }

  const result = (await response.json().catch(() => ({}))) as LeadResponse;
  if (response.ok && result.success === true) return "sent";
  if (result.error === "telegram_unavailable") return "fallback";
  // Endpoint missing or server error (local dev, 404, 5xx) -> fall back to email
  // so a lead is never lost. Genuine client rejections (rate limit, validation,
  // captcha) still surface as errors below.
  if (response.status === 404 || response.status >= 500) return "fallback";
  throw new LeadSubmissionError(result.error || "submission_failed");
}

async function sendViaWeb3Forms(fields: Fields): Promise<void> {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
  });
  const result = (await response.json().catch(() => ({}))) as LeadResponse;
  if (!response.ok || result.success === false) throw new LeadSubmissionError("email_submission_failed");
}

export async function submitLead(fields: Fields): Promise<void> {
  if ((await sendViaProtectedEndpoint(fields)) === "sent") return;
  await sendViaWeb3Forms(fields);
}