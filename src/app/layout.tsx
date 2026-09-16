import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

const heading = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-heading",
});

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
    <html lang="en" className={`${sans.variable} ${heading.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${sans.className} min-h-screen`}>
        <SiteChrome>{children}</SiteChrome>
        <Script
          src="https://analytics.globalcareerhub.org/tracker/femantic.js"
          data-site="338df5d40fcf5eef407f9391aa7d7a2d2b3164659e8350a91d9f7e87cbd1c0a2"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
