import Link from "next/link";
import PostCard from "@/components/PostCard";
import { listPublishedPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw || 1));
  let posts: Awaited<ReturnType<typeof listPublishedPosts>>["posts"] = [];
  let total = 0;
  let perPage = 6;
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  try {
    const result = await Promise.all([listPublishedPosts(page, 6), listCategories()]);
    posts = result[0].posts;
    total = result[0].total;
    perPage = result[0].perPage;
    categories = result[1];
  } catch (error) {
    console.error(error);
  }
  const pages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
      <section>
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">Independent notes</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Stories worth sitting with.</h1>
        </div>
        {posts.length === 0 ? (
          <div className="card p-8">
            <h2 className="font-serif text-2xl">No posts yet</h2>
            <p className="mt-2 text-slate-600">
              Import schema.sql in phpMyAdmin, then publish from /login.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {pages > 1 && (
          <div className="mt-8 flex gap-3">
            {page > 1 && (
              <Link href={`/?page=${page - 1}`} className="btn-outline">Previous</Link>
            )}
            {page < pages && <Link href={`/?page=${page + 1}`} className="btn">Next</Link>}
          </div>
        )}
      </section>
      <aside className="space-y-6">
        <div className="card p-5">
          <h2 className="font-serif text-xl">Categories</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id} className="flex justify-between">
                <Link href={`/category/${c.slug}`} className="hover:text-accent">{c.name}</Link>
                <span className="text-slate-400">{c.post_count ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/admin" className="btn">Open admin</Link>
      </aside>
    </div>
  );
}
