"use client";
import { useEffect } from "react";
function runNodes(html: string, where: "head" | "body-start" | "body-end") {
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  for (const node of Array.from(wrap.childNodes)) {
    if (node.nodeName === "SCRIPT") {
      const src = node as HTMLScriptElement;
      const script = document.createElement("script");
      for (const attr of Array.from(src.attributes)) script.setAttribute(attr.name, attr.value);
      script.text = src.text;
      if (where === "head") document.head.appendChild(script);
      else if (where === "body-start") document.body.insertBefore(script, document.body.firstChild);
      else document.body.appendChild(script);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (where === "head") document.head.appendChild(el);
      else if (where === "body-start") document.body.insertBefore(el, document.body.firstChild);
      else document.body.appendChild(el);
    }
  }
}
export default function InjectHtml({ html, where }: { html: string; where: "head" | "body-start" | "body-end" }) {
  useEffect(() => {
    if (!html.trim()) return;
    runNodes(html, where);
  }, [html, where]);
  return null;
}
