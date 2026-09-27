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
      featured_image: imageUrl || null,
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

  const muted = { color: "var(--a-muted, var(--muted))" } as const;
  const labelCls = "mb-1.5 block text-[13px] font-medium";
  const cardCls = "card p-4 sm:p-5";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6">
      <div className="min-w-0 space-y-5">
        <section className={`${cardCls} space-y-5`}>
          <div>
            <label htmlFor="pe-title" className={labelCls}>
              Title
            </label>
            <input
              id="pe-title"
              name="title"
              required
              defaultValue={post?.title}
              placeholder="A clear, specific headline"
              className="input !text-base !font-semibold sm:!text-lg"
            />
          </div>
          <div>
            <label htmlFor="pe-slug" className={labelCls}>
              Slug <span className="font-normal" style={muted}>(optional)</span>
            </label>
            <div className="flex items-stretch">
              <span
                className="hidden items-center rounded-l-lg border border-r-0 px-3 text-sm sm:flex"
                style={{ ...muted, borderColor: "var(--a-border-strong, var(--border))", background: "var(--a-surface-2, var(--bg))" }}
              >
                /posts/
              </span>
              <input
                id="pe-slug"
                name="slug"
                defaultValue={post?.slug}
                placeholder="slug-optional"
                className="input sm:!rounded-l-none"
              />
            </div>
            <p className="mt-1.5 text-xs" style={muted}>
              Leave empty to generate it from the title.
            </p>
          </div>
          <div>
            <label htmlFor="pe-excerpt" className={labelCls}>
              Excerpt
            </label>
            <textarea
              id="pe-excerpt"
              name="excerpt"
              rows={3}
              defaultValue={post?.excerpt || ""}
              placeholder="Short excerpt"
              className="input"
            />
            <p className="mt-1.5 text-xs" style={muted}>
              Shown on cards and used as the meta description.
            </p>
          </div>
        </section>

        <section className={cardCls}>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="pe-content" className="block text-[13px] font-medium">
              Content
            </label>
            <span className="text-xs" style={muted}>
              HTML supported
            </span>
          </div>
          <textarea
            id="pe-content"
            name="content"
            required
            rows={18}
            defaultValue={post?.content}
            placeholder="HTML content is supported. Example: <p>Hello</p>"
            className="input font-mono text-sm leading-6"
          />
        </section>
      </div>

      <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-24">
        <section className={`${cardCls} order-last space-y-4 lg:order-first`}>
          <h3 className="text-[15px] font-semibold">Publish</h3>
          <div>
            <label htmlFor="pe-status" className={labelCls}>
              Status
            </label>
            <select id="pe-status" name="status" defaultValue={statusDefault} className="input">
              <option value="draft">Draft</option>
              <option value="scheduled">Schedule</option>
              <option value="published">Publish now</option>
            </select>
          </div>
          <div>
            <label htmlFor="pe-when" className={labelCls}>
              Go live at
            </label>
            <input
              id="pe-when"
              name="scheduled_at"
              type="datetime-local"
              className="input"
              defaultValue={scheduledDefault}
            />
            <p className="mt-1.5 text-xs" style={muted}>
              Schedule = hidden until that time, then it goes public automatically.
            </p>
          </div>
          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <button className="btn w-full sm:flex-1 lg:flex-none" disabled={saving || uploading}>
              {saving ? "Saving..." : "Save post"}
            </button>
            {post && (
              <button type="button" onClick={onDelete} className="btn-outline btn-danger w-full text-red-700 sm:w-auto lg:w-full">
                Delete
              </button>
            )}
          </div>
        </section>

        <section className={cardCls}>
          <label htmlFor="pe-category" className={labelCls}>
            Category
          </label>
          <select id="pe-category" name="category_id" defaultValue={post?.category_id ?? ""} className="input">
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </section>

        <section className={`${cardCls} space-y-3`}>
          <p className="text-[13px] font-medium">Featured image</p>

          {imageUrl ? (
            <div
              className="relative overflow-hidden rounded-lg border"
              style={{ borderColor: "var(--a-border, var(--border))" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Featured preview" className="aspect-[1200/630] w-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute right-2 top-2 min-h-[32px] rounded-md bg-black/70 px-2.5 text-xs font-semibold text-[#fff] backdrop-blur hover:bg-black/80"
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              className="flex aspect-[1200/630] w-full items-center justify-center rounded-lg border border-dashed text-xs"
              style={{ ...muted, borderColor: "var(--a-border-strong, var(--border))" }}
            >
              No image yet
            </div>
          )}

          <label className="btn-outline w-full cursor-pointer">
            {uploading ? "Uploading..." : "Upload image"}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading || saving}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
          </label>

          <div>
            <label htmlFor="pe-image" className="mb-1.5 block text-xs" style={muted}>
              or paste HTTPS /uploads URL
            </label>
            <input
              id="pe-image"
              name="featured_image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... or /uploads/..."
              className="input"
            />
          </div>
          <p className="text-xs" style={muted}>
            JPEG / PNG / WebP / GIF · max 4 MB · no SVG
          </p>
        </section>
      </aside>
    </form>
  );
}
