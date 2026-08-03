# Telegram lead notifications — setup

The website is a **static** build on Plesk, so it cannot run code. Telegram
needs a bot token, and a token in a static site is public — anyone reading the
page source could post as your bot. So the token has to live somewhere
server-side.

This guide puts **only the lead function** on Vercel's free tier. The website
stays exactly where it is on Plesk. Nothing about the site moves.

```
visitor → fikirfoods.et (Plesk)
             │
             └── POST → lead API (Vercel) → Telegram  ← token lives here
                            │
                            └── if it fails → Web3Forms email
```

Email keeps working throughout. If the Vercel function is ever down, leads
still arrive at `fikirfoods8@gmail.com` — the fallback is automatic.

---

## Part 1 — The bot token (5 minutes)

> **A bot for this project already exists.** Its token was found in plaintext
> inside `.claude/settings.local.json`, saved into a shell-command allowlist by
> an earlier session. That file is gitignored and the token was never committed
> — confirmed against every commit in the repository — so nothing leaked to
> GitHub. But a token sitting in a settings file should be treated as spent.
> **Revoke it rather than reuse it**, which also saves creating a second bot:
>
> 1. Open **@BotFather** → `/revoke` → pick the existing bot
> 2. It issues a fresh token and the old one stops working immediately
> 3. Use the new token in Part 3, and delete the stale `Bash(curl ...telegram...)`
>    entries from `.claude/settings.local.json`
>
> Then skip to Part 2.

Creating one from scratch instead:

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Give it a name, e.g. `Fikir Leads`
4. Give it a username ending in `bot`, e.g. `fikir_leads_bot`
5. BotFather replies with a token like `8123456789:AAH...`

**Keep that token private.** It is the password to the bot. Do not paste it
into chat, email, or a commit — you will type it straight into Vercel later.

## Part 2 — Get the chat ID

Where should the alerts land?

**To a group (recommended — the whole sales team sees leads):**
1. Create a Telegram group, e.g. "Fikir Website Leads"
2. Add your bot to it as a member
3. Send any message in the group
4. Open this in a browser, replacing `<TOKEN>`:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Find `"chat":{"id":-1001234567890` — the ID **including the minus sign**

**To yourself only:**
1. Message your bot directly, say `hello`
2. Open the same `getUpdates` URL
3. The `"chat":{"id":123456789}` is yours (no minus sign)

## Part 3 — Deploy the function

1. Go to **https://vercel.com** and sign in with GitHub
2. **Add New → Project**
3. Import **FIKIR-FLOUR-Factory**
4. Do not change the build settings — `vercel.json` already configures this
   as API-only, so it will not publish a second copy of the website
5. Expand **Environment Variables** and add:

| Name | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | the token from Part 1 |
| `TELEGRAM_CHAT_ID` | the ID from Part 2 (keep any minus sign) |
| `ALLOWED_ORIGINS` | `https://fikirfoods.et,https://www.fikirfoods.et` |

6. **Deploy**
7. Copy the deployment URL, e.g. `https://fikir-flour-factory.vercel.app`

> `ALLOWED_ORIGINS` is not optional. The function rejects any request whose
> Origin is not on that list, and since the site now sits on a different
> domain than the API, `fikirfoods.et` must be named explicitly.

## Part 4 — Point the site at it

Send the developer the deployment URL. It goes into `.env.local` as:

```
VITE_LEAD_ENDPOINT=https://<your-deployment>.vercel.app/api/lead
```

Then rebuild and re-upload:

```bash
npm run deploy:build
```

Until this step is done the site keeps sending leads to email only — which
works fine. Nothing is broken in the meantime.

## Part 5 — Test

Submit the contact form on the live site. You should get:

- a **Telegram message** in the group, and
- **nothing** in the Gmail inbox

That second part is the point: email is the fallback, so a Telegram message
arriving means the primary path worked. If the email arrives instead, the
function was unreachable — check Part 4 and the Vercel logs.

---

## Optional: spam protection

The function supports Cloudflare Turnstile, an invisible captcha. Without it,
the built-in defences are a honeypot field and a rate limit of 5 submissions
per IP per 10 minutes — enough for a site this size.

To enable it:

1. **https://dash.cloudflare.com** → Turnstile → **Add site**
2. Domain `fikirfoods.et`, widget type **Invisible**
3. Add `TURNSTILE_SECRET_KEY` to the Vercel environment variables
4. Give the developer the **site key** for `VITE_TURNSTILE_SITE_KEY`

Both must be set together. A secret key on the server with no site key in the
build makes every submission fail the captcha check — though the email
fallback would still carry the lead through.

---

## Troubleshooting

**Leads arrive by email, never Telegram**
The function is unreachable or rejecting. Open Vercel → your project →
**Logs** and submit the form again. `origin_not_allowed` means
`ALLOWED_ORIGINS` is wrong or missing.

**"telegram_not_configured" in the logs**
`TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` is empty. Environment variables
only apply to deployments made *after* they are set — redeploy.

**"telegram_rejected"**
The chat ID is wrong, or the bot was never added to the group. For groups the
ID starts with `-100`. Re-check with `getUpdates`.

**Nothing arrives at all**
Then the email fallback failed too, which points at the browser rather than
Telegram. Check the browser console on the live site for a CORS error.

**Rotating the token**
`/revoke` in BotFather, then update `TELEGRAM_BOT_TOKEN` in Vercel and
redeploy. No website changes needed.
