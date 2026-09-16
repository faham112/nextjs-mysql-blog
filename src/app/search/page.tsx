import Link from "next/link";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { listCategories } from "@/lib/categories";
import { searchPosts, listPublishedPosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const title = q.trim() ? `Search: ${q.trim()}` : "Search guides";
  return { title, robots: { index: false, follow: true } };
}
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "" } = await searchParams;
  const query = q.trim();
  let posts: Awaited<ReturnType<typeof searchPosts>> = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  try { categories = await listCategories(); } catch { categories = []; }
  try {
    if (query) posts = await searchPosts(query);
    else if (category) posts = (await listPublishedPosts(1, 24, category)).posts;
    else posts = [];
  } catch { posts = []; }
  if (category) posts = posts.filter((p) => p.category_slug === category);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Find a guide</p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold">{query ? `Results for “${query}”` : "Search"}</h1>
      <p className="mt-2 text-sm text-slate-600">{query || category ? `${posts.length} guide${posts.length === 1 ? "" : "s"} found` : "Search careers, skills, scholarships, or tech."}</p>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input name="q" defaultValue={query} placeholder="Try careers, SOP, Next.js" className="input" />
        <button className="btn sm:w-auto" type="submit">Search</button>
      </form>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/search" className={`rounded-full px-3 py-1.5 text-xs font-bold ${!category ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}>All</Link>
        {categories.map((c) => (
          <Link key={c.id} href={query ? `/search?q=${encodeURIComponent(query)}&category=${c.slug}` : `/search?category=${c.slug}`} className={`rounded-full px-3 py-1.5 text-xs font-bold ${category === c.slug ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}>{c.name}</Link>
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      {(query || category) && posts.length === 0 && (
        <div className="card mt-8 p-8">
          <p className="font-heading text-xl font-bold">No matching articles</p>
          <p className="mt-2 text-sm text-slate-600">Try careers, SOP, scholarships, or Next.js. Or browse the full library.</p>
          <Link href="/articles" className="btn mt-4 inline-flex">All articles</Link>
        </div>
      )}
    </div>
  );
}
