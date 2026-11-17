// Public pages rendered to static HTML at publish time so visitors get them instantly.
// Only list pages whose HTML is identical for every visitor (no session or per-user data).
import { readFileSync } from "node:fs";
import { BLOG_POSTS } from "./src/lib/blog-posts";
import { GOV_FORMS } from "./src/lib/gov-forms";

const PRIVATE = new Set(["/work/my", "/work/post-job", "/dashboard", "/admin", "/auth"]);

function read(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

export function prerenderPages(): { path: string }[] {
  const paths = new Set<string>();
  for (const m of read("./src/routes/sitemap[.]xml.ts").matchAll(/\{ path: "(\/[^"$]*)"/g)) {
    if (!PRIVATE.has(m[1])) paths.add(m[1]);
  }
  for (const m of read("./src/lib/utility-tools.ts").matchAll(/\{ slug: "([a-z0-9-]+)"/g)) {
    paths.add(`/tools/${m[1]}`);
  }
  for (const p of BLOG_POSTS) paths.add(`/blog/${p.slug}`);
  for (const f of GOV_FORMS) paths.add(`/gov/forms/${f.slug}`);
  return [...paths].map((path) => ({ path }));
}
