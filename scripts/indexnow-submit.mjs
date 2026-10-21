#!/usr/bin/env node
/**
 * IndexNow submitter for almostdebtfree.com (Goodbye Debt).
 *
 * IndexNow is the only indexing lever that works without Search Console access.
 * Bing, Yandex, Seznam and Naver share the submissions; Google does not
 * participate, so GSC stays the answer for Google.
 *
 * Prerequisite: the key file must be LIVE before the first submit, because
 * IndexNow re-fetches it to verify ownership:
 *   https://www.almostdebtfree.com/db12d87e03d68945f2c1953a4fc9550b.txt
 * It ships in public/, so it goes live with the next Vercel push of main.
 *
 * Usage (from the repo root):
 *   node scripts/indexnow-submit.mjs            # submits every URL in the live sitemap
 *   node scripts/indexnow-submit.mjs --dry-run  # prints the payload, sends nothing
 *   node scripts/indexnow-submit.mjs <url>...   # submits only the URLs given
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HOST = "www.almostdebtfree.com";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const here = path.dirname(fileURLToPath(import.meta.url));
const keyFile = path.join(here, "..", "public", "db12d87e03d68945f2c1953a4fc9550b.txt");

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const explicit = args.filter((a) => !a.startsWith("--"));

  const key = (await readFile(keyFile, "utf8")).trim();
  if (!key) throw new Error("IndexNow key file is empty");

  const urlList = explicit.length ? explicit : await sitemapUrls();
  for (const u of urlList) {
    if (!u.startsWith(`${ORIGIN}/`)) throw new Error(`URL is not on ${HOST}: ${u}`);
  }

  const payload = {
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${key}.txt`,
    urlList,
  };

  console.log(`IndexNow: ${urlList.length} URL(s), key ${key.slice(0, 8)}..., keyLocation ${payload.keyLocation}`);
  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  // 200 = accepted, 202 = accepted but key verification pending.
  console.log(`IndexNow response: ${res.status} ${res.statusText}${body ? ` :: ${body}` : ""}`);
  if (res.status !== 200 && res.status !== 202) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`IndexNow submit failed: ${err.message}`);
  process.exitCode = 1;
});