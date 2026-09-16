"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
type Category = { id: number; name: string };
type Props = {
  categories: Category[];
  redirectTo?: string;
  post?: {
    id: number; title: string; slug: string; excerpt: string | null; content: string;
    featured_image: string | null; category_id: number | null;
    status: "draft" | "published"; published_at?: Date | string | null;
  };
};
export default function PostEditor({ categories, post, redirectTo }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true); setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"), slug: form.get("slug"), excerpt: form.get("excerpt"),
      content: form.get("content"), featured_image: form.get("featured_image"),
      category_id: form.get("category_id") || null, status: form.get("status"),
      scheduled_at: form.get("scheduled_at"),
    };
    const url = post ? `/api/posts/${post.id}` : "/api/posts";
    const res = await fetch(url, { method: post ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Could not save post."); return; }
    router.push(redirectTo || "/admin/posts"); router.refresh();
  }
  async function onDelete() {
    if (!post || !confirm("Delete this post?")) return;
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    router.push(redirectTo || "/admin/posts"); router.refresh();
  }
  const scheduledDefault = post?.status !== "published" && post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : "";
  const statusDefault = post?.status === "published" ? "published" : post?.published_at && new Date(post.published_at) > new Date() ? "scheduled" : post?.status ?? "draft";
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input name="title" required defaultValue={post?.title} placeholder="Title" className="input text-lg" />
      <input name="slug" defaultValue={post?.slug} placeholder="slug-optional" className="input" />
      <input name="featured_image" defaultValue={post?.featured_image || ""} placeholder="Featured image URL" className="input" />
      <textarea name="excerpt" rows={3} defaultValue={post?.excerpt || ""} placeholder="Short excerpt" className="input" />
      <textarea name="content" required rows={16} defaultValue={post?.content} placeholder="HTML content is supported. Example: <p>Hello</p>" className="input font-mono text-sm" />
      <div className="grid gap-3 sm:grid-cols-2">
        <select name="category_id" defaultValue={post?.category_id ?? ""} className="input">
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="status" defaultValue={statusDefault} className="input">
          <option value="draft">Draft</option>
          <option value="scheduled">Schedule</option>
          <option value="published">Publish now</option>
        </select>
      </div>
      <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        Go live at
        <input name="scheduled_at" type="datetime-local" className="input mt-2" defaultValue={scheduledDefault} />
      </label>
      <p className="text-xs" style={{ color: "var(--muted)" }}>Schedule = hidden until that time, then it goes public automatically.</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button className="btn" disabled={saving}>{saving ? "Saving..." : "Save post"}</button>
        {post && <button type="button" onClick={onDelete} className="btn-outline text-red-700">Delete</button>}
      </div>
    </form>
  );
}
