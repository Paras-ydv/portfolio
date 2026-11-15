import baseline from "@/data/visitors-baseline.json";
import { requestTimeout, withFallback } from "./shared";

/**
 * Traffic to this site, read from Vercel Web Analytics - the same `<Analytics />`
 * that has been in `app/layout.tsx` since the site went up, so the history
 * already exists and nothing new has to start counting from zero.
 *
 * Server-only: the token must never reach the browser. This module is imported
 * by `app/page.tsx`, a server component, and by nothing else.
 */
export type VisitorMetrics = {
  visitors: number;
  pageviews: number;
  /** No credentials configured, or the upstream failed - render the baseline. */
  stale: boolean;
};

/** Hourly. A visit counter that lags an hour is indistinguishable from a live one. */
const REVALIDATE = 3600;

const COUNT_URL = "https://api.vercel.com/v1/query/web-analytics/visits/count";

/**
 * Vercel's Hobby plan guarantees a one-month reporting window, so an unbounded
 * `visits/count` stops being an all-time figure about a month from any given
 * day - and a visitor counter that ticks *down* is worse than none at all.
 *
 * So the total is a committed baseline plus everything since it. Splitting the
 * 2026-10-17..2026-11-15 window into four and summing the parts reproduced the
 * whole-window figures exactly, for `visitors` as well as `pageviews`, so
 * Vercel's visitor count behaves additively across adjacent windows and the
 * running total does not drift. Worth re-checking if the numbers ever look off.
 */
async function liveCounts(): Promise<Omit<VisitorMetrics, "stale">> {
  // VERCEL_PROJECT_ID is a Vercel system variable, already present in production
  // builds. It is deliberately not exposed to local dev, so .env.local needs it
  // too if you want the count under `next dev`.
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) throw new Error("VERCEL_ANALYTICS_TOKEN / VERCEL_PROJECT_ID not set");

  // `projectId` takes the project's name as well as its id.
  // teamId/slug are deliberately omitted: this is a personal-account project.
  // `since` and `until` must be sent together - `since` alone is a 400.
  //
  // `until` is snapped to the top of the hour rather than set to now. The URL is
  // the cache key, so a timestamp that moved every render would miss the cache
  // every time and call the API on every request; snapped, it is stable for
  // exactly one REVALIDATE window.
  const since = Date.parse(baseline.asOf);
  const window = REVALIDATE * 1000;
  const until = Math.floor(Date.now() / window) * window;

  // Snapping can land `until` before `since` for up to an hour after the
  // baseline is rolled forward, which the API rejects as an invalid range.
  // There is nothing to add over a window that has not started yet.
  if (until <= since) return { visitors: baseline.visitors, pageviews: baseline.pageviews };

  const url = new URL(COUNT_URL);
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("since", String(since));
  url.searchParams.set("until", String(until));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: REVALIDATE },
    signal: requestTimeout(),
  });
  if (!res.ok) throw new Error(`vercel analytics http ${res.status}`);

  const json = await res.json();
  const { visitors, pageviews } = json?.data ?? {};
  if (typeof visitors !== "number" || typeof pageviews !== "number") {
    throw new Error("vercel analytics returned no visitors/pageviews");
  }

  return {
    visitors: baseline.visitors + visitors,
    pageviews: baseline.pageviews + pageviews,
  };
}

export function getVisitors(): Promise<VisitorMetrics> {
  return withFallback<VisitorMetrics>("visitors", liveCounts, {
    visitors: baseline.visitors,
    pageviews: baseline.pageviews,
  });
}
