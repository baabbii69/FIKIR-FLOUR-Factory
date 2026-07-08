/**
 * One entry point for every lead (contact form + chat widget).
 *
 * Primary channel: our own /api/lead serverless function, which pushes the lead
 * to Telegram instantly and for free. If that isn't reachable or isn't
 * configured yet (e.g. local preview, or before the Telegram env vars are set),
 * we fall back to Web3Forms email so nothing is ever lost.
 *
 * The Web3Forms access key is public by design (domain-locked in the dashboard),
 * so it is safe in the client bundle. No secret keys ship to the browser.
 */
const WEB3FORMS_KEY = "de0b1467-d5d9-4e39-83b8-c8423e387928";

type Fields = Record<string, string>;

async function sendViaTelegram(fields: Fields): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) return false;
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

async function sendViaEmail(fields: Fields): Promise<void> {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
  });
  let ok = res.ok;
  try {
    const json = (await res.json()) as { success?: boolean };
    ok = ok && json.success !== false;
  } catch {
    /* fall back to HTTP status */
  }
  if (!ok) throw new Error("Submission failed");
}

export async function submitLead(fields: Fields): Promise<void> {
  if (await sendViaTelegram(fields)) return;
  await sendViaEmail(fields);
}
