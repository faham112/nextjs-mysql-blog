import Link from "next/link";
import type { PostRow } from "@/lib/posts";
import PostThumb from "@/components/PostThumb";

function formatDate(value: Date | string | null) {
  if (!value) return "";
  return new Date(value)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

function readTime(post: PostRow) {
  const text = `${post.excerpt || ""} ${post.content || ""}`.replace(
    /<[^>]+>/g,
    " "
  );
  const minutes = Math.max(
    1,
    Math.round(text.split(/\s+/).filter(Boolean).length / 200)
  );
  return `${minutes} min read`;
}

export default function PostCard({ post }: { post: PostRow }) {
  const category = post.category_name || "Guide";
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:shadow-xl">
      <Link href={`/posts/${post.slug}`} className="flex h-full flex-col">
        <PostThumb
          post={post}
          alt={post.title}
          width={640}
          height={208}
          className="h-52 w-full object-cover"
        />
        <div className="flex flex-grow flex-col p-6">
          <div
            className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span className="rounded-full bg-brand-600/10 px-2.5 py-1 font-bold uppercase tracking-wider text-brand-600">
              {category}
            </span>
            <span>{formatDate(post.published_at)}</span>
            <span>{readTime(post)}</span>
          </div>
          <h3
            className="mb-3 font-heading text-xl font-bold leading-snug group-hover:text-brand-600"
            style={{ color: "var(--fg)" }}
          >
            {post.title}
          </h3>
          <p
            className="mb-6 line-clamp-3 text-sm"
            style={{ color: "var(--muted)" }}
          >
            {post.excerpt || "Read this guide on Global Career Hub."}
          </p>
          <div
            className="mt-auto flex items-center justify-between border-t pt-4 text-xs"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="font-bold" style={{ color: "var(--fg)" }}>
              {post.author_name ? `By ${post.author_name}` : "Read"}
            </span>
            <span className="font-bold text-brand-600">Read article →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
