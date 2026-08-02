# Deploying to Plesk — step by step

For **fikirfoods.et** on Plesk Obsidian (ethiotelecom), panel at
`https://lin4.ethiotelecom.et:8443`. Written to be followed without prior
Plesk experience.

## Your setup, from the panel

| | |
|---|---|
| Domain | `fikirfoods.et` — Active |
| Web root | `httpdocs` |
| Server IP | 213.55.96.152 |
| System user | `fikirfoo` |
| SSL | **Domain not secured** — fixed in step 3.7 |
| Disk used | 0.6 MB (empty, nothing to back up) |

---

## ⛔ Two things only you can do

I hit both and they are permission-blocked for anyone but the project owner.
Do these first; the rest of the deploy depends on them.

### 1. Publish the Studio

```bash
cd studio
npx sanity login      # opens a browser — sign in with the Fikir account
npx sanity deploy
```

I tried this with the API token and got, verbatim:

```
✗ Forbidden - User is missing required grant sanity.project.deployStudio
```

Deploying needs the *Deploy Studio* grant, which the seeding token (Editor)
does not carry. Your own login has it. The hostname `fikirfoods` is already
pinned in `sanity.cli.ts`, and it is free — the deploy got as far as
"Creating https://fikirfoods.sanity.studio" before the permission check
stopped it. It will not prompt you.

Result: **https://fikirfoods.sanity.studio**

### 2. Allow the live domain to read content — do not skip this

Go to **https://www.sanity.io/manage/project/ntiaycof → API → CORS origins**
and add:

| Origin | Allow credentials |
|---|---|
| `https://fikirfoods.et` | **off** |
| `https://www.fikirfoods.et` | **off** |

Credentials stay **off**: the site only reads public content and never logs in.

**Why this is not optional.** I tested it:

```
BLOCKED  https://fikirfoods.et       (HTTP 403)
BLOCKED  https://www.fikirfoods.et   (HTTP 403)
allowed  http://localhost:5173
```

Without these entries the site still *loads* — the snapshot baked into the
bundle covers it — but the live refresh gets a 403 and dies silently. The
client would edit content, press Publish, and **see nothing change**, with no
error anywhere. That is the single worst failure mode for this project.

Check it any time with:

```bash
npm run check:cors
```

You want all three lines to say `allowed`.

---

## First, the question you asked: do we need `cms.fikirfoods.et`?

**No. You do not need it.**

`npx sanity deploy` gives you a complete, working, permanently hosted Studio at
`https://fikirfoods.sanity.studio` — free, HTTPS included, hosted by Sanity.
The client logs in and edits content. Nothing else is required. It is not a
trial, not a preview, not a stopgap.

A subdomain buys you exactly one thing: the address says `fikirfoods.et`
instead of `sanity.studio`. That is branding, not function.

| | Sanity-hosted | Your subdomain |
|---|---|---|
| Address | `fikirfoods.sanity.studio` | `cms.fikirfoods.et` |
| Setup | one command | DNS + subdomain + SSL + upload |
| Updating it later | `npx sanity deploy` | rebuild + re-upload every time |
| Cost | free | uses your hosting |
| Works identically | yes | yes |

**Recommendation: use the Sanity-hosted Studio.** It is less to maintain, and
it updates with one command instead of an FTP upload. Only move it to a
subdomain if the client specifically asks for their own domain.

If you do want the subdomain later, Part 4 covers it. Note it must be a
**subdomain**, never `fikirfoods.et/studio` — the main site's `.htaccess`
rewrites every unknown path to `index.html`, so it would swallow the Studio's
own routes and break it.

---

## Part 1 — Studio

Covered above under "Two things only you can do". Once `npx sanity deploy`
succeeds, send the client **https://fikirfoods.sanity.studio**.

