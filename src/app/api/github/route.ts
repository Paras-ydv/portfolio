import { NextResponse } from "next/server";
import { portfolio } from "~/portfolio.config";

/**
 * Contribution calendar for the homepage graph.
 *
 * This route used to take a GraphQL query string from the request body and
 * forward it to GitHub verbatim, signed with GITHUB_TOKEN. That made it an open
 * proxy: anyone could POST any query - or any mutation, which GitHub serves from
 * the same endpoint - and have it executed as the token's owner, from the
 * internet, unauthenticated.
 *
 * The query was never dynamic. It is built here now, from config, and the
 * request body is ignored entirely. Keep it that way: nothing a caller sends may
 * reach GitHub.
 */

const CONTRIBUTIONS_QUERY = `
  query Contributions($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          months { name }
          weeks { contributionDays { contributionCount date } }
        }
      }
    }
  }
`;

/** The graph moves at most once a day; an hour is plenty and keeps us far from the rate limit. */
const REVALIDATE = 3600;

export async function POST() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GitHub is not configured" }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: portfolio.handles.github },
      }),
      next: { revalidate: REVALIDATE },
    });

    if (!response.ok) throw new Error(`github http ${response.status}`);

    const json = await response.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) throw new Error("no contribution calendar in response");

    // Only the calendar goes back to the browser. Returning the raw payload
    // would hand GitHub's error objects - and whatever they mention - to callers.
    return NextResponse.json({ calendar });
  } catch (error) {
    console.error("[github] contribution fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: 502 });
  }
}
