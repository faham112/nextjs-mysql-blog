import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";

  // Core pages — optimized for Google Search Console submission
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  let posts: {
    slug: string;
    updated_at: Date | string;
    published_at?: Date | string | null;
  }[] = [];
  let categories: { slug: string }[] = [];

  try {
    posts = (await listPublishedPosts(1, 500)).posts;
  } catch {}
  try {
    categories = await listCategories();
  } catch {}

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
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
