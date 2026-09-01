import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts/new", label: "New post" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Settings" },
];
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-dark-800 bg-dark-900 p-6 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Writer Control Panel</p>
          <h1 className="mt-1 font-heading text-2xl font-extrabold">Welcome back, {user.name}</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/posts/new" className="btn">New Article</Link>
          <Link href="/" className="rounded-xl border border-dark-700 bg-dark-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300">Exit</Link>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="card grid h-fit gap-1 p-3 text-sm font-semibold">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 hover:bg-slate-100 hover:text-brand-600">{item.label}</Link>
          ))}
          <form action="/api/auth/logout" method="post">
            <button className="w-full rounded-xl px-3 py-2 text-left text-slate-500 hover:bg-slate-100" type="submit">Log out</button>
          </form>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
