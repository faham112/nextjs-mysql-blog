import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { listPublishedPosts } from "@/lib/posts";
export const metadata: Metadata = {
  title: "All articles",
  description: "Every published career, skills, and study guide on Global Career Hub.",
  alternates: { canonical: "/articles" },
};
export const dynamic = "force-dynamic";
export default async function ArticlesPage() {
  let posts: Awaited<ReturnType<typeof listPublishedPosts>>["posts"] = [];
  try { posts = (await listPublishedPosts(1, 24)).posts; } catch (error) { console.error(error); }
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Library</p>
      <h1 className="mt-2 font-heading text-4xl sm:text-5xl">All articles</h1>
      <p className="mt-3 max-w-2xl text-slate-600">Every published guide on Global Career Hub, written for readers first.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      {posts.length === 0 && <div className="card mt-8 p-8"><p className="text-slate-600">No published articles yet. Check back soon.</p></div>}
    </div>
  );
}
