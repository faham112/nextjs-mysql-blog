import SafeImg from "@/components/SafeImg";
import { coverForCategory, resolveCover } from "@/lib/covers";

type PostLike = {
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
}: {
  post: PostLike;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}) {
  const src = resolveCover(post.featured_image, post.category_slug);
  const fallback = coverForCategory(post.category_slug);

  return (
    <SafeImg
      src={src}
      fallback={fallback}
      alt={alt}
      width={width}
      height={height}
      className={className || "h-full w-full object-cover object-center"}
    />
  );
}
