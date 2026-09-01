import { listCategories } from "@/lib/categories";
import CategoryManager from "@/components/CategoryManager";
export const dynamic = "force-dynamic";
export default async function CategoriesPage() {
  const categories = await listCategories().catch(() => []);
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">Taxonomy</p>
      <h2 className="mb-5 font-heading text-3xl font-extrabold">Categories</h2>
      <CategoryManager categories={categories} />
    </div>
  );
}
