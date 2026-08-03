import { getTurnstileToken } from "./turnstile";

/**
 * Lead delivery for a **static** deploy.
 *
 * The site is served by Apache on Plesk with an SPA catch-all, so there is no
 * serverless runtime and no /api/lead. That detail broke the previous version
 * badly enough to lose every enquiry: it POSTed to /api/lead regardless, the
 * rewrite rule answered with index.html and **HTTP 200**, the JSON parse failed,
 * and the status was neither 404 nor 5xx — so the "endpoint missing" branch
 * never matched and it threw before reaching the Web3Forms fallback. Every
 * submission showed "Something went wrong", on the form and in the chat widget.
 *
 * So the protected endpoint is now strictly opt-in via VITE_LEAD_ENDPOINT. With
 * it unset (the Plesk build) mail goes straight to Web3Forms — one request, no
 * dead round-trip. If it is set and anything at all goes wrong, we fall back to
 * email rather than throw: a lead reaching the inbox unfiltered beats a lead
 * that is never sent.
 *
 * Web3Forms documents this key as browser-side and it is domain-restricted to
 * the deployed site; the API rejects non-browser origins outright. It is
 * intentionally public.
 */
const WEB3FORMS_KEY = "cd8116ba-fd37-4b61-a33e-6da5fc0f4259";

/** Set only where a real backend exists. Unset on the static Plesk build. */
const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT?.trim();

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

export async function submitLead(fields: Fields): Promise<void> {
  if ((await sendViaProtectedEndpoint(fields)) === "sent") return;
  await sendViaWeb3Forms(fields);
}
