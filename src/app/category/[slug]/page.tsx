import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ogCover } from "@/lib/covers";
import PostCard from "@/components/PostCard";
import { getCategoryBySlug } from "@/lib/categories";
import { listPublishedPosts } from "@/lib/posts";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: "Category" };
  const title = `${category.name} guides`;
  const description = (category.description || `Practical ${category.name.toLowerCase()} guides from Global Career Hub.`).slice(0, 160);
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
  if (!category) notFound();
  const { posts } = await listPublishedPosts(1, 100, slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-sm uppercase tracking-widest text-accent">Category</p>
      <h1 className="mt-2 font-heading text-4xl">{category.name}</h1>
      {category.description && <p className="mt-2 text-slate-600">{category.description}</p>}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      {posts.length === 0 && <p className="mt-6 text-slate-500">No published posts in this category yet.</p>}
    </div>
  );
}
