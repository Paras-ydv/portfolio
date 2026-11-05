import { blogsData, type Blog } from "@/data/blogsData";
import { requestTimeout } from "./shared";

/** Live approval counts keyed by the post's `link`. */
export type BlogMetrics = { counts: Record<string, number>; stale: boolean };

/** Revalidate hourly: these move slowly and nobody refreshes a list for a +1. */
const REVALIDATE = 3600;

/**
 * Codeforces calls it the blog's rating - its net upvotes. Public, unauthenticated
 * and official.
 */
async function codeforcesRating(entryId: number): Promise<number> {
  const res = await fetch(`https://codeforces.com/api/blogEntry.view?blogEntryId=${entryId}`, {
    next: { revalidate: REVALIDATE },
    signal: requestTimeout(),
  });
  if (!res.ok) throw new Error(`codeforces http ${res.status}`);
  const json = await res.json();
  if (json.status !== "OK") throw new Error(`codeforces ${json.comment ?? "not OK"}`);
  const rating = json.result?.rating;
  if (typeof rating !== "number") throw new Error("codeforces returned no rating");
  return rating;
}

/**
 * X's own API needs a paid key - an unauthenticated call to api.x.com returns 401 -
 * so the like count comes from fxtwitter, an unofficial read-only mirror. That is a
 * third party on someone else's infrastructure, which is exactly why a failure here
 * falls back to the committed number instead of blanking the row.
 */
async function xLikes(handle: string, statusId: string): Promise<number> {
  const res = await fetch(`https://api.fxtwitter.com/${handle}/status/${statusId}`, {
    next: { revalidate: REVALIDATE },
    signal: requestTimeout(),
  });
  if (!res.ok) throw new Error(`fxtwitter http ${res.status}`);
  const json = await res.json();
  const likes = json?.tweet?.likes;
  if (typeof likes !== "number") throw new Error("fxtwitter returned no like count");
  return likes;
}

async function liveCount(blog: Blog): Promise<number | null> {
  if (!blog.live) return null;
  if (blog.live.source === "codeforces") return codeforcesRating(blog.live.entryId);
  return xLikes(blog.live.handle, blog.live.statusId);
}

/**
 * Live counts for every post that declares a source, falling back per post to the
 * number committed in `blogsData`. Resolved one by one rather than as a single
 * unit: one upstream being down should cost that row its freshness, not every row.
 */
export async function getBlogMetrics(): Promise<BlogMetrics> {
  const results = await Promise.all(
    blogsData.map(async (blog) => {
      try {
        const live = await liveCount(blog);
        return { link: blog.link, count: live ?? blog.claps, fresh: live !== null };
      } catch (error) {
        console.warn(`[stats] blog "${blog.title}" fell back to the committed count:`, error);
        return { link: blog.link, count: blog.claps, fresh: false };
      }
    }),
  );

  const wanted = blogsData.filter((b) => b.live).length;
  const got = results.filter((r) => r.fresh).length;

  return {
    counts: Object.fromEntries(results.map((r) => [r.link, r.count])),
    stale: got < wanted,
  };
}
