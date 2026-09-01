import Link from "next/link";
import { listAllPosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export default async function AdminPostsPage() {
  let posts: Awaited<ReturnType<typeof listAllPosts>> = [];
  try { posts = await listAllPosts(); } catch (e) { console.error(e); }
  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">Library</p>
          <h2 className="font-heading text-3xl font-extrabold">Articles</h2>
        </div>
        <Link href="/admin/posts/new" className="btn w-fit">New article</Link>
      </div>
      <div className="morph-card overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-white/50">
            <tr><th className="px-5 py-4">Title</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Category</th><th className="px-5 py-4"></th></tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-5 py-4 font-semibold">{p.title}</td>
                <td className="px-5 py-4 capitalize"><span className={p.status === "published" ? "text-emerald-300" : "text-brand-200"}>{p.status}</span></td>
                <td className="px-5 py-4 text-white/70">{p.category_name || "—"}</td>
                <td className="px-5 py-4 text-right"><Link href={`/admin/posts/${p.id}/edit`} className="font-bold text-brand-200 hover:text-white">Edit</Link></td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td className="px-5 py-8 text-white/60" colSpan={4}>No articles yet. Write the first one.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
