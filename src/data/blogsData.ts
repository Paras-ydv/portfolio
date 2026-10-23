export interface Blog {
  title: string;
  date: string;
  claps: number;
  tags: string[];
  link: string;
  isExternal: boolean;
  slug?: string;
  description?: string;
  readingTime?: string;
  content?: BlogBlock[];
}

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | {
      type: "image";
      src: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
    }
  | { type: "list"; items: string[] }
  | {
      type: "links";
      items: { title: string; href: string; description: string }[];
    };

/**
 * External posts and published work. Set `isExternal: false` and add `slug` +
 * `content` to host a post on the site instead of linking out.
 *
 * `claps` is whatever the host platform counts as approval - Codeforces calls
 * it the blog's rating, which is its net upvotes.
 */
export const blogsData: Blog[] = [
  {
    title: "bits/stdc++.h, pb_ds and rope on macOS with one command",
    date: "Oct 23, 2026",
    claps: 14,
    tags: ["macOS", "C++", "pb_ds", "Tools"],
    link: "https://codeforces.com/blog/entry/158076",
    isExternal: true,
    description:
      "Why GCC-only competitive programming code fails under Apple Clang, and how cp-mac fixes the headers, the missing std functions and the 8 MB stack in one install.",
  },
];

export const blogPosts = blogsData.filter(
  (blog): blog is Blog & { slug: string; content: BlogBlock[] } =>
    typeof blog.slug === "string" && Array.isArray(blog.content),
);

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((blog) => blog.slug === slug);
}
