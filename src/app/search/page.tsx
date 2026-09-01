import PostCard from "@/components/PostCard";
import { searchPosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  let posts: Awaited<ReturnType<typeof searchPosts>> = [];
  try { posts = q.trim() ? await searchPosts(q.trim()) : []; } catch { posts = []; }
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Find a guide</p>
      <h1 className="mt-2 font-serif text-4xl">Search</h1>
      <form className="mt-6">
        <input name="q" defaultValue={q} placeholder="Search published articles" className="input" />
      </form>
      <div className="mt-8 grid gap-6">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      {q && posts.length === 0 && <p className="mt-6 text-slate-500">No matching articles.</p>}
    </div>
  );
}
