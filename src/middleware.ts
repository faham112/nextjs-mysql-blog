import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "blog_session";

async function sessionFrom(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret || secret.length < 16) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return {
      email: String(payload.email || ""),
      role: payload.role === "editor" ? "editor" : "admin",
    };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();
  if (host === "www.globalcareerhub.org") {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.host = "globalcareerhub.org";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = req.nextUrl;
  if (pathname.endsWith(".map")) {
    return new NextResponse("Not found", { status: 404 });
  }
  const user = await sessionFrom(req);

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (user.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/|logo.svg).*)",
  ],
};
