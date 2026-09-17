import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { escapeHtml } from "@/lib/sanitize";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`comment:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many comments. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const name = escapeHtml(String(body.name || "").trim()).slice(0, 120);
  const email = String(body.email || "")
    .trim()
    .toLowerCase()
    .slice(0, 190);
  const content = escapeHtml(String(body.content || "").trim()).slice(0, 5000);
  const postId = Number(body.postId);

  if (!name || !email || !content || !postId || !Number.isFinite(postId)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!/^[^


@]+@[^


@]+\.[^


@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Ensure post exists and is published
  const posts = await query<Array<{ id: number }>>(
    "SELECT id FROM posts WHERE id = :id AND status = 'published' LIMIT 1",
    { id: postId }
  );
  if (!posts[0]) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await query(
    "INSERT INTO comments (post_id, author_name, author_email, content, approved) VALUES (:post_id, :author_name, :author_email, :content, 0)",
    { post_id: postId, author_name: name, author_email: email, content }
  );

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, approved } = await req.json();
  await query("UPDATE comments SET approved = :approved WHERE id = :id", {
    id: Number(id),
    approved: approved ? 1 : 0,
  });
  return NextResponse.json({ ok: true });
}
