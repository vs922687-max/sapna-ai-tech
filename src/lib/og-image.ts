import type { BlogPost } from "./blog-posts";

export const SITE_URL = "https://bharataisathi.com";

/** Category → branded social preview image (1200×630, served from /public). */
const CATEGORY_OG: Record<BlogPost["category"], string> = {
  "Government Services": "/og-government.jpg",
  "Online Forms": "/og-government.jpg",
  "Digital India": "/og-government.jpg",
  "Artificial Intelligence": "/og-ai.jpg",
  Technology: "/og-ai.jpg",
  Productivity: "/og-ai.jpg",
  Education: "/og-default.jpg",
  "Cyber Security": "/og-default.jpg",
  Finance: "/og-default.jpg",
  Jobs: "/og-default.jpg",
};

/** Absolute OG image URL for a post — social crawlers require absolute URLs. */
export function ogImageForPost(post: Pick<BlogPost, "category">) {
  return `${SITE_URL}${CATEGORY_OG[post.category] ?? "/og-default.jpg"}`;
}

/** Relative, display-optimised (WebP) cover image for a post, with a 600px variant. */
export function coverImageForPost(post: Pick<BlogPost, "category">) {
  const base = (CATEGORY_OG[post.category] ?? "/og-default.jpg").replace(/\.jpg$/, "");
  return {
    src: `${base}.webp`,
    srcSet: `${base}-600.webp 600w, ${base}.webp 1200w`,
  };
}
