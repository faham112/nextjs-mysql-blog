"use client";

import SafeImg from "@/components/SafeImg";
import { coverForCategory, resolveCover } from "@/lib/covers";

type PostLike = {
  featured_image?: string | null;
  category_slug?: string | null;
  category_name?: string | null;
};

export default function PostThumb({
  post,
  className,
}: {
  post: PostLike;
  className?: string;
}) {
  const src = resolveCover(post.featured_image, post.category_slug);
  const fallback = coverForCategory(post.category_slug);

  return (
    <SafeImg
      src={src}
      fallback={fallback}
      alt=""
      className={className || "h-full w-full object-cover object-center"}
    />
  );
}
