import PostEditor from "@/components/PostEditor";
import { listCategories } from "@/lib/categories";
export const dynamic = "force-dynamic";
export default async function NewPostPage() {
  const categories = await listCategories().catch(() => []);
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">Compose</p>
      <h2 className="mb-5 font-heading text-3xl font-extrabold">New article</h2>
      <div className="morph-card"><PostEditor categories={categories} /></div>
    </div>
  );
}
