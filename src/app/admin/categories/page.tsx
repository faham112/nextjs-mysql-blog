import { listCategories } from "@/lib/categories";
import CategoryManager from "@/components/CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await listCategories();
  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl">Categories</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
