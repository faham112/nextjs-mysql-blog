import { NextResponse } from "next/server";
import { createSession, ensureAdminUser, findUserByEmail, verifyPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    await ensureAdminUser();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }
    const user = await findUserByEmail(String(email).toLowerCase().trim());
    if (!user || !(await verifyPassword(String(password), user.password_hash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
