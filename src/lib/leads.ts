import { getTurnstileToken } from "./turnstile";

/** One protected entry point for contact-form and chat leads. */
type Fields = Record<string, string>;
type LeadResponse = { success?: boolean; error?: string };

export class LeadSubmissionError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

export async function submitLead(fields: Fields): Promise<void> {
  const turnstileToken = await getTurnstileToken();
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
    throw new LeadSubmissionError("network_unavailable");
  }

  const result = (await response.json().catch(() => ({}))) as LeadResponse;
  if (response.ok && result.success === true) return;
  throw new LeadSubmissionError(result.error || "submission_failed");
}
