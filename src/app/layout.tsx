import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScriptSlots from "@/components/ScriptSlots";
import CookieConsent from "@/components/CookieConsentLazy";
import { DEFAULT_OG_IMAGE } from "@/lib/covers";
import { AUTHOR_NAME, organizationJsonLd, personJsonLd, websiteJsonLd } from "@/lib/schema";
import { GA_ID } from "@/lib/analytics";

// Self-hosted variable fonts (latin subset, from Google Fonts, OFL) committed in ./fonts.
// next/font/google downloads the fonts during `next build`; on Hostinger that fetch failed
// intermittently ("An error occurred in `next/font`"), which failed whole deploys.
// Metric-matched fallbacks are declared in globals.css (gch-*-fallback) with several local()
// sources, so the first layout never has to fall through to generic system fonts
// (next/font's own fallback only tries local("Arial"), which Linux often lacks — that
// cost ~100 ms of layout in Lighthouse's headless Chrome).
const sans = localFont({
  src: "./fonts/plus-jakarta-sans-latin-var.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: false,
  fallback: ["gch-sans-fallback", "system-ui", "sans-serif"],
});

const heading = localFont({
  src: "./fonts/space-grotesk-latin-var.woff2",
  weight: "300 700",
  style: "normal",
  display: "swap",
  variable: "--font-heading",
  adjustFontFallback: false,
  fallback: ["gch-heading-fallback", "system-ui", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";

/** AdSense publisher ID (digits only). Env wins; fallback is the public publisher ID. */
const adsensePub = (process.env.ADSENSE_PUB_ID || "3998955628932160").replace(/\D/g, "");
const adsenseClient = adsensePub.length >= 10 ? `ca-pub-${adsensePub}` : "";

/** EEA + UK + CH: Google Consent Mode defaults to "denied" here until the reader accepts. */
const CONSENT_REGIONS = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL",
  "PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH",
];
const gaConfig = `gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)});`;

/**
 * Mobile performance: gtag.js (~75 KB) and adsbygoogle.js (+ its ~120 KB "show_ads" bundle) used to
 * load from <head> and competed with the LCP cover image and hydration on slow phones (they were
 * most of the page's main-thread time and "unused JavaScript"). They now load on the reader's first
 * interaction (scroll / touch / key / mouse), or shortly after the page has loaded if there is none.
 * gtag() calls made before then (consent defaults, config) are queued in dataLayer and replayed, so
 * page views and Consent Mode still work; AdSense Auto ads run as soon as adsbygoogle.js arrives.
 */
const GA_SRC = GA_ID ? `https://www.googletagmanager.com/gtag/js?id=${GA_ID}` : "";
const ADS_SRC = adsenseClient
  ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`
  : "";
const thirdPartyLoader = `(function(){var done=0,ev=['scroll','pointerdown','touchstart','keydown','mousemove','wheel'];
function add(src,co){if(!src)return;var s=document.createElement('script');s.async=true;s.src=src;if(co)s.crossOrigin='anonymous';document.head.appendChild(s)}
function go(){if(done)return;done=1;ev.forEach(function(e){removeEventListener(e,go,{passive:true})});add(${JSON.stringify(GA_SRC)});add(${JSON.stringify(ADS_SRC)},1)}
ev.forEach(function(e){addEventListener(e,go,{passive:true,once:true})});
function idle(){setTimeout(function(){(window.requestIdleCallback||function(f){f()})(go,{timeout:2000})},3500)}
if(document.readyState==='complete')idle();else addEventListener('load',idle,{once:true})})();`;

const consentDefaults = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=window.gtag||gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500,region:${JSON.stringify(CONSENT_REGIONS)}});
gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
try{var c=localStorage.getItem('gch-consent');if(c==='denied'){try{localStorage.setItem('gch-consent','essential')}catch(e){}c='essential'}if(c==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'})}else if(c==='essential'){gtag('consent','update',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'})}}catch(e){}`;

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
        {GA_ID ? <script dangerouslySetInnerHTML={{ __html: gaConfig }} /> : null}
        {adsenseClient ? <meta name="google-adsense-account" content={adsenseClient} /> : null}
        {GA_ID || adsenseClient ? <script dangerouslySetInnerHTML={{ __html: thirdPartyLoader }} /> : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ScriptSlots slot="header" />
      </head>
      <body className={`${sans.className} min-h-screen`}>
        <ScriptSlots slot="body" />
        <ThemeProvider>
          <SiteChrome header={<SiteHeader />} footer={<Footer />}>
            {children}
          </SiteChrome>
        </ThemeProvider>
        <ScriptSlots slot="footer" />
        <CookieConsent />
      </body>
    </html>
  );
}
