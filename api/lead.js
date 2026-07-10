/**
 * Protected lead endpoint for Vercel.
 *
 * Required: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.
 * Optional: TURNSTILE_SECRET_KEY, LEAD_ALERT_WEBHOOK_URL, and ALLOWED_ORIGINS.
 * LEAD_ALERT_WEBHOOK_URL, and ALLOWED_ORIGINS (comma-separated).
 *
 * The in-memory limiter protects each warm function instance. Enable Vercel WAF
 * or a distributed limiter for full production protection across instances.
 */
const MAX_BODY_BYTES = 10_000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_SUBMISSIONS = 5;
const rateBuckets = new Map();

const LIMITS = {
  subject: 80,
  from_name: 120,
  name: 120,
  email: 254,
  contact: 120,
  phone: 50,
  company: 160,
  enquiry: 80,
  volume: 120,
  interest: 600,
  message: 2_000,
  source: 80,
  website: 200,
};
const ALLOWED_FIELDS = new Set(Object.keys(LIMITS));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function reply(res, status, payload, headers = {}) {
  res.setHeader("Cache-Control", "no-store");
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  res.status(status).json(payload);
}

function cleanString(value, limit) {
  if (typeof value !== "string") return null;
  const clean = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  return clean.length <= limit ? clean : null;
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim() || "unknown";
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

function takeRateLimitSlot(ip) {
  const now = Date.now();
  for (const [key, timestamps] of rateBuckets) {
    const fresh = timestamps.filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
    if (fresh.length) rateBuckets.set(key, fresh);
    else rateBuckets.delete(key);
  }

  const timestamps = rateBuckets.get(ip) ?? [];
  if (timestamps.length >= RATE_MAX_SUBMISSIONS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - timestamps[0])) / 1000)) };
  }
  rateBuckets.set(ip, [...timestamps, now]);
  return { allowed: true };
}

function requestOrigins(req) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  const protocol = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
  const configured = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([host ? `${protocol}://${host}` : "", ...configured].filter(Boolean));
}

function originIsAllowed(req) {
  const origin = req.headers.origin;
  if (typeof origin !== "string" || !origin) return false;
  try {
    return requestOrigins(req).has(new URL(origin).origin);
  } catch {
    return false;
  }
}

function turnstileHostnameMatches(req, hostname) {
  if (typeof hostname !== "string" || !hostname) return false;
  return [...requestOrigins(req)].some((origin) => {
    try {
      return new URL(origin).hostname.toLowerCase() === hostname.toLowerCase();
    } catch {
      return false;
    }
  });
}

function validateLead(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "invalid_payload" };

  const data = {};
  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_FIELDS.has(key)) continue;
    const clean = cleanString(value, LIMITS[key]);
    if (clean === null) return { error: "invalid_field" };
    data[key] = clean;
  }

  // Legitimate forms never fill this hidden honeypot field.
  if (data.website) return { error: "spam_detected" };
  if (!data.source || !["Contact page form", "Website chat widget"].includes(data.source)) return { error: "invalid_source" };
  if (data.email && !EMAIL_RE.test(data.email)) return { error: "invalid_email" };
  if (!data.email && !data.phone && !data.contact) return { error: "missing_contact" };
  if (!data.message && !data.interest) return { error: "missing_message" };
  return { data };
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function verifyTurnstile(token, ip, req) {
  const secret = (process.env.TURNSTILE_SECRET_KEY || "").trim();
  if (!secret) return { ok: true, enabled: false };
  if (!token || typeof token !== "string") return { ok: false, code: "captcha_required" };

  try {
    const response = await fetchWithTimeout(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      },
      5_000
    );
    const result = await response.json().catch(() => ({}));
    if (result.success !== true) return { ok: false, code: "captcha_failed" };
    if (!turnstileHostnameMatches(req, result.hostname)) return { ok: false, code: "captcha_hostname_mismatch" };
    return { ok: true, enabled: true };
  } catch {
    return { ok: false, code: "captcha_unavailable" };
  }
}

