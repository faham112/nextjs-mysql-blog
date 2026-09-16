import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveScripts } from "@/lib/settings";
export async function POST(req: Request) {
  const user = await getSession();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  await saveScripts({ header: String(body.header || ""), body: String(body.body || ""), footer: String(body.footer || "") });
  return NextResponse.json({ ok: true });
}
