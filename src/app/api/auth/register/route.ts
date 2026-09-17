import { NextResponse } from "next/server";

/** Public registration disabled for security. Admins are created via env on first login. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Public registration is disabled. Contact the site admin for access.",
    },
    { status: 403 }
  );
}
