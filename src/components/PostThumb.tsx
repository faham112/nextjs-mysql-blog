import SafeImg from "@/components/SafeImg";
import { coverAlt, coverForCategory, postCover, resolveCover } from "@/lib/covers";

type PostLike = {
  slug?: string | null;
  featured_image?: string | null;
  category_slug?: string | null;
  category_name?: string | null;
};

/**
 * Server component: the cover is resolved on the server so the HTML always
 * contains a working image URL (no JS needed). SafeImg only adds a client-side
 * onError fallback for external URLs.
 */
export default function PostThumb({
  post,
  className,
  alt = "",
  width,
  height,
  priority = false,
}: {
  post: PostLike;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const src = resolveCover(post.featured_image, post.category_slug, post.slug);
  const fallback = coverForCategory(post.category_slug);
  // Branded per-post covers carry descriptive alt text; decorative thumbs keep alt="".
  const altText = alt && postCover(post.slug) ? coverAlt(post.slug, alt) : alt;

  return (
    <SafeImg
      src={src}
      fallback={fallback}
      alt={altText}
      width={width}
      height={height}
      priority={priority}
      className={className || "h-full w-full object-cover object-center"}
    />
  );
}
