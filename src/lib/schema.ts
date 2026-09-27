import { ogCover } from "@/lib/covers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";

export const SITE_NAME = "Global Career Hub";
export const SITE_ALT = "GlobalCareerHub";
/** Public author name used across the site (templates override the DB users.name). */
export const AUTHOR_NAME = "Faham Baloch";

export function orgId() {
  return `${siteUrl}/#organization`;
}

export function personId() {
  return `${siteUrl}/about#person`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId(),
    name: SITE_NAME,
    alternateName: SITE_ALT,
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description:
      "Independent reading site with guides on careers, skills, scholarships and study routes. Not a recruitment or visa agency.",
    email: "admin@globalcareerhub.org",
    founder: { "@id": personId() },
    sameAs: ["https://github.com/faham112/nextjs-mysql-blog"],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(),
    name: AUTHOR_NAME,
    url: `${siteUrl}/about`,
    jobTitle: "Editor",
    description:
      "Writes and edits Global Career Hub — practical guides on careers, skills, scholarships and study routes.",
    worksFor: { "@id": orgId() },
    email: "admin@globalcareerhub.org",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_ALT,
    url: siteUrl,
    publisher: { "@id": orgId() },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  category_slug?: string | null;
  published_at?: string | Date | null;
  updated_at?: string | Date | null;
  author_name?: string | null;
}) {
  const url = `${siteUrl}/posts/${post.slug}`;
  const img = ogCover(post.featured_image, post.category_slug, siteUrl, post.slug);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: (post.excerpt || post.title).slice(0, 160),
    url,
    mainEntityOfPage: url,
    image: img ? [img] : undefined,
    datePublished: post.published_at ? new Date(post.published_at).toISOString() : undefined,
    dateModified: post.updated_at
      ? new Date(post.updated_at).toISOString()
      : post.published_at
        ? new Date(post.published_at).toISOString()
        : undefined,
    author: {
      "@type": "Person",
      "@id": personId(),
      name: AUTHOR_NAME,
      url: `${siteUrl}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": orgId(),
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.svg` },
    },
  };
}

/* ---------- FAQ + breadcrumb structured data ---------- */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "\u2019", lsquo: "\u2018", ldquo: "\u201c", rdquo: "\u201d",
  ndash: "\u2013", mdash: "\u2014", hellip: "\u2026",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED_ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** HTML fragment -> plain text (block ends become spaces, whitespace collapsed). */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|li|h[1-6]|div|tr)>/gi, " ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();
}

export type FaqItem = { question: string; answer: string };

/**
 * Pull Q&A pairs out of an article's "Frequently asked questions" section:
 * the <h2> whose text starts with "Frequently asked questions" / "FAQ", then each
 * <h3> (question) followed by its answer HTML up to the next <h3> or <h2>.
 * No DB field needed; editors just keep the FAQ as H2 + H3/paragraph pairs.
 */
export function extractFaqs(html: string | null | undefined): FaqItem[] {
  if (!html) return [];
  const h2 = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  let start = -1;
  let m: RegExpExecArray | null;
  while ((m = h2.exec(html))) {
    if (/^(frequently asked questions|faqs?)\b/i.test(htmlToText(m[1]))) {
      start = m.index + m[0].length;
      break;
    }
  }
  if (start < 0) return [];
  const rest = html.slice(start);
  const next = rest.search(/<h2\b/i);
  const section = next >= 0 ? rest.slice(0, next) : rest;
  const h3 = /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi;
  const heads: { q: string; end: number; idx: number }[] = [];
  while ((m = h3.exec(section))) heads.push({ q: htmlToText(m[1]), idx: m.index, end: m.index + m[0].length });
  return heads
    .map((h, i) => ({
      question: h.q,
      answer: htmlToText(section.slice(h.end, i + 1 < heads.length ? heads[i + 1].idx : section.length)),
    }))
    .filter((f) => f.question && f.answer);
}

export function faqJsonLd(html: string | null | undefined, slug: string) {
  const faqs = extractFaqs(html);
  if (faqs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/posts/${slug}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(post: {
  title: string;
  slug: string;
  category_name?: string | null;
  category_slug?: string | null;
}) {
  const items: { name: string; item: string }[] = [{ name: "Home", item: `${siteUrl}/` }];
  if (post.category_slug && post.category_name) {
    items.push({ name: post.category_name, item: `${siteUrl}/category/${post.category_slug}` });
  } else {
    items.push({ name: "Articles", item: `${siteUrl}/articles` });
  }
  items.push({ name: post.title, item: `${siteUrl}/posts/${post.slug}` });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.item })),
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so content can't close the tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
