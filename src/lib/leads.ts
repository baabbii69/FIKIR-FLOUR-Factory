import { getTurnstileToken } from "./turnstile";

/**
 * Lead delivery, for two deploys at once.
 *
 * The same bundle runs in two places, and they have different capabilities:
 *
 *   Vercel  — /api/lead exists. It sends to Telegram. This is the primary.
 *   Plesk   — static Apache. No runtime at all; the SPA catch-all answers
 *             /api/lead with index.html and HTTP 200.
 *
 * That second case is what silently ate every enquiry before: a 200 with an
 * HTML body is not an error by any obvious test, so the old code neither
 * succeeded nor recognised failure — it threw before reaching the email
 * fallback, and both the contact form and the chat widget reported "Something
 * went wrong" every single time.
 *
 * The fix is to check the **content type**. JSON means a real backend answered.
 * HTML means there is no backend here, whatever the status code says. That one
 * test lets an identical build use Telegram on Vercel and fall through to email
 * on Plesk, with no per-host configuration to forget.
 *
 * Any failure of the protected path falls back rather than throws: a lead
 * arriving unfiltered beats a lead that is never sent.
 *
 * Web3Forms documents this key as browser-side and it is domain-restricted to
 * the deployed site; the API rejects non-browser origins outright. It is
 * intentionally public.
 */
const WEB3FORMS_KEY = "cd8116ba-fd37-4b61-a33e-6da5fc0f4259";

/**
 * An absolute URL, deliberately, so one build works on both hosts:
 *
 *   On Vercel  this is the site's own origin — same-origin, no CORS involved.
 *   On Plesk   it is cross-origin, which the function allows because
 *              fikirfoods.et is listed in its ALLOWED_ORIGINS.
 *
 * A relative "/api/lead" would only work on Vercel; the Plesk build would hit
 * its own SPA catch-all and never reach Telegram. Keeping the URL absolute
 * removes the need for a per-host env var that someone must remember to set —
 * and the endpoint is public knowledge anyway, since it ships in the bundle.
 */
const LEAD_ENDPOINT =
  import.meta.env.VITE_LEAD_ENDPOINT?.trim() ||
  "https://fikir-flour-factory.vercel.app/api/lead";

type Fields = Record<string, string>;
type LeadResponse = { success?: boolean; error?: string };

export class LeadSubmissionError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

async function sendViaProtectedEndpoint(fields: Fields): Promise<"sent" | "fallback"> {
  if (!LEAD_ENDPOINT) return "fallback";

  let turnstileToken: string | undefined;
  try {
    turnstileToken = await getTurnstileToken();
  } catch {
    // The captcha is a spam filter, not a gate on contacting the company.
    return "fallback";
  }

  let response: Response;
  try {
    response = await fetch(LEAD_ENDPOINT, {
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

  // An SPA catch-all answers 200 with HTML. Checking the content type is what
  // distinguishes "no backend here" from a genuine reply.
  if (!response.headers.get("content-type")?.includes("application/json")) return "fallback";

  const result = (await response.json().catch(() => null)) as LeadResponse | null;
  if (!result) return "fallback";
  if (response.ok && result.success === true) return "sent";
  return "fallback";
}

async function sendViaWeb3Forms(fields: Fields): Promise<void> {
  let response: Response;
  try {
    response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
    });
  } catch {
    // Offline, or the network dropped mid-request.
    throw new LeadSubmissionError("network_unavailable");
  }

  const result = (await response.json().catch(() => null)) as LeadResponse | null;
  if (!response.ok || result?.success !== true) {
    throw new LeadSubmissionError("email_submission_failed");
  }
}

/**
 * Delivers to Telegram and email together, rather than treating email as a
 * rescue for a failed Telegram send.
 *
 * The earlier version returned the moment Telegram succeeded, so once Telegram
 * started working the inbox went quiet — which reads as a broken form even
 * though nothing was lost. A Telegram group is an alert: easy to miss, easy to
 * scroll past, and gone if someone leaves. Email is the durable, searchable
 * copy. A business wants both, and they are different jobs.
 *
 * Sent in parallel so the visitor waits for the slower of the two rather than
 * the sum, and it only fails if *both* channels fail — one dead channel must
 * never lose a lead that the other delivered.
 */
export async function submitLead(fields: Fields): Promise<void> {
  const [telegram, email] = await Promise.allSettled([
    sendViaProtectedEndpoint(fields),
    sendViaWeb3Forms(fields),
  ]);

  const telegramSent = telegram.status === "fulfilled" && telegram.value === "sent";
  const emailSent = email.status === "fulfilled";

  if (!telegramSent && !emailSent) throw new LeadSubmissionError("all_channels_failed");
}
