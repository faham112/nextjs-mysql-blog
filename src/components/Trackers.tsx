import Script from "next/script";
const FEMANTIC_SRC = "https://analytics.globalcareerhub.org/tracker/femantic.js";
const FEMANTIC_SITE = "338df5d40fcf5eef407f9391aa7d7a2d2b3164659e8350a91d9f7e87cbd1c0a2";
export default function Trackers() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const extraSrc = process.env.NEXT_PUBLIC_TRACKER_SRC;
  const extraSite = process.env.NEXT_PUBLIC_TRACKER_SITE;
  return (
    <>
      <Script src={FEMANTIC_SRC} data-site={FEMANTIC_SITE} strategy="lazyOnload" />
      {ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="lazyOnload" />
          <Script id="ga4" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}</Script>
        </>
      ) : null}
      {plausible ? (
        <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="lazyOnload" />
      ) : null}
      {extraSrc ? (
        <Script src={extraSrc} data-site={extraSite || undefined} strategy="lazyOnload" />
      ) : null}
    </>
  );
}
