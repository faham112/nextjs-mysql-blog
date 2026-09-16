import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { runSqlUpdates } from "@/lib/migrate";
import { publishDuePosts } from "@/lib/posts";
import { seedSeoPosts } from "@/lib/seedPosts";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const user = await getSession();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "migrate");
  if (action === "publish") {
    await publishDuePosts();
    return NextResponse.json({ ok: true, log: ["scheduled posts published if due"] });
  }
  if (action === "seed") {
    const log = await seedSeoPosts(user.id);
    return NextResponse.json({ ok: true, log });
  }
  return NextResponse.json({ ok: true, log: await runSqlUpdates() });
}
