"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };
type Props = {
  categories: Category[];
  redirectTo?: string;
  post?: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    category_id: number | null;
    status: "draft" | "published";
    published_at?: Date | string | null;
  };
};

export default function PostEditor({ categories, post, redirectTo }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(post?.featured_image || "");

  async function onUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setImageUrl(data.url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      slug: form.get("slug"),
      excerpt: form.get("excerpt"),
      content: form.get("content"),
      featured_image: imageUrl || form.get("featured_image") || null,
      category_id: form.get("category_id") || null,
      status: form.get("status"),
      scheduled_at: form.get("scheduled_at"),
    };
    const url = post ? `/api/posts/${post.id}` : "/api/posts";
    const res = await fetch(url, {
      method: post ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save post.");
      return;
    }
    router.push(redirectTo || "/admin/posts");
    router.refresh();
  }

  async function onDelete() {
    if (!post || !confirm("Delete this post?")) return;
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    router.push(redirectTo || "/admin/posts");
    router.refresh();
  }

  const scheduledDefault =
    post?.status !== "published" && post?.published_at
      ? new Date(post.published_at).toISOString().slice(0, 16)
      : "";
  const statusDefault =
    post?.status === "published"
      ? "published"
      : post?.published_at && new Date(post.published_at) > new Date()
        ? "scheduled"
        : (post?.status ?? "draft");

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="title"
        required
        defaultValue={post?.title}
        placeholder="Title"
        className="input text-lg"
      />
      <input
        name="slug"
        defaultValue={post?.slug}
        placeholder="slug-optional"
        className="input"
      />

      {/* Featured image */}
      <div className="space-y-2">
        <label
          className="block text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          Featured image
        </label>

        {imageUrl ? (
          <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Featured preview"
              className="h-40 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute right-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white"
            >
              Remove
            </button>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="btn cursor-pointer !bg-slate-700 hover:!bg-slate-800">
            {uploading ? "Uploading..." : "Upload image"}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              disabled={uploading || saving}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
          </label>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            or paste a URL below
          </span>
        </div>

        <input
          name="featured_image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://... or /uploads/..."
          className="input"
        />
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          JPEG / PNG / WebP / GIF / SVG · max 4 MB. Upload saves to /uploads/
        </p>
      </div>

      <textarea
        name="excerpt"
        rows={3}
        defaultValue={post?.excerpt || ""}
        placeholder="Short excerpt"
        className="input"
      />
      <textarea
        name="content"
        required
        rows={16}
        defaultValue={post?.content}
        placeholder="HTML content is supported. Example: <p>Hello</p>"
        className="input font-mono text-sm"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="category_id"
          defaultValue={post?.category_id ?? ""}
          className="input"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={statusDefault} className="input">
          <option value="draft">Draft</option>
          <option value="scheduled">Schedule</option>
          <option value="published">Publish now</option>
        </select>
      </div>
      <label
        className="block text-xs font-bold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        Go live at
        <input
          name="scheduled_at"
          type="datetime-local"
          className="input mt-2"
          defaultValue={scheduledDefault}
        />
      </label>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Schedule = hidden until that time, then it goes public automatically.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button className="btn" disabled={saving || uploading}>
          {saving ? "Saving..." : "Save post"}
        </button>
        {post && (
          <button
            type="button"
            onClick={onDelete}
            className="btn-outline text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
