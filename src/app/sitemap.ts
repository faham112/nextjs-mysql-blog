import type { MetadataRoute } from "next";
import { listPublishedSitemapPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

// Rendered per request so a DB hiccup at build/revalidate time can't cache an empty sitemap.
export const dynamic = "force-dynamic";

/** Last edit of the static/legal pages. Bump when those pages change. */
const LEGAL_LM = new Date("2026-09-27T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";

  let posts: {
    slug: string;
    updated_at: Date | string;
    published_at?: Date | string | null;
  }[] = [];
  let categories: { slug: string }[] = [];

  // If the DB is down, fail (5xx, Google retries) instead of serving a sitemap without posts.
  posts = await listPublishedSitemapPosts(500);
  try {
    categories = await listCategories();
  } catch {}

  // lastmod: real dates only (a lastmod that changes on every request is ignored by Google)
  const latest = posts.reduce<number>((max, p) => {
    const t = new Date(p.updated_at || p.published_at || 0).getTime();
    return Number.isFinite(t) && t > max ? t : max;
  }, 0);
  const contentLM = latest ? new Date(latest) : LEGAL_LM;

  // Core pages — optimized for Google Search Console submission
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: contentLM,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/articles`,
      lastModified: contentLM,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: LEGAL_LM,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: LEGAL_LM,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      lastModified: LEGAL_LM,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: LEGAL_LM,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: LEGAL_LM,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/cookies`,
      lastModified: LEGAL_LM,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: contentLM,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/posts/${p.slug}`,
    lastModified: new Date(p.updated_at || p.published_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Order: home → articles → posts → categories → legal
  // /search intentionally excluded (noindex)
  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
