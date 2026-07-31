import fs from "node:fs";
import path from "node:path";

/**
 * Recovers the English copy that currently lives inline in JSX.
 *
 * Components call `t("some.key", "The English string")`. Because each call site
 * carries both the key and the English, the whole English dictionary can be
 * rebuilt mechanically and joined to am.ts / om.ts by key — nothing has to be
 * retyped by hand.
 *
 * A regex is not good enough here: the strings contain apostrophes, escaped
 * quotes and newlines, and some keys are template literals. So this walks the
 * source and parses the two arguments properly.
 */

export type Extracted = Record<string, string>;

/** Reads a quoted JS string starting at `i` (which must be the opening quote). */
function readString(src: string, i: number): { value: string; next: number } | null {
  const quote = src[i];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;
  let out = "";
  let j = i + 1;
  while (j < src.length) {
    const ch = src[j];
    if (ch === "\\") {
      const esc = src[j + 1];
      out += esc === "n" ? "\n" : esc === "t" ? "\t" : esc;
      j += 2;
      continue;
    }
    if (ch === quote) return { value: out, next: j + 1 };
    // A template literal containing ${...} is a dynamic key — bail out.
    if (quote === "`" && ch === "$" && src[j + 1] === "{") return null;
    out += ch;
    j++;
  }
  return null;
}

function skipSpace(src: string, i: number) {
  while (i < src.length && /\s/.test(src[i])) i++;
  return i;
}

export function extractFromSource(src: string): Extracted {
  const found: Extracted = {};
  for (let i = 0; i < src.length; i++) {
    // Match a `t(` call that is not part of a longer identifier.
    if (src[i] !== "t" || src[i + 1] !== "(") continue;
    const prev = src[i - 1];
    if (prev && /[A-Za-z0-9_$.]/.test(prev)) continue;

    let j = skipSpace(src, i + 2);
    const key = readString(src, j);
    if (!key) continue;
    j = skipSpace(src, key.next);
    if (src[j] !== ",") continue;
    j = skipSpace(src, j + 1);
    const en = readString(src, j);
    if (!en) continue;

    // Collapse the wrapping/indentation that Prettier introduces in JSX.
    found[key.value] = en.value.replace(/\s*\n\s*/g, " ").trim();
  }
  return found;
}

export function extractAll(root = "src"): Extracted {
  const out: Extracted = {};
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(tsx|ts)$/.test(entry.name)) {
        Object.assign(out, extractFromSource(fs.readFileSync(p, "utf8")));
      }
    }
  };
  walk(root);
  return out;
}

// Run directly for a quick report.
if (process.argv[1]?.includes("extractEnglish")) {
  const all = extractAll();
  const keys = Object.keys(all).sort();
  console.log(`extracted ${keys.length} English strings`);
  for (const k of keys.slice(0, 12)) {
    const v = all[k];
    console.log(`  ${k.padEnd(28)} ${v.slice(0, 62)}${v.length > 62 ? "…" : ""}`);
  }
}
