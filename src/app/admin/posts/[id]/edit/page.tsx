import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import PostEditor from "@/components/PostEditor";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { statusOf } from "@/components/admin/rows";
import { listCategories } from "@/lib/categories";
import { getPostById } from "@/lib/posts";
export const dynamic = "force-dynamic";
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(Number(id)), listCategories().catch(() => [])]);
  if (!post) notFound();
  const status = statusOf(post);
  return (
    <div>
      <PageHeader
        title="Edit article"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <span className="a-subtle">/posts/{post.slug}</span>
          </span>
        }
        back={{ href: "/admin/posts", label: "All posts" }}
        actions={
          status === "published" ? (
            <a href={`/posts/${post.slug}`} target="_blank" rel="noopener" className="btn-outline">
              <ExternalLink size={16} /> View live
            </a>
          ) : null
        }
      />
      <PostEditor categories={categories} post={post} />
    </div>
  );
}
