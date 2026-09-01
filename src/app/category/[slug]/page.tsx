import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getCategoryBySlug } from "@/lib/categories";
import { listPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const { posts } = await listPublishedPosts(1, 24, slug);
  return (
    <div>
      <p className="text-sm uppercase tracking-widest text-accent">Category</p>
      <h1 className="mt-2 font-serif text-4xl">{category.name}</h1>
      {category.description && <p className="mt-2 text-slate-600">{category.description}</p>}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {posts.length === 0 && <p className="mt-6 text-slate-500">No published posts in this category yet.</p>}
    </div>
  );
}
