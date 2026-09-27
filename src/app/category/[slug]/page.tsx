import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { ogCover } from "@/lib/covers";
import PostCard from "@/components/PostCard";
import { getCategoryBySlug, listCategories } from "@/lib/categories";
import { listPublishedPosts } from "@/lib/posts";
import { categoryIntro } from "@/lib/categoryIntros";
import Link from "next/link";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: "Category" };
  const title = `${category.name} guides`;
  const intro = categoryIntro(category.slug, category.name);
  const description = (intro.length > 158 ? intro.slice(0, 157).replace(/\s+\S*$/, "") + "…" : intro);
  return {
    title,
    description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { type: "website", url: `/category/${category.slug}`, title, description, siteName: "GlobalCareerHub", images: [{ url: ogCover(null, category.slug, siteUrl), width: 1200, height: 630 }] },
  };
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  // Unknown / retired category (e.g. old WordPress categories) → full library
  if (!category) permanentRedirect("/articles");
  const { posts } = await listPublishedPosts(1, 100, slug);
  const others = (await listCategories().catch(() => [])).filter((c) => c.slug !== category.slug && (c.post_count ?? 1) > 0);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-sm uppercase tracking-widest text-accent">Category</p>
      <h1 className="mt-2 font-heading text-4xl">{category.name}</h1>
      {category.description && <p className="mt-2 font-medium" style={{ color: "var(--fg)" }}>{category.description}</p>}
      <p className="mt-3 max-w-3xl" style={{ color: "var(--muted)" }}>{categoryIntro(category.slug, category.name)}</p>
      {posts.length > 0 && (
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-brand-600">
          {posts.length} guide{posts.length === 1 ? "" : "s"}
        </p>
      )}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      {posts.length === 0 && <p className="mt-6 text-slate-500">No published posts in this category yet.</p>}
      {others.length > 0 && (
        <nav className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }} aria-label="Other categories">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>More topics</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="rounded-full border px-3 py-1.5 text-xs font-bold hover:text-brand-600" style={{ borderColor: "var(--border)" }}>
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
