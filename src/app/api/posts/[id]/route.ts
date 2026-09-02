import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { getPostById, toSlug } from "@/lib/posts";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "admin" && post.author_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const title = String(body.title || "").trim();
  if (!title || !body.content) return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  let slug = toSlug(String(body.slug || title)) || post.slug;
  const clash = await query<{ id: number }>("SELECT id FROM posts WHERE slug = ? AND id != ? LIMIT 1", [slug, Number(id)]);
  if (clash[0]) slug = `${slug}-${id}`;
  const status = body.status === "published" ? "published" : "draft";
  const published_at = status === "published" ? post.published_at || new Date() : post.published_at;
  await query(
    "UPDATE posts SET title=?, slug=?, excerpt=?, content=?, featured_image=?, category_id=?, status=?, published_at=? WHERE id=?",
    [title, slug, body.excerpt || null, String(body.content), body.featured_image || null, body.category_id ? Number(body.category_id) : null, status, published_at, Number(id)]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "admin" && post.author_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await query("DELETE FROM posts WHERE id = ? LIMIT 1", [Number(id)]);
  return NextResponse.json({ ok: true });
}
