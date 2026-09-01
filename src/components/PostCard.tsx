import Link from "next/link";
import type { PostRow } from "@/lib/posts";
function formatDate(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase();
}
export default function PostCard({ post }: { post: PostRow }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:border-dark-800 hover:shadow-xl">
      <Link href={`/posts/${post.slug}`} className="flex h-full flex-col">
        {post.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.featured_image} alt="" className="h-52 w-full object-cover" />
        ) : (
          <div className="flex h-52 flex-col justify-between bg-gradient-to-br from-brand-600 via-red-700 to-dark-900 p-6">
            <span className="w-fit rounded-full border border-slate-700 bg-dark-900/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{post.category_name || "Guide"}</span>
            <p className="font-heading text-2xl font-extrabold text-white">{post.category_name || "Journal"}</p>
          </div>
        )}
        <div className="flex flex-grow flex-col p-6">
          <p className="mb-2 text-xs font-medium text-slate-500">{formatDate(post.published_at)}</p>
          <h3 className="mb-3 font-heading text-xl font-bold leading-snug group-hover:text-brand-600">{post.title}</h3>
          <p className="mb-6 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
            <span className="font-bold text-slate-800">By {post.author_name || "Abdul Faheem"}</span>
            <span className="font-bold text-brand-600">Read Article →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
