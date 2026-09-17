/** Lightweight HTML sanitizer — no extra dependency. */

const BLOCKED_TAGS =
  /<\s*\/?\s*(script|iframe|object|embed|form|link|meta|base|svg|math)(\s[^>]*)?>/gi;

const EVENT_ATTRS =
  /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;

const JS_URLS =
  /\s+(href|src|action|formaction|xlink:href)\s*=\s*(["']?)\s*javascript:[^"'\s>]*/gi;

const DATA_URLS =
  /\s+(href|src)\s*=\s*(["']?)\s*data:(?!image\/(png|jpe?g|gif|webp))[^"'\s>]*/gi;

/** Sanitize HTML for post content (allow basic formatting). */
export function sanitizeHtml(input: string): string {
  if (!input) return "";
  let out = String(input);
  out = out.replace(BLOCKED_TAGS, "");
  out = out.replace(EVENT_ATTRS, "");
  out = out.replace(JS_URLS, "");
  out = out.replace(DATA_URLS, "");
  // Remove style expressions that can carry XSS in older browsers
  out = out.replace(/expression\s*\(/gi, "");
  return out.trim();
}

/** Escape plain text for safe HTML display (comments). */
export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Only allow local /uploads paths or https URLs. */
export function sanitizeImageUrl(input: unknown): string | null {
  if (input == null || input === "") return null;
  const url = String(input).trim();
  if (url.startsWith("/uploads/")) {
    // prevent path traversal
    if (url.includes("..") || url.includes("//")) return null;
    return url.slice(0, 500);
  }
  if (url.startsWith("/covers/") || url.startsWith("/logo")) {
    return url.slice(0, 500);
  }
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString().slice(0, 500);
  } catch {
    return null;
  }
}
