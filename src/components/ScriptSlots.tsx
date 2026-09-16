import { getScripts } from "@/lib/settings";
export default async function ScriptSlots({ slot }: { slot: "header" | "body" | "footer" }) {
  const scripts = await getScripts();
  const html = scripts[slot];
  if (!html.trim()) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
