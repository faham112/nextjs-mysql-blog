import { notFound, redirect } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { getSession } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { getPostById } from "@/lib/posts";
export const dynamic = "force-dynamic";
export default async function PublisherEditPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role === "admin") redirect("/admin");
  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(Number(id)), listCategories().catch(() => [])]);
  if (!post || post.author_id !== user.id) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-24">
      <h1 className="mb-5 font-heading text-3xl font-extrabold">Edit draft</h1>
      <PostEditor categories={categories} post={post} redirectTo="/dashboard" />
    </div>
  );
}
