import { listPublishedFeedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org").replace(/\/$/, "");

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed of the latest published posts (also the target of old /feed URLs). */
export async function GET() {
  let posts: Awaited<ReturnType<typeof listPublishedFeedPosts>> = [];
  try {
    posts = await listPublishedFeedPosts(30);
  } catch (e) {
    console.error(e);
  }
  const items = posts
    .map((p) => {
      const url = `${siteUrl}/posts/${p.slug}`;
      const date = new Date(p.published_at || p.created_at || Date.now()).toUTCString();
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      ${p.category_name ? `<category>${esc(p.category_name)}</category>` : ""}
      <description>${esc(p.excerpt || p.title)}</description>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GlobalCareerHub</title>
    <link>${siteUrl}/</link>
    <description>Free guides on careers, skills, scholarships, and study.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
