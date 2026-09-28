/** GA4 Measurement ID. Rendered natively in the root layout right after the Consent Mode defaults,
 *  so page views fire on first load instead of after hydration. Override with NEXT_PUBLIC_GA_ID. */
export const GA_ID = (process.env.NEXT_PUBLIC_GA_ID || "G-T6M9L9BRWD").trim();
