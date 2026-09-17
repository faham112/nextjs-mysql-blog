import Link from "next/link";
import PostCard from "@/components/PostCard";
import { listPublishedPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

export const revalidate = 60;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof listPublishedPosts>>["posts"] = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  try {
    posts = (await listPublishedPosts(1, 9)).posts;
  } catch (error) {
    console.error(error);
  }
  try {
    categories = await listCategories();
  } catch {}

  return (
    <>
      <section
        className="relative overflow-hidden border-b py-20 lg:py-28"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <p
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-500"
            style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
          >
            Career, skills and study guides
          </p>
          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">
            Guides & Insights for{" "}
            <span className="bg-gradient-to-r from-brand-500 to-red-400 bg-clip-text text-transparent">
              Careers, Skills & Study.
            </span>
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-base"
            style={{ color: "var(--muted)" }}
          >
            High-value writing on work, tech, scholarships, and study paths. Read
            completely free.
          </p>
          <form
            action="/search"
            className="mx-auto mt-8 flex max-w-xl items-center rounded-2xl border p-2"
            style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
          >
            <input
              name="q"
              placeholder="Search guides..."
              className="w-full bg-transparent px-3 text-sm outline-none"
              style={{ color: "var(--fg)" }}
            />
            <button className="btn !rounded-xl" type="submit">
              Search
            </button>
          </form>

          {categories.length > 0 && (
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2 px-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition hover:border-brand-500 hover:text-brand-500"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div
          className="mb-10 flex items-end justify-between border-b pb-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Selected Writing
            </p>
            <h2 className="mt-1 font-heading text-3xl font-extrabold">
              Featured Articles
            </h2>
          </div>
          <Link href="/articles" className="text-sm font-bold text-brand-600">
            All articles
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="card p-8">
            <p className="font-heading text-xl font-bold">New guides are on the way</p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Browse search topics or check back soon for new guides.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section
        className="border-y py-16"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg2)",
          color: "var(--fg)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
              About the Author
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold">
              Faham Baloch
            </h2>
            <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
              Writing practical guides on careers, skills, scholarships and study
              routes — the kind of advice useful at midnight when forms are due.
            </p>
          </div>
          <Link href="/about" className="btn flex-shrink-0">
            About the author
          </Link>
        </div>
      </section>
    </>
  );
}
