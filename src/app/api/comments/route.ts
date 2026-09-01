import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const content = String(body.content || "").trim();
  const postId = Number(body.postId);
  if (!name || !email || !content || !postId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await query(
    "INSERT INTO comments (post_id, author_name, author_email, content, approved) VALUES (:post_id, :author_name, :author_email, :content, 0)",
    { post_id: postId, author_name: name, author_email: email, content }
  );
  return NextResponse.json({ ok: true });
}

export async function PATCH(req) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, approved } = await req.json();
  await query("UPDATE comments SET approved = :approved WHERE id = :id", {
    id: Number(id), approved: approved ? 1 : 0,
  });
  return NextResponse.json({ ok: true });
}
