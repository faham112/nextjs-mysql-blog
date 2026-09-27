import Header, { type NavCategory } from "@/components/Header";
import { listCategories } from "@/lib/categories";
import { orderCategories } from "@/components/home/TopicSections";

/** Used when the DB is unreachable (e.g. a build without DB access): names only, no counts. */
const FALLBACK: NavCategory[] = [
  { name: "Careers", slug: "careers", count: null },
  { name: "Scholarships", slug: "scholarships", count: null },
  { name: "Study Abroad", slug: "study-abroad", count: null },
  { name: "Skills", slug: "skills", count: null },
  { name: "Applications", slug: "applications", count: null },
  { name: "Technology", slug: "technology", count: null },
  { name: "Tutorials", slug: "tutorials", count: null },
];

/** Server wrapper: loads the topic menu (with published-guide counts) for the client header. */
export default async function SiteHeader() {
  let categories = FALLBACK;
  try {
    const rows = await listCategories();
    const withPosts = orderCategories(rows)
      .map((c) => ({ name: c.name, slug: c.slug, count: Number(c.post_count) || 0 }))
      .filter((c) => c.count > 0);
    if (withPosts.length > 0) categories = withPosts;
  } catch {
    /* keep fallback */
  }
  return <Header categories={categories} />;
}
