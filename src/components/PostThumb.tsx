import SafeImg from "@/components/SafeImg";
import { coverAlt, coverForCategory, postCover, resolveCover } from "@/lib/covers";
import { coverSrcSet } from "@/lib/coverSrcset";

type PostLike = {
  slug?: string | null;
  featured_image?: string | null;
  category_slug?: string | null;
  category_name?: string | null;
};

/**
 * Server component: the cover is resolved on the server so the HTML always
 * contains a working image URL (no JS needed). Branded per-post covers (committed
 * in public/covers/posts) render as a plain responsive <img srcset> with no client
 * JS; other URLs go through SafeImg for its client-side onError fallback.
 */
export default function PostThumb({
  post,
  className,
  alt = "",
  width,
  height,
  priority = false,
  sizes,
}: {
  post: PostLike;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /** CSS `sizes` for the responsive srcset (see COVER_SIZES in lib/coverSrcset). */
  sizes?: string;
}) {
  const src = resolveCover(post.featured_image, post.category_slug, post.slug);
  const fallback = coverForCategory(post.category_slug);
  // Branded per-post covers carry descriptive alt text; otherwise the post title.
  const altText = alt && postCover(post.slug) ? coverAlt(post.slug, alt) : alt;
  const cls = className || "h-full w-full object-cover object-center";
  const responsive = coverSrcSet(src);

  if (responsive) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={responsive.src}
        srcSet={responsive.srcSet}
        sizes={sizes || (width ? `(max-width: 640px) 100vw, ${width}px` : "100vw")}
        alt={altText}
        width={width}
        height={height}
        className={cls}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? undefined : "async"}
      />
    );
  }

  return (
    <SafeImg
      src={src}
      fallback={fallback}
      alt={altText}
      width={width}
      height={height}
      priority={priority}
      className={cls}
    />
  );
}
