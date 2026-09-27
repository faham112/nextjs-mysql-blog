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

  // Every public page (homepage included) shares one header (with the topic menu) and footer.
  return (
    <>
      {header}
      <main className="min-h-[70vh] flex-grow">{children}</main>
      {footer}
    </>
  );
}
