import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import AdminBottomNav from "@/components/AdminBottomNav";
import AdminTopBar from "@/components/AdminTopBar";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/dashboard");
  return (
    <div className="admin-root min-h-screen bg-dark-900 pb-20">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6">
        <AdminTopBar name={user.name} email={user.email} />
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="hidden h-fit rounded-xl border border-white/10 p-3 lg:block">
            <AdminNav />
          </aside>
          <section className="min-w-0">{children}</section>
        </div>
      </div>
      <AdminBottomNav />
    </div>
  );
}
