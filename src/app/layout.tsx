import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Global Career Hub",
    template: "%s \u00b7 Global Career Hub",
  },
  description: "Career guides, jobs insight, and practical tutorials by Abdul Faheem.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
