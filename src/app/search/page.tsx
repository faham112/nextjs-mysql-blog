import PostCard from "@/components/PostCard";
import { searchPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const posts = q.trim() ? await searchPosts(q.trim()) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-4xl">Search</h1>
      <form className="mt-6">
        <input name="q" defaultValue={q} placeholder="Search published posts" className="input" />
      </form>
      <div className="mt-8 grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {q && posts.length === 0 && <p className="mt-6 text-slate-500">No matching posts.</p>}
    </div>
  );
}
