import Link from "next/link";
import PostCard from "@/components/PostCard";
import { listPublishedPosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof listPublishedPosts>>["posts"] = [];
  try { posts = (await listPublishedPosts(1, 6)).posts; } catch (error) { console.error(error); }
  return (
    <div className="space-y-12">
      <section className="rounded-[2rem] bg-ink px-6 py-16 text-paper sm:px-12">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Global Career Hub</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Guides by Abdul Faheem.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-paper/75">Clear writing on careers, skills, and study. Read freely.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/articles" className="btn !bg-accent">Read articles</Link>
          <Link href="/login" className="btn-outline !border-white/20 !bg-transparent !text-paper">Writer login</Link>
        </div>
      </section>
      {posts.length > 0 && (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </section>
      )}
    </div>
  );
}
