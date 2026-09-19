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

export default function PostFeatured({ post }: { post: PostRow }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl">
        {post.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featured_image}
            alt={post.title}
            className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            width={800}
            height={500}
            loading="eager"
          />
        ) : (
          <div className="flex aspect-[16/10] w-full items-end bg-gradient-to-br from-brand-600 via-red-700 to-dark-900 p-6">
            <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {post.category_name || "Guide"}
            </span>
          </div>
        )}
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
