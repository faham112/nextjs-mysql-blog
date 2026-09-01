import Link from "next/link";
import { listAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await listAllPosts();
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl">Posts</h1>
        <Link href="/admin/posts/new" className="btn">New post</Link>
      </div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-ink/5">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
                <td className="px-4 py-3">{p.category_name || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/posts/${p.id}/edit`} className="text-accent">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
