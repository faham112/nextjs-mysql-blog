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

function toBody(data: Buffer | Uint8Array): Uint8Array {
  if (data instanceof Uint8Array && !(data instanceof Buffer)) {
    return data;
  }
  // Copy into a plain ArrayBuffer-backed Uint8Array for BodyInit typing
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
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
    return new NextResponse(toBody(buf), {
      status: 200,
      headers: {
        "Content-Type": MIME[ext],
        "Cache-Control": "public, max-age=2592000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
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
      return new NextResponse(toBody(row.data as Buffer), {
        status: 200,
        headers: {
          "Content-Type": row.mime || MIME[ext],
          "Cache-Control": "public, max-age=2592000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  } catch (err) {
    console.error("media serve failed:", err);
  }

  return new NextResponse("Not found", { status: 404 });
}
