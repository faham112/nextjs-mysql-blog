import { listCategories } from "@/lib/categories";
import CategoryManager from "@/components/CategoryManager";
import PageHeader from "@/components/admin/PageHeader";
export const dynamic = "force-dynamic";
export default async function CategoriesPage() {
  const categories = await listCategories().catch(() => []);
  return (
    <div>
      <PageHeader title="Categories" description="Sections that group articles on the site." />
      <CategoryManager categories={categories} />
    </div>
  );
}
