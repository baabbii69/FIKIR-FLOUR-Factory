/**
 * Web3Forms lead delivery. The access key is public by design (it is domain-locked
 * in the Web3Forms dashboard), so it is safe to ship in the client bundle — no
 * server or secret API key is involved. Both the contact form and the chat widget
 * submit through here so leads land in the same inbox.
 */
const ACCESS_KEY = "de0b1467-d5d9-4e39-83b8-c8423e387928";
const ENDPOINT = "https://api.web3forms.com/submit";

export async function submitLead(fields: Record<string, string>): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: ACCESS_KEY, ...fields }),
  });

  let ok = res.ok;
  try {
    const json = (await res.json()) as { success?: boolean };
    ok = ok && json.success !== false;
  } catch {
    // Non-JSON response; fall back to the HTTP status.
  }
  if (!ok) throw new Error("Submission failed");
}
