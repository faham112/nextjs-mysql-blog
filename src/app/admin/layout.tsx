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
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
      <aside className="card overflow-hidden">
        <div className="bg-ink px-5 py-5 text-paper">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent">Writer desk</p>
          <p className="mt-2 font-serif text-2xl">{user.name}</p>
          <p className="mt-1 text-xs text-paper/60">{user.email}</p>
        </div>
        <nav className="grid gap-1 p-3 text-sm">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 hover:bg-[#f6f1e8]">{item.label}</Link>
          ))}
          <Link href="/" className="rounded-xl px-3 py-2 text-slate-500 hover:bg-[#f6f1e8]">View site</Link>
          <form action="/api/auth/logout" method="post">
            <button className="w-full rounded-xl px-3 py-2 text-left text-slate-500 hover:bg-[#f6f1e8]" type="submit">Log out</button>
          </form>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
