"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function SiteChrome({ isWriter, writerName, children }: { isWriter: boolean; writerName?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const desk = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
  if (desk) return <main className="min-h-screen bg-dark-900">{children}</main>;
  return (
    <>
      <Header isWriter={isWriter} writerName={writerName} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
