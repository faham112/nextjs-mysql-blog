import { redirect } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { getSession } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
export const dynamic = "force-dynamic";
export default async function PublisherNewPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/dashboard/new");
  if (user.role === "admin") redirect("/admin/posts/new");
  const categories = await listCategories().catch(() => []);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-24">
      <h1 className="mb-5 font-heading text-3xl font-extrabold text-white">New draft</h1>
      <div className="rounded-3xl bg-white p-5"><PostEditor categories={categories} redirectTo="/dashboard" /></div>
    </div>
  );
}
