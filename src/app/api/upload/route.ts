import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`upload:${user.id}:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Upload limit reached. Try again later." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, or GIF allowed (no SVG)" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 4 MB)" },
      { status: 400 }
    );
  }

  const ext =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "gif";

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Best-effort disk write (may be wiped on Hostinger redeploy)
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, safeName), buffer);
  } catch (err) {
    console.error("disk write failed (continuing with DB storage):", err);
  }

  const url = `/uploads/${safeName}`;

  // Primary storage: MySQL (survives redeploy)
  try {
    await query(
      `INSERT INTO media (filename, path, mime, size, data, uploaded_by)
       VALUES (:filename, :path, :mime, :size, :data, :uploaded_by)`,
      {
        filename: (file.name || safeName).slice(0, 255),
        path: url,
        mime: file.type,
        size: file.size,
        data: buffer,
        uploaded_by: user.id,
      }
    );
  } catch (err) {
    // Fallback without blob column if migration not run yet
    console.error("media insert with data failed, trying without blob:", err);
    try {
      await query(
        `INSERT INTO media (filename, path, mime, size, uploaded_by)
         VALUES (:filename, :path, :mime, :size, :uploaded_by)`,
        {
          filename: (file.name || safeName).slice(0, 255),
          path: url,
          mime: file.type,
          size: file.size,
          uploaded_by: user.id,
        }
      );
    } catch (err2) {
      console.error("media insert failed:", err2);
      return NextResponse.json(
        {
          error:
            "Could not save image to database. Run migrations/media_blob.sql in phpMyAdmin.",
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true, url });
}
