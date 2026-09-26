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

function toResponse(data: Buffer | Uint8Array, contentType: string) {
  const bytes = Buffer.isBuffer(data)
    ? data
    : Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  // Blob is a valid BodyInit and avoids Buffer/Uint8Array typing issues on Next 15
  const blob = new Blob([bytes], { type: contentType });
  return new NextResponse(blob, {
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

  // 1) Disk
  try {
    const full = path.join(process.cwd(), "public", "uploads", name);
    const buf = await readFile(full);
    return toResponse(buf, MIME[ext]);
  } catch {
    // continue to DB
  }

  // 2) MySQL blob
  try {
    const rows = await query<MediaRow>(
      `SELECT mime, data FROM media WHERE path = :path OR path = :path2 LIMIT 1`,
      { path: `/uploads/${name}`, path2: name }
    );
    const row = rows[0];
    if (row?.data) {
      return toResponse(row.data as Buffer, row.mime || MIME[ext]);
    }
  } catch (err) {
    console.error("media serve failed:", err);
  }

  return new NextResponse("Not found", { status: 404 });
}
