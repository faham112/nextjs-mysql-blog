import { notFound, permanentRedirect } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/posts";
import { LEGACY_POST_SLUGS, isValidSlug } from "@/lib/redirects";

export const dynamic = "force-dynamic";

/**
 * Catch-all for single-segment URLs that don't match a real page, e.g. old
 * WordPress-style permalinks (/my-post-slug). If a published post has that slug,
 * 301 to /posts/<slug>; otherwise a normal 404.
 */
export default async function RootSlugFallback({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw || "").toLowerCase();
  if (!isValidSlug(slug)) notFound();
  if (LEGACY_POST_SLUGS[slug]) permanentRedirect(LEGACY_POST_SLUGS[slug]);
  const post = await getPublishedPostBySlug(slug).catch(() => null);
  if (!post) notFound();
  permanentRedirect(`/posts/${post.slug}`);
}
