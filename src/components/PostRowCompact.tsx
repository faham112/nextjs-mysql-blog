import Link from "next/link";
import type { PostRow } from "@/lib/posts";

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
      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28">
        {post.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featured_image}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-105"
            width={112}
            height={80}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600 to-dark-900 text-[10px] font-bold uppercase text-white">
            {(post.category_name || "GCH").slice(0, 8)}
          </div>
        )}
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
