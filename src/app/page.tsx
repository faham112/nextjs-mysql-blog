import Link from "next/link";
import NewsBlock from "@/components/NewsBlock";
import { listPublishedPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

export const revalidate = 60;

export default async function HomePage() {
  let latest: Awaited<ReturnType<typeof listPublishedPosts>>["posts"] = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];

  try {
    latest = (await listPublishedPosts(1, 4)).posts;
  } catch (error) {
    console.error(error);
  }
  try {
    categories = await listCategories();
  } catch {}

  // Per category: 1 main + 3 side = 4 posts each
  const byCategory: {
    name: string;
    slug: string;
    posts: typeof latest;
  }[] = [];

  for (const c of categories) {
    if ((c.post_count ?? 0) < 1) continue;
    try {
      const { posts } = await listPublishedPosts(1, 4, c.slug);
      if (posts.length > 0) {
        byCategory.push({ name: c.name, slug: c.slug, posts });
      }
    } catch {
      // skip broken category
    }
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b py-14 lg:py-20"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <p
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-500"
            style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
          >
            Career, skills and study guides
          </p>
          <h1 className="mt-5 font-heading text-3xl font-extrabold leading-none tracking-tight sm:text-5xl">
            Guides & Insights for{" "}
            <span className="bg-gradient-to-r from-brand-500 to-red-400 bg-clip-text text-transparent">
              Careers, Skills & Study.
            </span>
          </h1>
          <p
            className="mx-auto mt-4 max-w-xl text-sm sm:text-base"
            style={{ color: "var(--muted)" }}
          >
            High-value writing on work, tech, scholarships, and study paths.
          </p>
          <form
            action="/search"
            className="mx-auto mt-6 flex max-w-xl items-center rounded-2xl border p-2"
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
            <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition hover:border-brand-500 hover:text-brand-500"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest: 1 main + 3 small */}
      {latest.length > 0 ? (
        <NewsBlock title="Latest" href="/articles" posts={latest} />
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="card p-8">
            <p className="font-heading text-xl font-bold">New guides are on the way</p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Check back soon for new guides.
            </p>
          </div>
        </section>
      )}

      {/* Each category: 1 main + 3 small */}
      {byCategory.map((block) => (
        <div key={block.slug} className="border-t" style={{ borderColor: "var(--border)" }}>
          <NewsBlock
            title={block.name}
            href={`/category/${block.slug}`}
            posts={block.posts}
          />
        </div>
      ))}

      {/* Author */}
      <section
        className="border-y py-14"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg2)",
          color: "var(--fg)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
              About the Author
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
              Faham Baloch
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Practical guides on careers, skills, scholarships and study routes.
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
