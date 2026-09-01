import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="card h-fit p-4 text-sm">
        <p className="text-xs uppercase tracking-wide text-slate-400">Signed in</p>
        <p className="mt-1 font-medium">{user.name}</p>
        <nav className="mt-4 grid gap-2">
          <Link href="/admin" className="hover:text-accent">Dashboard</Link>
          <Link href="/admin/posts" className="hover:text-accent">Posts</Link>
          <Link href="/admin/posts/new" className="hover:text-accent">New post</Link>
          <Link href="/admin/categories" className="hover:text-accent">Categories</Link>
          <form action="/api/auth/logout" method="post">
            <button className="text-left text-slate-500 hover:text-accent" type="submit">Log out</button>
          </form>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
