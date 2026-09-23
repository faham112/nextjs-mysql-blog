const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";

export const SITE_NAME = "Global Career Hub";
export const SITE_ALT = "GlobalCareerHub";
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
  published_at?: string | Date | null;
  updated_at?: string | Date | null;
  author_name?: string | null;
}) {
  const url = `${siteUrl}/posts/${post.slug}`;
  const img = post.featured_image
    ? post.featured_image.startsWith("http")
      ? post.featured_image
      : `${siteUrl}${post.featured_image}`
    : undefined;
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
      name: post.author_name || AUTHOR_NAME,
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
