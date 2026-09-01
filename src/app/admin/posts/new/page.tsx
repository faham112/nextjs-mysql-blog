import PostEditor from "@/components/PostEditor";
import { listCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const categories = await listCategories();
  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl">New post</h1>
      <PostEditor categories={categories} />
    </div>
  );
}
