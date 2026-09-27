import Link from "next/link";
import type { PostRow } from "@/lib/posts";
import PostThumb from "@/components/PostThumb";

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

export default function PostFeatured({
  post,
  priority = false,
}: {
  post: PostRow;
  priority?: boolean;
}) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-[var(--bg2)]">
        <PostThumb
          post={post}
          alt={post.title}
          width={800}
          height={420}
          priority={priority}
          className="aspect-[1200/630] h-auto w-full object-cover object-center transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <h2
        className="mt-4 font-heading text-xl font-extrabold leading-snug transition group-hover:text-brand-600 sm:text-2xl"
        style={{ color: "var(--fg)" }}
      >
        {post.title}
      </h2>
      {post.excerpt ? (
        <p
          className="mt-2 line-clamp-2 text-sm"
          style={{ color: "var(--muted)" }}
        >
          {post.excerpt}
        </p>
      ) : null}
      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        {formatDate(post.published_at)}
        {post.category_name ? ` · ${post.category_name}` : ""}
      </p>
    </Link>
  );
}
