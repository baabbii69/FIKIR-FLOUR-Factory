/**
 * Renders each route to static HTML after the Vite build.
 *
 * Why this exists: the site is a client-rendered SPA, so the HTML Google first
 * downloads has a correct <head> and a completely empty <body>. Google can run
 * JavaScript, but it does so on a second pass that is slow and unreliable for a
 * domain with no history — which is why every inner page sat at "Discovered,
 * currently not indexed" while only the home page ranked. Sitelinks are built
 * from indexed inner pages, so they were unreachable too.
 *
 * The approach is a post-build crawl in a real browser rather than server-side
 * rendering. SSR would mean making GSAP, ScrollTrigger, Lenis and the WebGL
 * capability probe all safe to execute without a DOM — a large, risky
 * refactor of working code. Driving the real app in a real browser needs no
 * source changes and captures exactly what a visitor sees.
 *
 * Two details make the output usable rather than merely present:
 *
 *  - Reduced motion is emulated. `Reveal` starts at opacity 0 and animates on
 *    scroll, so a naive capture freezes most of the page invisible. Under
 *    reduced motion it renders static, which is also what a crawler should get.
 *
 *  - Each route is written to `dist/<route>/index.html`. Apache's existing
 *    rule serves real files and directories before the SPA fallback, so these
 *    are picked up with no .htaccess change. React then boots and takes over
 *    exactly as before; the markup it produces matches what was captured.
 *
 *   npx tsx scripts/prerender.ts
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const DIST = "dist";
const PORT = 4321;

/** Routes come from the sitemap so the two can never disagree. */
function routes(): string[] {
  const xml = fs.readFileSync(path.join("public", "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .map((p) => (p === "/" ? "/" : p.replace(/\/$/, "")));
}

/** Prefer an installed browser; downloading Chromium for a build step is waste. */
function findBrowser(): string {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  const found = candidates.find((c) => c && fs.existsSync(c));
  if (!found) {
    throw new Error(
      "No Chrome or Edge found. Set CHROME_PATH to a browser executable."
    );
  }
  return found;
}

const MIME: Record<string, string> = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".mp4": "video/mp4",
  ".xml": "application/xml", ".txt": "text/plain",
};

/** Static server over dist, with the SPA fallback the real host provides. */
function serve(): Promise<http.Server> {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let file = path.join(DIST, url);
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const asIndex = path.join(file, "index.html");
      file = fs.existsSync(asIndex) ? asIndex : path.join(DIST, "index.html");
    }
    try {
      const body = fs.readFileSync(file);
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const server = await serve();
const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let written = 0;
let failed = 0;

try {
  for (const route of routes()) {
    const page = await browser.newPage();
    // Static output should not be frozen mid-animation, and a crawler has no
    // business being shown motion either.
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.setViewport({ width: 1440, height: 900 });

    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle2",
        timeout: 45_000,
      });
      // The boot splash covers the page for its first ~650ms; capturing before
      // it clears would save the splash instead of the content.
      await page.waitForFunction(
        () => {
          const root = document.getElementById("root");
          return !!root && root.innerText.trim().length > 400;
        },
        { timeout: 30_000 }
      );

      const html = await page.content();
      const outDir = route === "/" ? DIST : path.join(DIST, route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");

      const text = await page.evaluate(() => document.getElementById("root")?.innerText.length ?? 0);
      const title = await page.title();
      console.log(`  ${route.padEnd(11)} ${String(text).padStart(6)} chars  ${title.slice(0, 52)}`);
      written++;
    } catch (e) {
      console.error(`  ${route.padEnd(11)} FAILED — ${(e as Error).message.split("\n")[0]}`);
      failed++;
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

console.log(
  failed === 0
    ? `\n${written} routes pre-rendered.`
    : `\n${written} written, ${failed} failed.`
);
process.exit(failed === 0 ? 0 : 1);
