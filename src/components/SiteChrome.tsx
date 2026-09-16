"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const desk = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
  if (desk) return <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)" }}>{children}</main>;
  return (<><Header /><main className="flex-grow">{children}</main><Footer /></>);
}
