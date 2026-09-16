import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function PublisherHome() {
  const user = await getSession();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role === "admin") redirect("/admin");
  const posts = await query<{ id: number; title: string; status: string; slug: string }>(
    "SELECT id, title, status, slug FROM posts WHERE author_id = ? ORDER BY updated_at DESC",
    [user.id]
  ).catch(() => []);
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 pb-24">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <img src="/logo.svg" alt="" className="mb-3 h-10 w-10 rounded-xl" />
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Publisher desk</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold">Hello, {user.name}</h1>
          <p className="mt-2 text-sm text-slate-600">You can write drafts for Global Career Hub. An admin reviews the site.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/new" className="btn">New draft</Link>
          <Link href="/" className="btn-outline">View site</Link>
        </div>
        <div className="rounded-3xl bg-white p-2 shadow-sm">
          {posts.length === 0 ? <p className="p-6 text-sm text-slate-500">No drafts yet.</p> : (
            <ul>
              {posts.map((p) => (
                <li key={p.id} className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-0">
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs capitalize text-slate-500">{p.status}</p>
                  </div>
                  <Link href={`/dashboard/edit/${p.id}`} className="text-sm font-bold text-brand-600">Edit</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-4 border-t border-slate-200 bg-white text-center text-[11px] font-bold uppercase">
        <Link href="/dashboard" className="py-3">Home</Link>
        <Link href="/dashboard/new" className="py-3">Write</Link>
        <Link href="/" className="py-3">Site</Link>
        <form action="/api/auth/logout" method="post"><button className="w-full py-3 text-brand-600" type="submit">Logout</button></form>
      </nav>
    </div>
  );
}
