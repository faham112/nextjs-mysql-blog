import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";

  // /search intentionally excluded (noindex thin page)
  const staticRoutes = [
    "",
    "/articles",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/disclaimer",
    "/cookies",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let posts: { slug: string; updated_at: Date | string }[] = [];
  let categories: { slug: string }[] = [];
  try {
    posts = (await listPublishedPosts(1, 200)).posts;
  } catch {}
  try {
    categories = await listCategories();
  } catch {}

  return [
    ...staticRoutes,
    ...categories.map((c) => ({
      url: `${base}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${base}/posts/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
