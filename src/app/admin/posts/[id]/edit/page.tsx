import { notFound } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { listCategories } from "@/lib/categories";
import { getPostById } from "@/lib/posts";
export const dynamic = "force-dynamic";
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(Number(id)), listCategories().catch(() => [])]);
  if (!post) notFound();
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">Compose</p>
      <h2 className="mb-5 font-heading text-3xl font-extrabold">Edit article</h2>
      <div className="morph-card"><PostEditor categories={categories} post={post} /></div>
    </div>
  );
}
