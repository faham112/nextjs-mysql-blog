import { getScripts } from "@/lib/settings";
import InjectHtml from "@/components/InjectHtml";
export default async function ScriptSlots({ slot }: { slot: "header" | "body" | "footer" }) {
  const scripts = await getScripts();
  const html = scripts[slot];
  if (!html.trim()) return null;
  const where = slot === "header" ? "head" : slot === "body" ? "body-start" : "body-end";
  return <InjectHtml html={html} where={where} />;
}
