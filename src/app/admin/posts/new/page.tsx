import PostEditor from "@/components/PostEditor";
import PageHeader from "@/components/admin/PageHeader";
import { listCategories } from "@/lib/categories";
export const dynamic = "force-dynamic";
export default async function NewPostPage() {
  const categories = await listCategories().catch(() => []);
  return (
    <div>
      <PageHeader title="New article" description="Draft, schedule or publish straight away." back={{ href: "/admin/posts", label: "All posts" }} />
      <PostEditor categories={categories} />
    </div>
  );
}
