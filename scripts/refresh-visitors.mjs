#!/usr/bin/env node
/**
 * Rolls src/data/visitors-baseline.json forward.
 *
 *   node scripts/refresh-visitors.mjs
 *
 * Vercel's Hobby plan guarantees a one-month reporting window, so the running
 * total cannot live in the API indefinitely. It lives here instead: this script
 * folds everything the API still reports into the committed baseline and resets
 * the clock, so the next window starts from today.
 *
 * Run it at least once a month. Leave it longer than the reporting window and
 * the traffic between `asOf` and the window's start is gone for good.
 *
 * Needs VERCEL_ANALYTICS_TOKEN and VERCEL_PROJECT_ID in .env.local.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(root, "src/data/visitors-baseline.json");

const envPath = resolve(root, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const token = process.env.VERCEL_ANALYTICS_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
if (!token || !projectId) {
  console.error("Set VERCEL_ANALYTICS_TOKEN and VERCEL_PROJECT_ID in .env.local first.");
  process.exit(1);
}

const baseline = JSON.parse(readFileSync(OUT, "utf8"));
const now = new Date();

const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/count");
url.searchParams.set("projectId", projectId);
url.searchParams.set("since", String(Date.parse(baseline.asOf)));
url.searchParams.set("until", String(now.getTime()));

const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
if (!res.ok) {
  console.error(`Vercel Analytics returned HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const { data } = await res.json();
if (typeof data?.visitors !== "number" || typeof data?.pageviews !== "number") {
  console.error("Unexpected response shape:", JSON.stringify(data));
  process.exit(1);
}

const next = {
  ...baseline,
  asOf: now.toISOString(),
  visitors: baseline.visitors + data.visitors,
  pageviews: baseline.pageviews + data.pageviews,
};

writeFileSync(OUT, `${JSON.stringify(next, null, 2)}\n`);

const span = `${baseline.asOf.slice(0, 10)} -> ${next.asOf.slice(0, 10)}`;
console.log(`visitors  ${baseline.visitors} + ${data.visitors} = ${next.visitors}   (${span})`);
console.log(`pageviews ${baseline.pageviews} + ${data.pageviews} = ${next.pageviews}`);
