import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScriptSlots from "@/components/ScriptSlots";

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
  title: {
    default: "GlobalCareerHub — Career, Skills & Study Guides",
    template: "%s · GlobalCareerHub",
  },
  description:
    "Free, practical guides on careers, skills, scholarships and studying abroad — written for students and early-career professionals.",
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "GlobalCareerHub",
    url: siteUrl,
    title: "GlobalCareerHub — Career, Skills & Study Guides",
    description:
      "Free, practical guides on careers, skills, scholarships and studying abroad.",
    images: [{ url: "/logo.svg", width: 512, height: 512, alt: "GlobalCareerHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalCareerHub",
    description: "Free guides on careers, skills and study abroad.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "GlobalCareerHub",
        url: siteUrl,
        description:
          "Free guides on careers, skills, scholarships, and study paths.",
        publisher: { "@id": `${siteUrl}/#person` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Faham Baloch",
        url: `${siteUrl}/about`,
        sameAs: ["https://github.com/faham112"],
      },
    ],
  };

  return (
    <html lang="en" className={`dark ${sans.variable} ${heading.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('gch-theme')||'dark';var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.classList.toggle('light',t==='light')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScriptSlots slot="header" />
      </head>
      <body className={`${sans.className} min-h-screen`}>
        <ScriptSlots slot="body" />
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
        <ScriptSlots slot="footer" />
      </body>
    </html>
  );
}
