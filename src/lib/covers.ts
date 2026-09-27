/** Permanent cover images committed in /public/covers — survive Hostinger redeploys. */

const COVERS: Record<string, string> = {
  applications: "/covers/applications.svg",
  careers: "/covers/careers.svg",
  scholarships: "/covers/scholarships.svg",
  skills: "/covers/skills.svg",
  "study-abroad": "/covers/study-abroad.svg",
  technology: "/covers/technology.svg",
  tutorials: "/covers/tutorials.svg",
  lifestyle: "/covers/lifestyle.svg",
};

export const DEFAULT_COVER = "/covers/default.svg";

const OWN_HOSTS = new Set(["globalcareerhub.org", "www.globalcareerhub.org"]);
/** Files from this repo's public/ dir (e.g. raw.githubusercontent links saved by the migrate tool). */
const REPO_RAW = /^https?:\/\/raw\.githubusercontent\.com\/faham112\/nextjs-mysql-blog\/[^/]+\/public(\/.+)$/i;

export function coverForCategory(slug?: string | null): string {
  if (!slug) return DEFAULT_COVER;
  return COVERS[slug.toLowerCase()] || DEFAULT_COVER;
}

/** Uploaded files live in public/uploads (gitignored) and are wiped on every deploy. */
function isEphemeralPath(pathname: string): boolean {
  return pathname.startsWith("/uploads/") || pathname.startsWith("/api/media/");
}

/**
 * Resolve the image to show for a post. Always returns a usable URL:
 *  - /covers/* (git-hosted, survive redeploys) are used as-is
 *  - raw.githubusercontent links to this repo's public/ are served locally
 *  - external https images are used as-is
 *  - /uploads/* and /api/media/* (wiped on every Hostinger deploy) fall back to the
 *    category cover unless USE_UPLOAD_IMAGES=1 (only set once uploads are persistent)
 *  - anything else falls back to the category cover
 */
export function resolveCover(
  featuredImage?: string | null,
  categorySlug?: string | null
): string {
  const fallback = coverForCategory(categorySlug);
  const raw = (featuredImage || "").trim();
  if (!raw) return fallback;

  const repoMatch = raw.match(REPO_RAW);
  if (repoMatch) {
    const local = repoMatch[1];
    return local.startsWith("/covers/") ? local : fallback;
  }

  let pathname = raw;
  if (/^https?:\/\//i.test(raw)) {
    let u: URL;
    try {
      u = new URL(raw);
    } catch {
      return fallback;
    }
    if (!OWN_HOSTS.has(u.hostname.toLowerCase())) {
      // External CDN image
      return u.protocol === "https:" ? raw : fallback;
    }
    pathname = u.pathname;
  } else if (!raw.startsWith("/") || raw.startsWith("//")) {
    return fallback;
  }

  if (pathname.startsWith("/covers/")) return pathname;

  if (isEphemeralPath(pathname) && process.env.USE_UPLOAD_IMAGES === "1") {
    return pathname;
  }

  return fallback;
}

/** Absolute URL for OG / JSON-LD. */
export function absoluteCover(
  featuredImage: string | null | undefined,
  categorySlug: string | null | undefined,
  siteUrl: string
): string {
  const src = resolveCover(featuredImage, categorySlug);
  return src.startsWith("http") ? src : `${siteUrl.replace(/\/$/, "")}${src}`;
}

/**
 * Social previews (Facebook, X, LinkedIn, WhatsApp) do not render SVG og:images.
 * Every /covers/<name>.svg has a 1200x630 PNG twin at /covers/og/<name>.png.
 */
export function ogCover(
  featuredImage: string | null | undefined,
  categorySlug: string | null | undefined,
  siteUrl: string
): string {
  const src = resolveCover(featuredImage, categorySlug);
  const m = src.match(/^\/covers\/([a-z0-9-]+)\.svg$/i);
  const path = m ? `/covers/og/${m[1]}.png` : src;
  return path.startsWith("http") ? path : `${siteUrl.replace(/\/$/, "")}${path}`;
}

export const DEFAULT_OG_IMAGE = "/covers/og/default.png";
