/**
 * Writes public/sitemap.xml.
 *
 * Runs as part of the build so the file always matches the routes that exist.
 * Only real, linkable routes go in — no 404 route, no query-string variants,
 * since ?cat= views are the same page and would look like duplicate content.
 */
import fs from "node:fs";
import path from "node:path";

const ORIGIN = "https://fikirfoods.et";

const ROUTES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/products", priority: "0.9", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/facility", priority: "0.7", changefreq: "monthly" },
  { path: "/gallery", priority: "0.6", changefreq: "monthly" },
  { path: "/careers", priority: "0.6", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
];

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) => `  <url>
    <loc>${ORIGIN}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
).join("\n")}
</urlset>
`;

const out = path.join("public", "sitemap.xml");
fs.writeFileSync(out, xml);
console.log(`sitemap: ${ROUTES.length} routes -> ${out}`);
