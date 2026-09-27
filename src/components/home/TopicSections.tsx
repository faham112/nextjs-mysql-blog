import Link from "next/link";
import PostThumb from "@/components/PostThumb";
import { COVER_SIZES } from "@/lib/coverSrcset";
import { listPublishedPosts, type PostRow } from "@/lib/posts";
import { categoryIntro } from "@/lib/categoryIntros";

export type TopicCategory = { name: string; slug: string; post_count?: number | string | null };

/** Preferred order on the homepage; any other DB categories follow alphabetically. */
const ORDER = ["careers", "scholarships", "study-abroad", "skills", "applications", "technology", "tutorials", "lifestyle"];

export function orderCategories<T extends { slug: string; name: string }>(cats: T[]): T[] {
  return [...cats].sort((a, b) => {
    const ia = ORDER.indexOf(a.slug);
    const ib = ORDER.indexOf(b.slug);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.name.localeCompare(b.name);
  });
}

function formatDate(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function TopicCard({ post, fallbackCategory }: { post: PostRow; fallbackCategory: string }) {
  return (
    <article className="group w-[78%] shrink-0 snap-start sm:w-auto">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="aspect-[1200/630] w-full overflow-hidden rounded-xl" style={{ background: "var(--bg2)" }}>
          <PostThumb
            post={post}
            alt={post.title}
            width={600}
            height={315}
            sizes={COVER_SIZES.topic}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-[12px]">
          <span className="font-bold uppercase tracking-[0.08em]" style={{ color: "var(--accent)" }}>
            {post.category_name || fallbackCategory}
          </span>
          <span style={{ color: "var(--muted)" }}>{formatDate(post.published_at)}</span>
        </div>
        <h3 className="mt-1.5 font-heading text-[16px] font-bold leading-snug transition group-hover:opacity-80 sm:text-[17px]" style={{ color: "var(--fg)" }}>
          {post.title}
        </h3>
      </Link>
    </article>
  );
}

function TopicHeader({ cat, total }: { cat: TopicCategory; total: number }) {
  return (
    <div className="mb-2 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
          {total} {total === 1 ? "guide" : "guides"}
        </div>
        <h2 className="font-heading text-[26px] font-bold leading-tight tracking-[-0.02em] sm:text-[30px]" style={{ color: "var(--fg)" }}>
          {cat.name}
        </h2>
      </div>
      <Link
        href={`/category/${cat.slug}`}
        className="shrink-0 text-[14px] font-semibold hover:underline"
        style={{ color: "var(--fg)" }}
      >
        View all →
      </Link>
    </div>
  );
}

/** Async server component: one section per category (streams in behind a skeleton). */
export default async function TopicSections({ categories }: { categories: TopicCategory[] }) {
  const ordered = orderCategories(categories);
  const results = await Promise.all(
    ordered.map((c) =>
      listPublishedPosts(1, 4, c.slug)
        .then((r) => ({ cat: c, posts: r.posts, total: Number(r.total) || r.posts.length }))
        .catch(() => ({ cat: c, posts: [] as PostRow[], total: 0 }))
    )
  );
  const withPosts = results.filter((r) => r.posts.length > 0);
  if (withPosts.length === 0) return null;

  return (
    <div id="topics">
      {withPosts.map(({ cat, posts, total }) => (
        <section
          key={cat.slug}
          id={`topic-${cat.slug}`}
          className="scroll-mt-24 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:py-12">
            <TopicHeader cat={cat} total={total} />
            <p className="mb-6 max-w-[760px] text-[15px] leading-7" style={{ color: "var(--muted)" }}>
              {categoryIntro(cat.slug, cat.name)}
            </p>
            <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-0 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
              {posts.map((p) => (
                <TopicCard key={p.id} post={p} fallbackCategory={cat.name} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

/** Skeleton shown while TopicSections loads (same layout, pulsing blocks). */
export function TopicSectionsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: count }).map((_, s) => (
        <section key={s} className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:py-12">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="mb-2 h-2 w-16 animate-pulse rounded" style={{ background: "var(--border)" }} />
                <div className="h-7 w-44 animate-pulse rounded" style={{ background: "var(--border)" }} />
              </div>
              <div className="h-3 w-16 animate-pulse rounded" style={{ background: "var(--border)" }} />
            </div>
            <div className="-mx-5 flex gap-4 overflow-hidden px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[78%] shrink-0 sm:w-auto">
                  <div className="aspect-[1200/630] w-full animate-pulse rounded-xl" style={{ background: "var(--bg2)" }} />
                  <div className="mt-4 h-2 w-20 animate-pulse rounded" style={{ background: "var(--border)" }} />
                  <div className="mt-3 h-4 w-full animate-pulse rounded" style={{ background: "var(--border)" }} />
                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded" style={{ background: "var(--border)" }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
