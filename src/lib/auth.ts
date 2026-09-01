import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { query } from "./db";

const COOKIE = "blog_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    throw new Error("AUTH_SECRET must be set and at least 16 characters.");
  }
  return new TextEncoder().encode(value);
}

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor";
};

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: Number(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role === "editor" ? "editor" : "admin",
    };
  } catch {
    return null;
  }
}

type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "editor";
};

export async function findUserByEmail(email: string) {
  const rows = await query<UserRow>(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] ?? null;
}

export async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing in environment variables.");
  }

  const existing = await findUserByEmail(email);
  const password_hash = await hashPassword(password);

  if (existing) {
    await query("UPDATE users SET name = ?, password_hash = ? WHERE id = ?", [
      "Abdul Faheem",
      password_hash,
      existing.id,
    ]);
    return;
  }

  await query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')", [
    "Abdul Faheem",
    email,
    password_hash,
  ]);
}
