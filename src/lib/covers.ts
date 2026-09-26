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

export function coverForCategory(slug?: string | null): string {
  if (!slug) return DEFAULT_COVER;
  return COVERS[slug.toLowerCase()] || DEFAULT_COVER;
}

/**
 * Hostinger wipes public/uploads on every deploy.
 * Until a file is known to live in MySQL blob, prefer permanent covers for /uploads/ paths
 * so cards, OG, and post heroes never show broken images.
 *
 * Set USE_UPLOAD_IMAGES=1 in env after confirming /api/media serves blobs correctly.
 */
export function resolveCover(
  featuredImage?: string | null,
  categorySlug?: string | null
): string {
  if (!featuredImage) return coverForCategory(categorySlug);

  // External CDN / our covers / absolute non-upload URLs
  if (
    featuredImage.startsWith("/covers/") ||
    (featuredImage.startsWith("http") && !featuredImage.includes("/uploads/"))
  ) {
    return featuredImage;
  }

  const allowUploads = process.env.USE_UPLOAD_IMAGES === "1";
  if (allowUploads) {
    // Prefer relative path for same-origin rewrite
    try {
      if (featuredImage.startsWith("http")) {
        const u = new URL(featuredImage);
        if (u.pathname.startsWith("/uploads/")) return u.pathname;
      }
    } catch {
      /* keep */
    }
    return featuredImage;
  }

  // Default: show permanent cover instead of 404 upload path
  return coverForCategory(categorySlug);
}
