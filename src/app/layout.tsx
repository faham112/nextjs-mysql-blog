import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";
export const metadata: Metadata = {
  title: { default: "Global Career Hub", template: "%s \u00b7 Global Career Hub" },
  description: "Career guides and practical writing by Abdul Faheem.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org"),
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession().catch(() => null);
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Header isWriter={Boolean(user)} writerName={user?.name || "Abdul Faheem"} />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
