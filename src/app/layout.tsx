import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScriptSlots from "@/components/ScriptSlots";
import CookieConsent from "@/components/CookieConsent";
import { DEFAULT_OG_IMAGE } from "@/lib/covers";
import { AUTHOR_NAME, organizationJsonLd, personJsonLd, websiteJsonLd } from "@/lib/schema";

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

/** AdSense publisher ID (digits only) from env; enables the verification meta + ad script. */
const adsensePub = (process.env.ADSENSE_PUB_ID || "").replace(/\D/g, "");
const adsenseClient = adsensePub.length >= 10 ? `ca-pub-${adsensePub}` : "";

/** EEA + UK + CH: Google Consent Mode defaults to "denied" here until the reader accepts. */
const CONSENT_REGIONS = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL",
  "PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH",
];
const consentDefaults = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=window.gtag||gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500,region:${JSON.stringify(CONSENT_REGIONS)}});
gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
try{var c=localStorage.getItem('gch-consent');if(c==='granted'||c==='denied'){gtag('consent','update',{ad_storage:c,ad_user_data:c,ad_personalization:c,analytics_storage:c})}}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "GlobalCareerHub — Career, Skills & Study Guides", template: "%s · GlobalCareerHub" },
  description: "Free guides on careers, skills, scholarships, and study.",
  keywords: ["career guides", "scholarships", "skills", "study abroad", "Global Career Hub"],
  authors: [{ name: AUTHOR_NAME, url: "/about" }],
  creator: AUTHOR_NAME,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GlobalCareerHub",
    title: "GlobalCareerHub — Career, Skills & Study Guides",
    description: "Free guides on careers, skills, scholarships, and study.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "GlobalCareerHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalCareerHub",
    description: "Free career, skills, and study guides.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [organizationJsonLd(), personJsonLd(), websiteJsonLd()];
  return (
    <html lang="en" className={`dark ${sans.variable} ${heading.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('gch-theme')||'dark';var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.classList.toggle('light',t==='light')}catch(e){}`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: consentDefaults }} />
        {adsenseClient ? (
          <>
            <meta name="google-adsense-account" content={adsenseClient} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
              crossOrigin="anonymous"
            />
          </>
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ScriptSlots slot="header" />
      </head>
      <body className={`${sans.className} min-h-screen`}>
        <ScriptSlots slot="body" />
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
        <ScriptSlots slot="footer" />
        <CookieConsent />
      </body>
    </html>
  );
}
