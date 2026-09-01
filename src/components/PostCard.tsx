import Link from "next/link";
import type { PostRow } from "@/lib/posts";

function formatDate(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post }: { post: PostRow }) {
  return (
    <article className="card overflow-hidden">
      {post.featured_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.featured_image} alt="" className="h-52 w-full object-cover" />
      ) : (
        <div className="h-52 w-full bg-gradient-to-br from-moss/80 to-accent/70" />
      )}
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-slate-500">
          {post.category_name && (
            <Link href={`/category/${post.category_slug}`} className="text-accent">
              {post.category_name}
            </Link>
          )}
          <span>{formatDate(post.published_at)}</span>
        </div>
        <h2 className="font-serif text-2xl leading-snug">
          <Link href={`/posts/${post.slug}`} className="hover:text-accent">
            {post.title}
          </Link>
        </h2>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
      </div>
    </article>
  );
}
