import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { query } from "@/lib/db";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

type MediaRow = {
  mime: string;
  data: Buffer | Uint8Array | null;
};

/** Copy bytes into a plain ArrayBuffer so TS accepts BodyInit / BlobPart. */
function toUint8Array(data: Buffer | Uint8Array): Uint8Array {
  const src = Buffer.isBuffer(data)
    ? data
    : Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  const out = new Uint8Array(src.byteLength);
  out.set(src);
  return out;
}

function imageResponse(data: Buffer | Uint8Array, contentType: string) {
  const body = toUint8Array(data);
  return new NextResponse(body as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=2592000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
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

  try {
    const full = path.join(process.cwd(), "public", "uploads", name);
    const buf = await readFile(full);
    return imageResponse(buf, MIME[ext]);
  } catch {
    // fall through to DB
  }

  try {
    const rows = await query<MediaRow>(
      `SELECT mime, data FROM media WHERE path = :path OR path = :path2 LIMIT 1`,
      { path: `/uploads/${name}`, path2: name }
    );
    const row = rows[0];
    if (row?.data) {
      return imageResponse(row.data as Buffer, row.mime || MIME[ext]);
    }
  } catch (err) {
    console.error("media serve failed:", err);
  }

  return new NextResponse("Not found", { status: 404 });
}
