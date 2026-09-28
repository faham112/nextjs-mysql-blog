import { getScripts } from "@/lib/settings";
import InjectHtml from "@/components/InjectHtml";
import { GA_ID } from "@/lib/analytics";

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Drop admin tracker snippets that load the GA4 tag the layout already renders natively
 *  (the same gtag.js snippet was saved in both the header and body slots, which double-counted). */
function withoutNativeGa(html: string): string {
  if (!GA_ID || !html.includes(GA_ID)) return html;
  const id = escapeRe(GA_ID);
  const tag = new RegExp(
    String.raw`(<!--\s*Google tag \(gtag\.js\)\s*-->\s*)?<script[^>]*gtag/js\?id=` +
      id +
      String.raw`[^>]*>\s*</script>\s*<script>[\s\S]*?gtag\(\s*['"]config['"]\s*,\s*['"]` +
      id +
      String.raw`['"][\s\S]*?</script>`,
    "gi"
  );
  return html.replace(tag, "");
}

export default async function ScriptSlots({ slot }: { slot: "header" | "body" | "footer" }) {
  const scripts = await getScripts();
  const html = withoutNativeGa(scripts[slot]);
  if (!html.trim()) return null;
  const where = slot === "header" ? "head" : slot === "body" ? "body-start" : "body-end";
  return <InjectHtml html={html} where={where} />;
}
