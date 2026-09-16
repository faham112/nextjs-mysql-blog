import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "GlobalCareerHub — Career, Skills & Study Guides", template: "%s · GlobalCareerHub" },
  description: "Free guides on careers, skills, scholarships, and study by Abdul Faheem.",
  keywords: ["career guides", "scholarships", "skills", "study abroad", "Abdul Faheem", "Global Career Hub"],
  authors: [{ name: "Abdul Faheem" }],
  creator: "Abdul Faheem",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "GlobalCareerHub",
    title: "GlobalCareerHub — Career, Skills & Study Guides",
    description: "Free guides on careers, skills, scholarships, and study by Abdul Faheem.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalCareerHub",
    description: "Free career, skills, and study guides by Abdul Faheem.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GlobalCareerHub",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen font-sans">
        <SiteChrome>{children}</SiteChrome>
        <Script src="https://analytics.globalcareerhub.org/tracker/femantic.js" data-site="338df5d40fcf5eef407f9391aa7d7a2d2b3164659e8350a91d9f7e87cbd1c0a2" strategy="afterInteractive" />
      </body>
    </html>
  );
}
