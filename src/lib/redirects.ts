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
  "/feed": "/rss.xml",
  "/rss": "/rss.xml",
  "/feed.xml": "/rss.xml",
  "/atom.xml": "/rss.xml",
  "/jobs": "/category/careers",
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

  const [first, second] = parts;

  if (EXACT[lower]) {
    p = EXACT[lower];
  } else if (parts.length >= 2 && parts[parts.length - 1] === "feed") {
    // WordPress feeds: /category/x/feed, /posts/x/feed, /comments/feed → RSS
    p = "/rss.xml";
  } else if (first === "job-category" || first === "job" || first === "jobs" || first === "job-type" || first === "job-location") {
    // Old job-board (WP Job Manager) URLs → careers guides
    p = "/category/careers";
  } else if (parts.length === 2 && ["post", "blog", "article", "articles", "posts"].includes(first)) {
    // /post/x, /blog/x, /article/x, /articles/x, /posts/X → /posts/x
    p = LEGACY_POST_SLUGS[second] || `/posts/${second}`;
  } else if (first === "category" && second) {
    // /category/Skills, /category/x/page/2, /category/x/y → /category/x
    p = `/category/${second}`;
  } else if (first === "page" || first === "tag" || first === "author") {
    // /page/2, /tag/x, /author/x (old CMS archives)
    p = first === "author" ? "/about" : "/articles";
  } else if (parts.length === 2 && second === "amp") {
    // /<slug>/amp (old AMP permalinks) → /<slug> (root fallback resolves posts)
    p = `/${first}`;
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

/** Old WordPress system paths: answer 410 Gone so Google drops them quickly. */
export function isGonePath(pathname: string): boolean {
  const l = pathname.toLowerCase();
  return (
    l.startsWith("/wp-admin") ||
    l.startsWith("/wp-content") ||
    l.startsWith("/wp-includes") ||
    l.startsWith("/wp-json") ||
    l === "/wp-login.php" ||
    l === "/xmlrpc.php" ||
    l === "/wp-cron.php"
  );
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length <= 280;
}