### Confirm it works end to end
1. Open the Studio and log in.
2. **Pages → About page →** change **Caption for that photo**.
3. Click **Publish**.
4. Reload the live site — the caption changes. (Before the site is deployed,
   test against `npm run dev` instead.)

---

## Part 2 — Build the site for upload

```bash
cd ..                 # back to the project root
npm run deploy:build
```

That one command does four things:

1. **Snapshot** — pulls current content from Sanity into the bundle, so the
   site paints instantly and still works if Sanity is unreachable.
2. **Build** — typechecks and compiles into `dist/`.
3. **Prune** — deletes media from `dist/` that the CDN now serves. This takes
   the upload from **107 MB to 33 MB**. It never touches `public/`.
4. **Verify** — 30 checks that content, translations and images resolve.

You want to see, at the end:

```
All checks passed — the site is wired to Sanity.
```

If it does not say that, **stop and fix it before uploading.**

**Important:** re-run `npm run deploy:build` before *every* upload. The
snapshot is baked at build time, so an old build ships old content.

---

## Part 3 — Upload the site to Plesk

### 3.1 Log in
`https://lin4.ethiotelecom.et:8443`

### 3.2 Open the File Manager
Left sidebar → **Files**. (Or from **Websites & Domains**, expand
`fikirfoods.et` and click the **Files** tile.)

### 3.3 Go to the web root
Open the folder named **`httpdocs`**. This is what visitors see at
`https://fikirfoods.et`.

### 3.4 Clear the old site
Select everything inside `httpdocs` and delete it.

> If anything else lives there that you need, download a copy first. The
> `httpdocs` folder should end up empty.

### 3.5 Upload
On your machine, go into the **`dist`** folder and select **everything inside
it** — `index.html`, `assets`, `media`, the logo files, and `.htaccess`.

> ⚠️ Upload the **contents of `dist`**, not the `dist` folder itself. You want
> `httpdocs/index.html`, not `httpdocs/dist/index.html`.

Easiest reliable method:
1. Zip the contents of `dist` into `site.zip`.
2. In Plesk File Manager, click **Upload**, choose `site.zip`.
3. Click the file's dropdown → **Extract Archive**.
4. Delete `site.zip` afterwards.

### 3.6 Confirm `.htaccess` arrived — this one matters

`.htaccess` starts with a dot, so it is hidden by default and **easily lost**.
Without it, `fikirfoods.et` works but `fikirfoods.et/about` returns **404 on
refresh**.

In File Manager, turn on hidden files (**Settings** or the ⚙/eye icon →
"Show hidden files"). You should see `.htaccess` directly inside `httpdocs`.

If it is missing: create a file named `.htaccess` there and paste the contents
of `public/.htaccess` from the project.

### 3.7 Turn on HTTPS
1. **Websites & Domains → fikirfoods.et → SSL/TLS Certificates**
2. **Install a free basic certificate provided by Let's Encrypt**
3. Tick the domain and `www`, enter an email, click **Get it free**
4. Back on the domain screen, enable **Permanent SEO-safe 301 redirect from
   HTTP to HTTPS**

### 3.8 Test
- `https://fikirfoods.et` loads
- Click into **Products**, then press **F5** — it must reload, not 404.
  (If it 404s, `.htaccess` is missing or `mod_rewrite` is off — see 3.6.)
- Try `/about`, `/gallery`, `/careers`, `/contact` the same way
- Check on a phone
- Switch language to አማርኛ and confirm the text changes

---

## Part 4 — Optional: Studio on `cms.fikirfoods.et`

Only if the client wants the Studio on their own domain. Otherwise skip this;
`fikirfoods.sanity.studio` is already live and working.

### 4.1 Create the subdomain
**Websites & Domains → Add Subdomain** → name it `cms` → note its document root
(usually `cms.fikirfoods.et` or `httpdocs/cms`).

### 4.2 Build the Studio
```bash
cd studio
npx sanity build
```
Output lands in `studio/dist` (~7 MB).

