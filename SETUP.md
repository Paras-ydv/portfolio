# Setup guide

How to turn this fork into your own portfolio. Written to be followed by a
person or handed to a coding agent along with a resume.

> **Agent instructions:** read the owner's resume first, then work through the
> steps below in order. Every file named here is typed — run `npm run typecheck`
> after each one and fix errors before moving on. Do not edit components to
> change content; all content is data. If the resume lacks something a section
> needs, leave that section's array empty rather than inventing entries — empty
> arrays render an empty state, invented facts do not survive an interview.

## 1. Identity — `portfolio.config.ts`

One file, every personal detail. Start here; most of the site follows from it.

| Field | Used by |
|---|---|
| `name` | hero, page titles, OG tags, hover cards |
| `tagline`, `description` | meta description, OG/Twitter cards |
| `location`, `timeZone`, `utcOffset` | hero subtitle, banner clock, hover cards |
| `url` | `metadataBase`, sitemap, robots.txt |
| `handles.*` | every profile link **and** the stats fetchers |
| `email`, `resume`, `bookingLink` | contact buttons, contact form |
| `bios.*` | social hover cards |
| `followers.*` | X/LinkedIn counts — see note below |

`handles` are **usernames, not URLs**. The code builds the links and the
fetchers query those accounts directly, so a wrong handle shows wrong stats.

## 2. Content — `src/data/`

| File | Export | Holds |
|---|---|---|
| `experienceData.ts` | `experiences` | Roles, newest first. `type` is the arrangement (Remote/Hybrid/On-site), `links` are certificates or published work. |
| `projectsData.ts` | `projectsData` | Project cards and `/projects/[slug]` detail pages. |
| `skillsData.ts` | `skillGroups` | Skills grouped by category. Mirror your resume's grouping. |
| `educationData.ts` | `education`, `certifications` | Degrees and certificates. `link` renders a "Verify" link. |
| `hackathonsData.ts` | `hackathonsData` | Hackathons and placements. |
| `highlightsData.ts` | `highlightsData` | Proof screenshots. Each needs a real image — see below. |
| `blogsData.ts` | `blogsData` | Posts. External links need no `slug`; written posts need `slug` + `content`. |
| `anime.json` | — | Optional watchlist. Covers go in `public/anime/`. |
| `music.json` | `scenes`, `nowPlaying`, `albums` | Optional music section. `scenes` are the artist chips, `nowPlaying` is the embedded Spotify track, `albums` is the cover shelf — run `npm run refresh-music` after editing it. |
| `stats-snapshot.json` | — | Fallback stats. Regenerate with `npm run refresh-stats`, do not hand-edit. |

**Array order is display order** everywhere. Reordering a section means moving
blocks in the file; no code changes.

## 3. Images — `public/`

| Directory | For |
|---|---|
| `Experience-image/` | Company logos, square. Logos that are their own coloured tile should set `imageBleed: true`. |
| `project-image/` | Project screenshots. **Use 1.6 aspect (e.g. 1280×800)** — the card frame is 1.6, so other ratios get cropped. |
| `highlights/` | Achievement screenshots. |
| `anime/`, `music/`, `blog-images/` | Covers for the optional sections. |

Replace `public/Resume_Paras.pdf` with your own and update `resume` in the
config. Swap `banner-light.jpg` / `banner-dark.jpg` for the header artwork.

**Rename files when you replace them.** Next's image optimiser caches by path,
so reusing a filename serves the old picture long after the file changed.

## 4. Things that cannot be fetched

- **X and LinkedIn follower counts.** X retired its public endpoint and
  LinkedIn returns HTTP 999 to unauthenticated requests. Put real numbers in
  `followers` to show them, or leave `null` to show no stat row. They will not
  self-update.
- **LinkedIn bio.** Same reason — `bios.linkedin` is read from the config.

## 4b. Getting indexed

The sitemap and `robots.txt` generate themselves, but nothing tells Google the
site exists until you ask.

1. Open [Google Search Console](https://search.google.com/search-console) and
   add a **URL prefix** property for your domain.
2. Choose the **HTML tag** method. Copy only the `content` token out of the tag
   it shows you.
3. Paste it into `googleSiteVerification` in `portfolio.config.ts`, then deploy.
   Leaving it empty emits no tag at all.
4. Back in Search Console, click **Verify**.
5. Go to **Sitemaps** and submit `sitemap.xml`.

Indexing takes days, not minutes. Use **URL Inspection → Request indexing** on
the homepage to nudge the first crawl.

## 5. Check it

```bash
npm run typecheck && npm run lint && npm run build
```

Then `npm run dev` and walk the page at 360px and 1440px in both themes. Things
worth looking at specifically: project screenshots are not cropped, no section
renders an empty state you did not intend, and every external link resolves.

## 6. Deploy

Import to Vercel. Add `GITHUB_TOKEN` for the live contribution graph, and set
`NEXT_PUBLIC_SITE_URL` (or `url` in the config) to your domain so canonical
URLs, the sitemap and OG tags point at the right host.

### Visitor count (optional)

The footer shows a visitor count read from Vercel Web Analytics, which
`<Analytics />` in `app/layout.tsx` has been feeding since your first deploy.
Without credentials the count is simply not rendered.

Add `VERCEL_ANALYTICS_TOKEN` (an access token from
<https://vercel.com/account/tokens>) to the project's environment variables.
`VERCEL_PROJECT_ID` is a Vercel system variable, so it is already set in
production - but not locally, so put both in `.env.local` to see the count in
`next dev` and to run the refresh script.

Hobby accounts only retain one month of analytics, so the running total is kept
in `src/data/visitors-baseline.json`. Run `npm run refresh-visitors` **at least
once a month** and commit the result; it folds the last window into the
baseline and resets the clock. Skip it for longer than a month and the traffic
in between is lost.
