import Link from "next/link";
import type { PostRow } from "@/lib/posts";
import PostThumb from "@/components/PostThumb";
import { COVER_SIZES } from "@/lib/coverSrcset";

function formatDate(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PostRowCompact({ post }: { post: PostRow }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex gap-3 border-b py-3 last:border-b-0"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="aspect-[1200/630] w-28 shrink-0 self-start overflow-hidden rounded-lg bg-[var(--bg2)] sm:w-36">
        <PostThumb
          post={post}
          alt={post.title}
          width={144}
          height={76}
          sizes={COVER_SIZES.thumb}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="line-clamp-2 text-sm font-bold leading-snug transition group-hover:text-brand-600 sm:text-base"
          style={{ color: "var(--fg)" }}
        >
          {post.title}
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {formatDate(post.published_at)}
        </p>
      </div>
    </Link>
  );
}
