import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { toSlug } from "@/lib/posts";

export async function POST(req) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const title = String(body.title || "").trim();
  if (!title || !body.content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }
  let slug = toSlug(String(body.slug || title));
  if (!slug) slug = `post-${Date.now()}`;
  const existing = await query("SELECT id FROM posts WHERE slug = :slug LIMIT 1", { slug });
  if (existing[0]) slug = `${slug}-${Date.now()}`;
  const status = body.status === "published" ? "published" : "draft";
  const published_at = status === "published" ? new Date() : null;
  await query(
    `INSERT INTO posts (title, slug, excerpt, content, featured_image, category_id, author_id, status, published_at)
     VALUES (:title, :slug, :excerpt, :content, :featured_image, :category_id, :author_id, :status, :published_at)`,
    {
      title, slug, excerpt: body.excerpt || null, content: String(body.content),
      featured_image: body.featured_image || null,
      category_id: body.category_id ? Number(body.category_id) : null,
      author_id: user.id, status, published_at,
    }
  );
  return NextResponse.json({ ok: true, slug });
}
