import { NextResponse } from "next/server";
import { createSession, findUserByEmail, hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    if (!name || !email || password.length < 8) {
      return NextResponse.json({ error: "Name, email, and 8+ character password required" }, { status: 400 });
    }
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    if (adminEmail && email === adminEmail) {
      return NextResponse.json({ error: "This email is reserved for the site admin." }, { status: 403 });
    }
    if (await findUserByEmail(email)) {
      return NextResponse.json({ error: "An account already exists for this email. Log in instead." }, { status: 409 });
    }
    await query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'editor')", [name, email, await hashPassword(password)]);
    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ error: "Could not create account" }, { status: 500 });
    await createSession({ id: user.id, name: user.name, email: user.email, role: "editor" });
    return NextResponse.json({ ok: true, role: "editor" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
