/**
 * Single source of truth for permanent (301) redirects.
 * Used by middleware (one hop, always to https://globalcareerhub.org) and by the
 * post renderer to rewrite old internal links inside article HTML.
 * Edge-safe: no Node APIs.
 */

export const CANONICAL_HOST = "globalcareerhub.org";

/** Old / broken post slugs → live destination path. */
export const LEGACY_POST_SLUGS: Record<string, string> = {
  "build-a-portfolio-employers-actually-open-in-2026":
    "/posts/build-a-portfolio-employers-actually-open",
  "remote-work-skills-that-still-pass-a-hiring-screen-in-2026":
    "/posts/remote-work-skills-that-still-show-up-on-hiring-screens",
  "ai-skills-path-pakistan-2026": "/posts/ai-skills-employers-want-in-2026",
  "ai-tools-freelance-without-coding": "/category/skills",
  "how-to-keep-a-job-search-from-eating-your-whole-life":
    "/posts/sunday-reset-long-job-search",
};

/** Exact legacy paths (common CMS / typo URLs) → live path. Keys are lowercase, no trailing slash. */
const EXACT: Record<string, string> = {
  "/index.html": "/",
  "/index.php": "/",
  "/home": "/",
  "/posts": "/articles",
  "/post": "/articles",
  "/blog": "/articles",
  "/article": "/articles",
  "/category": "/articles",
  "/categories": "/articles",
  "/tag": "/articles",
  "/about-us": "/about",
  "/author": "/about",
  "/contact-us": "/contact",
  "/privacy-policy": "/privacy",
  "/terms-and-conditions": "/terms",
  "/terms-of-service": "/terms",
  "/terms-of-use": "/terms",
  "/cookie-policy": "/cookies",
  "/cookies-policy": "/cookies",
  "/sitemap_index.xml": "/sitemap.xml",
  "/wp-sitemap.xml": "/sitemap.xml",
  "/post-sitemap.xml": "/sitemap.xml",
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Returns the canonical path for a request path, or null if it is already canonical.
 * Handles trailing slashes, legacy slugs, legacy CMS prefixes and uppercase slugs.
 */
export function canonicalPath(pathname: string): string | null {
  let p = pathname;
  // collapse duplicate slashes, drop trailing slash
  p = p.replace(/\/{2,}/g, "/");
  if (p.length > 1 && p.endsWith("/")) p = p.replace(/\/+$/, "") || "/";

  const lower = p.toLowerCase();
  const parts = lower.split("/").filter(Boolean);

  if (EXACT[lower]) {
    p = EXACT[lower];
  } else if (parts.length === 2 && ["post", "blog", "article", "articles", "posts"].includes(parts[0])) {
    // /post/x, /blog/x, /article/x, /articles/x, /posts/X → /posts/x
    const slug = parts[1];
    p = LEGACY_POST_SLUGS[slug] || `/posts/${slug}`;
  } else if (parts.length === 2 && parts[0] === "category") {
    p = `/category/${parts[1]}`;
  } else if (parts[0] === "page" || parts[0] === "tag" || parts[0] === "author") {
    // /page/2, /tag/x, /author/x (old CMS archives)
    p = parts[0] === "author" ? "/about" : "/articles";
  }

  return p !== pathname ? p : null;
}

/** Rewrite href="…/posts/<legacy-slug>" links inside stored article HTML (render-time only). */
export function rewriteLegacyLinks(htmlContent: string): string {
  return htmlContent.replace(
    /href=(["'])(?:https?:\/\/(?:www\.)?globalcareerhub\.org)?\/posts\/([^"'#?\/]+)\/?([#?][^"']*)?\1/gi,
    (match, q: string, slug: string, rest?: string) => {
      const target = LEGACY_POST_SLUGS[slug.toLowerCase()];
      if (!target) return match;
      return `href=${q}${target}${rest && target.startsWith("/posts/") ? rest : ""}${q}`;
    }
  );
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length <= 280;
}
