import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "GlobalCareerHub", template: "%s · GlobalCareerHub" },
  description: "Guides and resources by Abdul Faheem.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession().catch(() => null);
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen font-sans">
        <SiteChrome isWriter={Boolean(user)} writerName={user?.name || "Abdul Faheem"}>
          {children}
        </SiteChrome>
        <Script
          src="https://analytics.globalcareerhub.org/tracker/femantic.js"
          data-site="338df5d40fcf5eef407f9391aa7d7a2d2b3164659e8350a91d9f7e87cbd1c0a2"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
