export type Highlight = {
  id: string;
  title: string;
  badge: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageFit?: "cover" | "contain";
  cardWidth?: number;
  link?: string;
};

/**
 * Real proof, each linked to the post announcing it. Entries without an image
 * render as the blueprint-grid placeholder card, so adding one is optional.
 */
export const highlightsData: Highlight[] = [
  {
    id: "gsoc-2026-completed",
    title: "Completed Google Summer of Code 2026 with the International Catrobat Association",
    badge: "GSoC 2026",
    image: "/highlights/gsoc-certificate.webp",
    imageWidth: 1200,
    imageHeight: 924,
    imageFit: "contain",
    cardWidth: 300,
  },
  {
    id: "gsoc-2026",
    title: "Selected for Google Summer of Code 2026 with the International Catrobat Association",
    badge: "GSoC 2026",
    image: "/highlights/gsoc-letter.webp",
    imageWidth: 1200,
    imageHeight: 1492,
    imageFit: "contain",
    cardWidth: 200,
    link: "https://lnkd.in/p/gKrFtq7E",
  },
  {
    id: "hacktoberfest-2026-speaker",
    title: "Speaker and judge at Hacktoberfest 2026 - 600+ students, 250+ teams",
    badge: "Hacktoberfest 2026",
    image: "/highlights/hacktoberfest-2026-panel.webp",
    imageWidth: 740,
    imageHeight: 487,
    imageFit: "cover",
    cardWidth: 300,
    link: "https://www.linkedin.com/posts/parascodes_hacktoberfest2026-opensource-developercommunity-ugcPost-7528916724457574400-Q79S/",
  },
  {
    id: "databricks-hackathon",
    title: "Finalist at the Databricks Campus Hackathon - top 10 of 700+ teams",
    badge: "Databricks",
    image: "/highlights/databricks-hackathon.webp",
    imageWidth: 800,
    imageHeight: 533,
    imageFit: "cover",
    cardWidth: 300,
    link: "https://lnkd.in/p/gytyPAvj",
  },
  {
    id: "sih-2025",
    title: "Shortlisted for the Smart India Hackathon 2025 Grand Finale",
    badge: "SIH 2025",
    image: "/highlights/sih-finalist.webp",
    imageWidth: 539,
    imageHeight: 651,
    imageFit: "contain",
    cardWidth: 205,
    link: "https://lnkd.in/p/gbW-3NDm",
  },
  {
    id: "leetcode-knight",
    title: "Reached LeetCode Knight - top 5.72%",
    badge: "LeetCode",
    image: "/highlights/leetcode-knight.webp",
    imageWidth: 1400,
    imageHeight: 522,
    imageFit: "cover",
    cardWidth: 330,
    link: "https://lnkd.in/p/gsfFB_GU",
  },
  {
    id: "leetcode-tshirt",
    title: "LeetCode sent the shirt",
    badge: "LeetCode",
    image: "/highlights/leetcode-tshirt.webp",
    imageWidth: 480,
    imageHeight: 637,
    imageFit: "cover",
    cardWidth: 195,
    link: "https://lnkd.in/p/gQrD2X6q",
  },
  {
    id: "hacktoberfest",
    title: "Completed Hacktoberfest and received the shirt",
    badge: "Hacktoberfest",
    image: "/highlights/hacktoberfest-tshirt.webp",
    imageWidth: 800,
    imageHeight: 600,
    imageFit: "cover",
    cardWidth: 270,
    link: "https://lnkd.in/p/g9FaJZvx",
  },
];
