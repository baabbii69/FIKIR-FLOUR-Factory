# How leads reach you

Two deployments exist, and they have different capabilities:

| | |
|---|---|
| **fikirfoods.et** | Plesk / Apache. Static files only — cannot run code. |
| **fikir-flour-factory.vercel.app** | Vercel. Serves the site *and* runs `api/lead.js`. |

Both send leads to the same place.

```
visitor submits the contact form or the chat widget
        │
        ▼
  POST https://fikir-flour-factory.vercel.app/api/lead
        │
        ├── success ──► Telegram message to the sales group
        │
        └── unreachable ──► Web3Forms ──► fikirfoods8@gmail.com
```

The email path is a fallback, not a parallel copy. A Telegram message arriving
means the primary path worked; an email arriving instead means the function was
unreachable and the lead was rescued.

---

## Why the endpoint is an absolute URL

`src/lib/leads.ts` posts to the full `https://fikir-flour-factory.vercel.app/api/lead`
rather than a relative `/api/lead`.

A relative path only works on Vercel. From Plesk it resolves to *that* server,
where the SPA catch-all answers with `index.html` and **HTTP 200** — not a 404.
That is what silently ate every enquiry before this was fixed: a 200 with an
HTML body is not an error by any obvious test, so the code neither succeeded
nor recognised failure.

Two things make the absolute URL safe:

1. **The content-type check.** JSON means a real backend answered; HTML means
   there is no backend here, whatever the status code claims.
2. **CORS.** The function echoes back the request origin, but only after it
   passes the `ALLOWED_ORIGINS` allowlist.

The URL is not a secret — it ships in the browser bundle either way.

---

## The configuration that makes it work

All of it lives in **Vercel → project → Settings → Environment Variables**.
Nothing is stored in this repository.

| Variable | Purpose |
|---|---|
| `TELEGRAM_BOT_TOKEN` | the bot that posts to the group |
| `TELEGRAM_CHAT_ID` | which group receives leads |
| `ALLOWED_ORIGINS` | `https://fikirfoods.et,https://www.fikirfoods.et` |

**`ALLOWED_ORIGINS` is not optional.** Without it the function only trusts its
own Vercel domain, and every submission from `fikirfoods.et` is rejected with
`origin_not_allowed` — leads then quietly fall through to email instead.

> Environment variables only apply to deployments made **after** they are saved.
> Changing one without redeploying changes nothing.

---

## Verifying it end to end

Preflight, which proves the origin is allowed without sending a message:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X OPTIONS \
  -H "Origin: https://fikirfoods.et" \
  -H "Access-Control-Request-Method: POST" \
  https://fikir-flour-factory.vercel.app/api/lead
# 204 = allowed. 403 = ALLOWED_ORIGINS is missing or wrong.
```

A real submission, which **does** post to the Telegram group:

```bash
curl -s -X POST https://fikir-flour-factory.vercel.app/api/lead \
  -H "Content-Type: application/json" \
  -H "Origin: https://fikirfoods.et" \
  -d '{"subject":"TEST - ignore","name":"Test","email":"t@fikirfoods.et",
       "message":"Test.","source":"Contact page form"}'
# {"success":true}
```

`source` must be exactly `Contact page form` or `Website chat widget` — the
function rejects anything else as `invalid_source`.

---

## Built-in protection

- **Honeypot** — a hidden `website` field that only bots fill in
- **Rate limit** — 5 submissions per IP per 10 minutes, per warm instance
- **Origin allowlist** — requests from other sites are refused outright
- **Turnstile** (optional, not currently enabled) — set `TURNSTILE_SECRET_KEY`
  on Vercel and `VITE_TURNSTILE_SITE_KEY` at build time. Both, or neither: a
  secret with no site key fails every submission, though the email fallback
  would still carry the lead through.

---

## Troubleshooting

**Leads arrive by email instead of Telegram**
The function was unreachable or refused. Run the preflight check above. A 403
means `ALLOWED_ORIGINS` is wrong or a redeploy was skipped.

**Nothing arrives at all**
Then email failed too, which points at the browser rather than Telegram. Check
the console on the live site for a CORS error.

**`telegram_not_configured` in the Vercel logs**
`TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` is empty for that deployment.

**`telegram_rejected`**
Wrong chat ID, or the bot was removed from the group. Group IDs start `-100`.

**Rotating the bot token**
`/revoke` in @BotFather, update the variable in Vercel, redeploy. No website
change needed.

> ⚠️ An older bot token is sitting in plaintext in `.claude/settings.local.json`,
> saved by a tool's command allowlist. It is gitignored and was never committed
> — verified against every commit — so nothing leaked. Revoke it anyway and
> delete those entries.
