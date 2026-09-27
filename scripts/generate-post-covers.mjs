/**
 * Generates one branded 1200x630 cover per post from scripts/post-covers.json:
 *   public/covers/posts/<slug>.png  (Open Graph / social)
 *   public/covers/posts/<slug>.webp (page display)
 * and src/lib/postCovers.generated.ts (slug -> alt text), which resolveCover() reads.
 * Files are committed to git, so they survive Hostinger redeploys.
 *
 * Usage: node scripts/generate-post-covers.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "scripts/post-covers.json"), "utf8"));
const outDir = path.join(root, "public/covers/posts");
fs.mkdirSync(outDir, { recursive: true });

const W = 1200, H = 630;
const COLORS = {
  applications: ["#1e1b4b", "#6d28d9", "#c4b5fd"],
  careers: ["#0f172a", "#be123c", "#fda4af"],
  lifestyle: ["#042f2e", "#0f766e", "#99f6e4"],
  scholarships: ["#1c1917", "#b45309", "#fcd34d"],
  skills: ["#0b1437", "#1d4ed8", "#93c5fd"],
  "study-abroad": ["#022c22", "#047857", "#6ee7b7"],
  technology: ["#082f49", "#0e7490", "#67e8f9"],
  tutorials: ["#1e1b4b", "#4338ca", "#a5b4fc"],
};

// Simple 24x24 stroke icons (drawn for this project).
const ICONS = {
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 9v11M15 9v11"/>',
  checklist: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3"/><path d="m8 10 1.5 1.5L12 9M8 16l1.5 1.5L12 15M14 10.5h2M14 16.5h2"/>',
  robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="13" r="1.3"/><circle cx="15" cy="13" r="1.3"/><path d="M9 17h6M2 13v3M22 13v3"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 13h8M8 16h5"/>',
  portfolio: '<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="6" y="7" width="5" height="5"/><rect x="13" y="7" width="5" height="5"/><path d="M6 15h12M6 17.5h8"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18M11 13v2h2v-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/><path d="M12 12v5M10 15l2 2 2-2"/>',
  chat: '<path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-4-3h-3"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5L16 9.5"/>',
  chart: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/>',
  megaphone: '<path d="M3 10v4a1 1 0 0 0 1 1h3l8 5V4L7 9H4a1 1 0 0 0-1 1z"/><path d="M7 15l1.5 5h2L10 16M18 9a4 4 0 0 1 0 6"/>',
  laptop: '<rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M2 19h20l-2-4H4z"/><path d="m9 8-2 2 2 2M15 8l2 2-2 2"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a2 2 0 0 0-2 1 2 2 0 0 0-2-1H4z"/><path d="M12 5v15M7 8h2M7 11h2M15 8h2M15 11h2"/>',
  pen: '<path d="M16 3l5 5L9 20H4v-5z"/><path d="m13.5 5.5 5 5M4 20l4-1"/><path d="M14 21h7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m8 15 2 2 4-4"/>',
  certificate: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M7 8h10M7 11h6"/><circle cx="16" cy="16" r="3"/><path d="m14.5 18.5-1 3.5 2.5-1.5 2.5 1.5-1-3.5"/>',
  stamp: '<path d="M9 3h6v5l-1 4h-4L9 8z"/><path d="M4 16a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2H4z"/><path d="M5 21h14"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/><circle cx="12" cy="12" r="0.8"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5.5 5.5M8 10.5h5M10.5 8v5"/>',
  heart: '<path d="M12 20s-7.5-4.6-9-9.2C1.8 7 4 4 7.2 4c2 0 3.6 1.2 4.8 3 1.2-1.8 2.8-3 4.8-3C20 4 22.2 7 21 10.8 19.5 15.4 12 20 12 20z"/><path d="M6.5 11h3l1.5-2.5 2 5 1.5-2.5h3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><rect x="15.5" y="2.5" width="6" height="4" rx="1"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5M3 17l9 5 9-5"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.5"/><path d="M12 17v1.5"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4.5M12 17.2v.3"/>',
  video: '<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3z"/><path d="m8 9 4 3-4 3z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  calculator: '<rect x="5" y="2" width="14" height="20" rx="2"/><rect x="8" y="5" width="8" height="4"/><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"/>',
  grad: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Rough Poppins width estimate (em per char) for wrapping.
function textWidth(str, size, bold) {
  let w = 0;
  for (const ch of str) {
    if ("il.,:;'|!".includes(ch)) w += 0.28;
    else if ("fjrt()-".includes(ch)) w += 0.38;
    else if (ch === " ") w += 0.27;
    else if ("mwMW".includes(ch)) w += 0.88;
    else if (ch >= "A" && ch <= "Z") w += 0.68;
    else if (ch >= "0" && ch <= "9") w += 0.6;
    else w += 0.57;
  }
  return w * size * (bold ? 1.04 : 1);
}
function wrap(str, size, maxW, bold, maxLines) {
  const words = str.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (textWidth(t, size, bold) <= maxW) cur = t;
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s+\S*$/, "") + "…";
    return kept;
  }
  return lines;
}
function fitPhrase(phrase, maxW) {
  for (const size of [76, 70, 64, 58, 52, 48]) {
    const lines = wrap(phrase, size, maxW, true, 3);
    if (lines.length <= (size >= 64 ? 2 : 3) && !lines.join(" ").includes("…")) return { size, lines };
  }
  return { size: 46, lines: wrap(phrase, 46, maxW, true, 3) };
}

function svgFor(p) {
  const [dark, mid, light] = COLORS[p.category] || COLORS.careers;
  const textMaxW = 660;
  const { size, lines } = fitPhrase(p.phrase, textMaxW);
  const lh = Math.round(size * 1.12);
  const pillText = p.categoryName.toUpperCase();
  const pillW = Math.round(textWidth(pillText, 20, true) * 1.12 + 44);
  let y = 150;
  const phraseSvg = lines
    .map((l, i) => `<text x="72" y="${y + size + i * lh}" font-family="Poppins" font-weight="700" font-size="${size}" fill="#ffffff">${esc(l)}</text>`)
    .join("");
  y = y + size + (lines.length - 1) * lh + 38;
  const underline = `<rect x="72" y="${y}" width="120" height="8" rx="4" fill="${light}"/>`;
  y += 56;
  const tLines = wrap(p.title, 26, textMaxW, false, 2);
  const titleSvg = tLines
    .map((l, i) => `<text x="72" y="${y + i * 36}" font-family="Poppins" font-weight="400" font-size="26" fill="#e2e8f0" fill-opacity="0.92">${esc(l)}</text>`)
    .join("");
  const icon = ICONS[p.icon] || ICONS.check;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#ffffff" fill-opacity="0.08"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect x="760" y="0" width="440" height="${H}" fill="url(#dots)"/>
<circle cx="975" cy="300" r="250" fill="url(#glow)"/>
<circle cx="975" cy="300" r="170" fill="#ffffff" fill-opacity="0.10" stroke="${light}" stroke-opacity="0.55" stroke-width="3"/>
<circle cx="975" cy="300" r="205" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="6 12"/>
<g transform="translate(${975 - 12 * 8.5} ${300 - 12 * 8.5}) scale(8.5)" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
<rect x="72" y="72" width="${pillW}" height="44" rx="22" fill="${light}"/>
<text x="${72 + 22}" y="101" font-family="Poppins" font-weight="700" font-size="20" letter-spacing="2" fill="${dark}">${esc(pillText)}</text>
${phraseSvg}
${underline}
${titleSvg}
<rect x="0" y="${H - 84}" width="${W}" height="84" fill="#000000" fill-opacity="0.28"/>
<g transform="translate(72 ${H - 60})">
  <circle cx="18" cy="18" r="18" fill="#e11d48"/>
  <circle cx="18" cy="18" r="9" fill="none" stroke="#ffffff" stroke-width="2.5"/>
  <path d="M9 18h18M18 9c3 3 3 15 0 18M18 9c-3 3-3 15 0 18" fill="none" stroke="#ffffff" stroke-width="1.6"/>
  <text x="50" y="27" font-family="Poppins" font-weight="700" font-size="26" fill="#ffffff">GlobalCareerHub</text>
</g>
<text x="${W - 72}" y="${H - 33}" text-anchor="end" font-family="Poppins" font-weight="500" font-size="20" fill="#e2e8f0">globalcareerhub.org</text>
</svg>`;
}

const manifest = {};
for (const p of data) {
  const svg = Buffer.from(svgFor(p));
  const png = path.join(outDir, `${p.slug}.png`);
  const webp = path.join(outDir, `${p.slug}.webp`);
  await sharp(svg).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(png);
  await sharp(svg).webp({ quality: 82 }).toFile(webp);
  manifest[p.slug] = p.alt;
}

const ts = `/* AUTO-GENERATED by scripts/generate-post-covers.mjs — do not edit by hand. */
/** Posts that have a branded cover in public/covers/posts/<slug>.(png|webp), with alt text. */
export const POST_COVERS: Record<string, string> = ${JSON.stringify(manifest, null, 2)};
`;
fs.writeFileSync(path.join(root, "src/lib/postCovers.generated.ts"), ts);
console.log(`Generated ${data.length} covers in public/covers/posts`);

// Responsive 480/768/960px variants + ?v= cache-busting hashes for the new covers.
await import("./generate-cover-variants.mjs");
