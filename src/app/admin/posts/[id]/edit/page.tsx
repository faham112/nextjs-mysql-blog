import { notFound } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { listCategories } from "@/lib/categories";
import { getPostById } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(Number(id)), listCategories()]);
  if (!post) notFound();
  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl">Edit post</h1>
      <PostEditor categories={categories} post={post} />
    </div>
  );
}
