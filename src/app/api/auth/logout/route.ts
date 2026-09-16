import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";
  return NextResponse.redirect(new URL("/", base), { status: 302 });
}
