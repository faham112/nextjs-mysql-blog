import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function toBody(data: Buffer | Uint8Array): Uint8Array {
  const src = Buffer.isBuffer(data)
    ? data
    : Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  const out = new Uint8Array(src.byteLength);
  out.set(src);
  return out;
}

function ok(data: Buffer | Uint8Array, contentType: string) {
  return new NextResponse(toBody(data) as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=2592000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function tryDisk(name: string): Promise<Buffer | null> {
  const bases = [
    path.join(process.cwd(), "public", "uploads"),
    path.join(process.cwd(), "uploads_data"),
    path.join("/tmp", "gch-uploads"),
  ];
  for (const base of bases) {
    try {
      return await readFile(path.join(base, name));
    } catch {
      /* next */
    }
  }
  return null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (!MIME[ext]) {
    return new NextResponse("Not found", { status: 404 });
  }

  const fromDisk = await tryDisk(name);
  if (fromDisk) return ok(fromDisk, MIME[ext]);

  try {
    const rows = await query<{ mime: string; data: Buffer | null }>(
      `SELECT mime, data FROM media
       WHERE data IS NOT NULL
         AND (
           path = ?
           OR path = ?
           OR path LIKE ?
           OR filename = ?
         )
       ORDER BY id DESC
       LIMIT 1`,
      [`/uploads/${name}`, name, `%/${name}`, name]
    );
    const row = rows[0];
    if (row?.data) {
      const buf = Buffer.isBuffer(row.data)
        ? row.data
        : Buffer.from(row.data as unknown as ArrayBuffer);
      if (buf.length > 0) return ok(buf, row.mime || MIME[ext]);
    }
  } catch (err) {
    console.error("api/media DB serve failed:", err);
  }

  return new NextResponse("Not found", { status: 404 });
}
