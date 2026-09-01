import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { toSlug } from "@/lib/posts";

export async function POST(req) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const slug = toSlug(name);
  await query("INSERT INTO categories (name, slug, description) VALUES (:name, :slug, :description)", {
    name, slug, description: body.description || null,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await query("DELETE FROM categories WHERE id = :id", { id });
  return NextResponse.json({ ok: true });
}
