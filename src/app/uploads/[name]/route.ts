import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Proxy to /api/media so one implementation serves both paths. */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ name: string }> }
) {
  const { name } = await ctx.params;
  if (!name || name.includes("..") || name.includes("/")) {
    return new NextResponse("Not found", { status: 404 });
  }
  const url = new URL(req.url);
  const target = `${url.origin}/api/media/${encodeURIComponent(name)}`;
  try {
    const res = await fetch(target, { cache: "no-store" });
    if (!res.ok) {
      return new NextResponse("Not found", { status: 404 });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const out = new Uint8Array(buf.byteLength);
    out.set(buf);
    return new NextResponse(out as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type":
          res.headers.get("Content-Type") || "application/octet-stream",
        "Cache-Control": "public, max-age=2592000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
