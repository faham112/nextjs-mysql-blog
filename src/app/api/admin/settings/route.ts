import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTrackers, saveTrackers, type TrackerItem } from "@/lib/settings";
export const dynamic = "force-dynamic";
export async function GET() {
  const user = await getSession();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ trackers: await getTrackers() });
}
export async function POST(req: Request) {
  const user = await getSession();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const list = Array.isArray(body.trackers) ? (body.trackers as TrackerItem[]) : [];
  const clean = list.filter((t) => t && String(t.code || "").trim()).map((t) => ({
    id: String(t.id || crypto.randomUUID()),
    name: String(t.name || "Script").slice(0, 80),
    placement: t.placement === "header" || t.placement === "footer" ? t.placement : "body" as const,
    code: String(t.code || ""),
  }));
  await saveTrackers(clean);
  return NextResponse.json({ ok: true, trackers: clean });
}