### 4.3 Upload
Copy **everything inside `studio/dist`** into the subdomain's document root,
same zip-and-extract method as Part 3.

### 4.4 Add the Studio's `.htaccess`
The Studio is also a single-page app, so it needs its own rewrite rule.
Copy `studio/deploy/.htaccess` into the subdomain's root. Without it, refreshing
any inner Studio page 404s.

### 4.5 SSL
Issue a Let's Encrypt certificate for `cms.fikirfoods.et`, exactly as in 3.7.

### 4.6 Allow it in Sanity — required, or it will not load
**https://www.sanity.io/manage/project/ntiaycof → API → CORS origins → Add**

- Origin: `https://cms.fikirfoods.et`
- **Allow credentials: ON** (the Studio needs it to log in)

---

## Part 5 — Sanity settings to finish

At **https://www.sanity.io/manage/project/ntiaycof**

### 5.1 CORS origins
Under **API → CORS origins**, make sure these exist:

| Origin | Credentials | Why |
|---|---|---|
| `https://fikirfoods.et` | off | the live site reads content |
| `https://www.fikirfoods.et` | off | same, with www |
| `http://localhost:5173` | off | local development |
| `https://cms.fikirfoods.et` | **on** | only if you did Part 4 |

Credentials stay **off** for the website: it only reads public content and
sends no login. Only the Studio needs them on.

### 5.2 Delete the seeding token
**API → Tokens →** delete **"Data Import"**.

It has no expiry, can write to your content, and it has been shared in chat.
Seeding is finished and the website never needs it — the dataset is public-read,
so no secret ships to the browser.

### 5.3 Invite the client
**Members → Invite member** → their email → role **Editor**.

Editor lets them change content but not schema or project settings. Do not give
them Administrator.

---

## Everyday use, after launch

### The client changes text or a photo
They edit in the Studio and press **Publish**. **The live site updates within
seconds. No rebuild, no upload, nothing from you.**

### You change the design or code
```bash
npm run deploy:build
```
then re-upload `dist` (Part 3.5).

### Changing the film
In the Studio: **Pages → Home page → Company film section**.
Paste a **YouTube or Vimeo link** into **Full film URL** and Publish. That is
the easiest route and gives adaptive quality on slow connections — better than
a self-hosted MP4. No developer needed.

---

## If something goes wrong

**A sub-page 404s on refresh**
`.htaccess` is missing from `httpdocs`, or `mod_rewrite` is disabled. See 3.6.
To check the module, ask ethiotelecom support to confirm `mod_rewrite` is on.

**The site loads but content looks old**
The bundled snapshot is from the last build. Either the client has not pressed
**Publish**, or you uploaded an old `dist`. Run `npm run deploy:build` again.

**Images do not appear**
Check the browser console for CORS errors and confirm Part 5.1. Images come
from `cdn.sanity.io`, which needs no CORS entry — but the *content query* does.

**The Studio will not load on the subdomain**
Almost always the missing CORS origin with **credentials ON** (4.6), or the
missing `.htaccess` (4.4).

**Everything broke after an upload**
Re-run `npm run deploy:build`, confirm it prints "All checks passed", and
re-upload. The previous `dist` is safe to keep as a backup before overwriting.

---

## Quick reference

| Task | Command |
|---|---|
| Local development | `npm run dev` |
| Build for upload | `npm run deploy:build` |
| Check CMS health | `npm run cms:audit` |
| Check CORS is open | `npm run check:cors` |
| Verify wiring only | `npm run verify` |
| Publish the Studio | `cd studio && npx sanity deploy` |
| Re-seed content | `npm run seed` (needs the write token) |

| Thing | Where |
|---|---|
| Live site | https://fikirfoods.et |
| Studio | https://fikirfoods.sanity.studio |
| Project console | https://www.sanity.io/manage/project/ntiaycof |
| Web root on Plesk | `httpdocs` |
