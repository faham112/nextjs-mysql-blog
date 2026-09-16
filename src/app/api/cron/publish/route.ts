import { NextResponse } from "next/server";
import { publishDuePosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const url = new URL(req.url);
    const token = url.searchParams.get("secret") || req.headers.get("x-cron-secret");
    if (token !== secret) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await publishDuePosts();
  return NextResponse.json({ ok: true, ran_at: new Date().toISOString() });
}
