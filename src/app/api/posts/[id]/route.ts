import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { getPostById, toSlug } from "@/lib/posts";
import { resolvePublishState } from "@/lib/schedule";
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "admin" && post.author_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const title = String(body.title || "").trim();
  if (!title || !body.content) return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  let slug = toSlug(String(body.slug || title)) || post.slug;
  const clash = await query<Array<{ id: number }>>("SELECT id FROM posts WHERE slug = :slug AND id != :id LIMIT 1", { slug, id: Number(id) });
  if (clash[0]) slug = `${slug}-${id}`;
  const planned = resolvePublishState(body.status, body.scheduled_at);
  const published_at = planned.kind === "published" && post.status === "published" && !body.scheduled_at ? post.published_at || new Date() : planned.published_at;
  await query(`UPDATE posts SET title=:title, slug=:slug, excerpt=:excerpt, content=:content,
      featured_image=:featured_image, category_id=:category_id, status=:status, published_at=:published_at WHERE id=:id`, {
    id: Number(id), title, slug, excerpt: body.excerpt || null, content: String(body.content),
    featured_image: body.featured_image || null, category_id: body.category_id ? Number(body.category_id) : null,
    status: planned.status, published_at,
  });
  return NextResponse.json({ ok: true });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "admin" && post.author_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await query("DELETE FROM posts WHERE id = ? LIMIT 1", [Number(id)]);
  return NextResponse.json({ ok: true });
}