function formatLead(data) {
  const row = (emoji, label, value) => (value ? `${emoji} ${label}: ${value}` : "");
  return [
    "🌾 New lead — FIKIR FOOD PROCESSING",
    data.subject ? `(${data.subject})` : "",
    "",
    row("👤", "Name", data.name || data.from_name),
    row("✉️", "Email", data.email),
    row("📞", "Contact", data.contact),
    row("📞", "Phone", data.phone),
    row("🏢", "Company", data.company),
    row("📌", "Enquiry", data.enquiry),
    row("📦", "Volume", data.volume),
    row("📦", "Interest", data.interest),
    row("📝", "Message", data.message),
    "",
    `via ${data.source}`,
  ].filter(Boolean).join("\n");
}

async function sendTelegram(data) {
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || "").trim();
  if (!token || !chatId) return { ok: false, reason: "telegram_not_configured" };

  try {
    const response = await fetchWithTimeout(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: formatLead(data), disable_web_page_preview: true }),
      },
      8_000
    );
    const result = await response.json().catch(() => ({}));
    return result.ok === true ? { ok: true } : { ok: false, reason: "telegram_rejected" };
  } catch {
    return { ok: false, reason: "telegram_unreachable" };
  }
}

async function alertOperations(event, detail) {
  const webhook = (process.env.LEAD_ALERT_WEBHOOK_URL || "").trim();
  if (!webhook) return;
  try {
    await fetchWithTimeout(
      webhook,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "fikir-lead-api", event, detail, occurredAt: new Date().toISOString() }),
      },
      2_000
    );
  } catch {
    // The user-facing response must never depend on an optional alert channel.
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    reply(res, 405, { success: false, error: "method_not_allowed" }, { Allow: "POST" });
    return;
  }
  if (!originIsAllowed(req)) {
    reply(res, 403, { success: false, error: "origin_not_allowed" });
    return;
  }
  if (!String(req.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
    reply(res, 415, { success: false, error: "json_required" });
    return;
  }
  if (Number(req.headers["content-length"] || 0) > MAX_BODY_BYTES) {
    reply(res, 413, { success: false, error: "payload_too_large" });
    return;
  }

  const ip = getClientIp(req);
  const limit = takeRateLimitSlot(ip);
  if (!limit.allowed) {
    console.warn(JSON.stringify({ event: "lead_rate_limited" }));
    reply(res, 429, { success: false, error: "rate_limited" }, { "Retry-After": String(limit.retryAfter) });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      reply(res, 400, { success: false, error: "invalid_json" });
      return;
    }
  }
  const parsed = validateLead(body);
  if (parsed.error) {
    reply(res, 400, { success: false, error: parsed.error });
    return;
  }

  const captcha = await verifyTurnstile(req.headers["cf-turnstile-response"], ip, req);
  if (!captcha.ok) {
    console.warn(JSON.stringify({ event: "lead_captcha_rejected", code: captcha.code, source: parsed.data.source }));
    if (captcha.code === "captcha_unavailable") await alertOperations("captcha_unavailable", captcha.code);
    reply(res, captcha.code === "captcha_unavailable" ? 503 : 400, { success: false, error: captcha.code });
    return;
  }

  console.info(JSON.stringify({ event: "lead_received", source: parsed.data.source, captcha: captcha.enabled }));
  const telegram = await sendTelegram(parsed.data);
  if (telegram.ok) {
    console.info(JSON.stringify({ event: "lead_delivered", channel: "telegram", source: parsed.data.source }));
    reply(res, 200, { success: true });
    return;
  }

  console.error(JSON.stringify({ event: "telegram_delivery_failed", telegram: telegram.reason, source: parsed.data.source }));
  await alertOperations("telegram_delivery_failed", { telegram: telegram.reason });
  // TEMP DEBUG: surface why Telegram failed (reason + env presence, no secret values).
  reply(res, 503, {
    success: false,
    error: "telegram_unavailable",
    debug: {
      reason: telegram.reason,
      hasToken: !!(process.env.TELEGRAM_BOT_TOKEN || "").trim(),
      hasChat: !!(process.env.TELEGRAM_CHAT_ID || "").trim(),
      chatStart: (process.env.TELEGRAM_CHAT_ID || "").trim().slice(0, 4),
    },
  });
}
