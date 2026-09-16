import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import Trackers from "@/components/Trackers";
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--font-sans" });
const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], display: "swap", variable: "--font-heading" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "GlobalCareerHub — Career, Skills & Study Guides", template: "%s · GlobalCareerHub" },
  description: "Free guides on careers, skills, scholarships, and study.",
  keywords: ["career guides", "scholarships", "skills", "study abroad", "Faham Baloch", "Global Career Hub"],
  authors: [{ name: "Faham Baloch" }],
  creator: "Faham Baloch",
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: siteUrl, siteName: "GlobalCareerHub", title: "GlobalCareerHub — Career, Skills & Study Guides", description: "Free guides on careers, skills, scholarships, and study." },
  twitter: { card: "summary_large_image", title: "GlobalCareerHub", description: "Free career, skills, and study guides." },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: "GlobalCareerHub", url: siteUrl, potentialAction: { "@type": "SearchAction", target: `${siteUrl}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } };
  return (
    <html lang="en" className={`dark ${sans.variable} ${heading.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('gch-theme')||'dark';var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.classList.toggle('light',t==='light')}catch(e){}` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${sans.className} min-h-screen`}>
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
        <Trackers />
      </body>
    </html>
  );
}
