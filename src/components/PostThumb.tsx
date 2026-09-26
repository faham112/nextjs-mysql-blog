"use client";

import SafeImg from "@/components/SafeImg";

type PostLike = {
  featured_image?: string | null;
};

export default function PostThumb({
  post,
  className,
}: {
  post: PostLike;
  className?: string;
}) {
  if (post.featured_image) {
    return (
      <SafeImg
        src={post.featured_image}
        alt=""
        className={className || "h-full w-full object-cover object-center"}
      />
    );
  }
  return (
    <div
      className={`${className || "h-full w-full"} bg-gradient-to-br from-slate-700 via-slate-800 to-rose-900`}
    />
  );
}
