/**
 * Free lead delivery via Telegram Bot API.
 *
 * Runs as a Vercel Serverless Function (free on the Hobby plan). The bot token
 * and chat id live in Vercel environment variables, never in the client bundle:
 *   TELEGRAM_BOT_TOKEN  - from @BotFather
 *   TELEGRAM_CHAT_ID    - your numeric chat id (see setup notes)
 *
 * The browser POSTs the lead here; we format it and push it to Telegram. If the
 * bot isn't configured yet, we return 502 so the client falls back to email.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "method_not_allowed" });
    return;
  }

  // Trim so a stray space/newline pasted into the Vercel env var can't break it.
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || "").trim();
  if (!token || !chatId) {
    res.status(502).json({ success: false, error: "not_configured" });
    return;
  }

  let data = {};
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    data = {};
  }

  const row = (emoji, label, value) => (value ? `${emoji} ${label}: ${value}` : "");
  const text = [
    "🌾 New lead — FIKIR FOOD PROCESSING",
    data.subject ? `(${data.subject})` : "",
    "",
    row("👤", "Name", data.name),
    row("✉️", "Email", data.email),
    row("📞", "Contact", data.contact),
    row("📞", "Phone", data.phone),
    row("🏢", "Company", data.company),
    row("📌", "Enquiry", data.enquiry),
    row("📦", "Volume", data.volume),
    row("📦", "Interest", data.interest),
    row("📝", "Message", data.message),
    "",
    data.source ? `via ${data.source}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // plain text (no parse_mode) so special characters in user input never 400
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    const json = await tg.json();
    if (!json.ok) {
      // Surface Telegram's own reason (e.g. "chat not found", "Unauthorized")
      // so misconfiguration is diagnosable instead of a blank rejection.
      res
        .status(502)
        .json({ success: false, error: "telegram_rejected", detail: json.description });
      return;
    }
    res.status(200).json({ success: true });
  } catch {
    res.status(502).json({ success: false, error: "telegram_unreachable" });
  }
}
