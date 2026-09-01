import { NextResponse } from "next/server";
import { createSession, ensureAdminUser, findUserByEmail, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await ensureAdminUser();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const user = await findUserByEmail(String(email).toLowerCase().trim());
    if (!user || !(await verifyPassword(String(password), user.password_hash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error(error);
    return NextResponse.json(
      {
        error:
          message.includes("ER_") || message.toLowerCase().includes("table")
            ? "Database tables missing. Import schema.sql in phpMyAdmin."
            : message,
      },
      { status: 500 }
    );
  }
}
