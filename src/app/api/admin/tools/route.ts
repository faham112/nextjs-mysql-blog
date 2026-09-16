import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { runSqlUpdates } from "@/lib/migrate";
import { publishDuePosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const user = await getSession();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  if (String(body.action) === "publish") {
    await publishDuePosts();
    return NextResponse.json({ ok: true, log: ["scheduled posts published if due"] });
  }
  const log = await runSqlUpdates();
  return NextResponse.json({ ok: true, log });
}
