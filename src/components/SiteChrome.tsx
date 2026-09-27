"use client";
import { usePathname } from "next/navigation";

/**
 * Picks the chrome for the current route. Header/Footer are passed in from the (server)
 * root layout as slots, so the Footer stays a server component and ships no client JS.
 */
export default function SiteChrome({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const desk =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
  const homeEditorial = pathname === "/";

  if (desk) {
    return (
      <main
        className="min-h-screen"
        style={{ background: "var(--bg)", color: "var(--fg)" }}
      >
        {children}
      </main>
    );
  }

  // Homepage uses editorial chrome; all other public pages (posts, articles, etc.) get Header + Footer
  if (homeEditorial) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="min-h-[70vh] flex-grow">{children}</main>
      {footer}
    </>
  );
}
