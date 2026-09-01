import Link from "next/link";
import PostCard from "@/components/PostCard";
import { listPublishedPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof listPublishedPosts>>["posts"] = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  try {
    const result = await Promise.all([listPublishedPosts(1, 6), listCategories()]);
    posts = result[0].posts;
    categories = result[1];
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="space-y-14">
      <section className="overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-paper sm:px-12">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Global Career Hub</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
          Clear career writing for people who want the next step.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-paper/75">
          Abdul Faheem publishes practical guides on work, skills, and study. Read freely. No account needed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/articles" className="btn !bg-accent">Read articles</Link>
          <Link href="/about" className="btn-outline !border-white/20 !bg-transparent !text-paper">About the writer</Link>
        </div>
      </section>
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Latest</p>
            <h2 className="mt-1 font-serif text-3xl">Fresh from the desk</h2>
          </div>
          <Link href="/articles" className="text-sm text-accent">All articles</Link>
        </div>
        {posts.length === 0 ? (
          <div className="card p-8">
            <h3 className="font-serif text-2xl">The first story is on its way</h3>
            <p className="mt-2 text-slate-600">New articles will appear here when published.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {(categories.length ? categories : [
          { id: 1, name: "Careers", slug: "careers", description: "Work paths", post_count: 0 },
          { id: 2, name: "Skills", slug: "skills", description: "Learn faster", post_count: 0 },
          { id: 3, name: "Study", slug: "study", description: "Education routes", post_count: 0 },
        ]).slice(0, 6).map((c) => (
          <Link key={c.id} href={`/category/${c.slug}`} className="card p-6 hover:border-accent/40">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Topic</p>
            <h3 className="mt-2 font-serif text-2xl">{c.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{c.description || "Explore this theme"}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
