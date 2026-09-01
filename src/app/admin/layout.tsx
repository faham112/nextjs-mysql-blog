import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(225,29,72,0.18),_transparent_45%)] px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="admin-shell">
          <div className="admin-shell-inner">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-200">Writer desk</p>
                <h1 className="mt-1 font-heading text-2xl font-extrabold sm:text-3xl">{user.name}</h1>
                <p className="mt-1 text-xs text-white/60">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/posts/new" className="btn">New article</Link>
                <Link href="/" className="rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80">Exit</Link>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
              <aside className="morph-card h-fit"><AdminNav /></aside>
              <section className="min-w-0">{children}</section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
