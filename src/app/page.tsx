import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/covers";
import { AUTHOR_NAME } from "@/lib/schema";
import EditorialNav from "@/components/EditorialNav";
import PostThumb from "@/components/PostThumb";
import { listPublishedPosts, type PostRow } from "@/lib/posts";
import { listCategories } from "@/lib/categories";
import CategoryChips from "@/components/home/CategoryChips";
import TopicSections, { TopicSectionsSkeleton, orderCategories } from "@/components/home/TopicSections";

// Always render from the live DB (never bake an empty build-time snapshot).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GlobalCareerHub",
    title: "GlobalCareerHub — Career, Skills & Study Guides",
    description: "Free guides on careers, skills, scholarships, and study.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "GlobalCareerHub" }],
  },
};

function formatDate(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="ed-double mb-7 flex items-end justify-between pb-3">
      <div>
        <div
          className="mb-1 text-[9px] font-bold uppercase tracking-[0.17em]"
          style={{ color: "var(--accent)" }}
        >
          {eyebrow}
        </div>
        <h2
          className="font-heading text-[31px] font-bold tracking-[-0.025em]"
          style={{ color: "var(--fg)" }}
        >
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="hidden text-[10px] font-bold uppercase tracking-[0.12em] sm:block"
        style={{ color: "var(--fg)" }}
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
        {title}
      </div>
      <div className="space-y-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block text-[13px] text-white/70 transition hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  let latest: PostRow[] = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];

  try {
    latest = (await listPublishedPosts(1, 5)).posts;
  } catch (e) {
    console.error(e);
  }
  try {
    categories = await listCategories();
  } catch {}
  const featured = latest[0];
  const latestSide = latest.slice(1, 5);
  const orderedCategories = orderCategories(categories);

  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const catNav =
    categories.length > 0
      ? categories.map((c) => ({ name: c.name, slug: c.slug }))
      : [
          { name: "Applications", slug: "applications" },
          { name: "Careers", slug: "careers" },
          { name: "Scholarships", slug: "scholarships" },
          { name: "Skills", slug: "skills" },
          { name: "Study Abroad", slug: "study-abroad" },
          { name: "Technology", slug: "technology" },
          { name: "Tutorials", slug: "tutorials" },
        ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <div
        className="border-b text-white"
        style={{ background: "var(--strip)", borderColor: "var(--border)", color: "var(--strip-fg)" }}
      >
        <div className="mx-auto flex min-h-[34px] max-w-[1440px] items-center justify-between px-5 text-[11px] uppercase tracking-[0.16em] sm:px-8">
          <span>Global Career & Study Desk</span>
          <span className="hidden opacity-60 sm:block">{monthLabel} Edition</span>
        </div>
      </div>

      <EditorialNav categories={catNav} />

      <CategoryChips categories={orderedCategories} />

      <section className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:py-12">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,.75fr)]">
            <article className="border-b pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10" style={{ borderColor: "var(--border)" }}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[7px] w-[7px]" style={{ background: "var(--accent)" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                  Editor&apos;s Pick
                </span>
              </div>

              {featured ? (
                <>
                  <h1 className="max-w-[950px] font-heading text-[36px] font-bold leading-[1.08] tracking-[-0.04em] sm:text-[52px] lg:text-[64px]">
                    <Link href={`/posts/${featured.slug}`} className="transition hover:opacity-90" style={{ color: "var(--fg)" }}>
                      {featured.title}
                    </Link>
                  </h1>
                  <p className="mt-5 max-w-[720px] text-[16px] leading-7 sm:text-[17px]" style={{ color: "var(--muted)" }}>
                    {featured.excerpt || "Practical guides on careers, technology, scholarships and study routes."}
                  </p>
                  <Link href={`/posts/${featured.slug}`} className="relative mt-8 block aspect-[1200/630] w-full overflow-hidden" style={{ background: "var(--bg2)" }}>
                    <PostThumb post={featured} alt={featured.title} width={1200} height={630} priority className="h-full w-full object-cover object-center" />
                  </Link>
                  <div className="mt-4 flex justify-between text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
                    <span>{`By ${AUTHOR_NAME}`}</span>
                    <span>{formatDate(featured.published_at)}</span>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="max-w-[950px] font-heading text-[42px] font-bold leading-[1.04] tracking-[-0.045em] sm:text-[56px] lg:text-[72px]">
                    Build a career that can move with you.
                  </h1>
                  <p className="mt-6 max-w-[720px] text-[16px] leading-7 sm:text-[18px]" style={{ color: "var(--muted)" }}>
                    Practical guides on careers, technology, scholarships and study routes.
                  </p>
                </>
              )}
            </article>

            <aside id="latest" className="pt-8 lg:pl-8 lg:pt-0">
              <div className="ed-double mb-5 flex items-end justify-between pb-3">
                <h2 className="font-heading text-[27px] font-bold">Latest</h2>
                <Link href="/articles" className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--accent)" }}>View all</Link>
              </div>
              <div>
                {latestSide.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>New guides coming soon.</p>}
                {latestSide.map((story, index) => (
                  <article key={story.id} className="group border-b py-5 first:pt-0" style={{ borderColor: "var(--border)" }}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>{story.category_name || "Guide"}</span>
                      <span className="text-[9px]" style={{ color: "var(--muted)" }}>{formatDate(story.published_at)}</span>
                    </div>
                    <Link href={`/posts/${story.slug}`} className="font-heading text-[18px] font-bold leading-[1.3] transition group-hover:opacity-80" style={{ color: "var(--fg)" }}>
                      {story.title}
                    </Link>
                    <div className="mt-3 text-[10px] font-bold" style={{ color: "var(--muted)" }}>0{index + 1}</div>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--strip)", color: "var(--strip-fg)" }}>
        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8">
          <div className="grid gap-6 md:grid-cols-[.65fr_1fr_1fr_1fr]">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--accent-soft)" }}>Explore</div>
              <div className="mt-2 font-heading text-[25px] font-bold">Opportunities</div>
            </div>
            {([["01", "Scholarships", "Funding & study opportunities", "/category/scholarships"], ["02", "Careers", "Paths and proof for your next role", "/category/careers"], ["03", "Study Abroad", "Destinations, ROI and applications", "/category/study-abroad"]] as const).map(([number, title, description, href]) => (
              <Link href={href} key={number} className="group border-l border-white/15 pl-5 transition hover:border-[var(--accent-soft)]">
                <div className="text-[9px] font-bold opacity-70">{number}</div>
                <div className="mt-2 font-heading text-[20px] font-bold transition group-hover:text-[var(--accent-soft)]">{title}</div>
                <div className="mt-1 text-[12px] opacity-75">{description}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<TopicSectionsSkeleton />}>
        <TopicSections categories={orderedCategories} />
      </Suspense>

      <section style={{ background: "var(--bg2)" }}>
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[280px_1fr]">
            <div className="flex justify-center lg:justify-start">
              <div className="flex h-[190px] w-[190px] items-center justify-center rounded-full" style={{ background: "var(--strip)", color: "var(--strip-fg)" }}>
                <span className="font-heading text-[52px] font-bold">FB</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.17em]" style={{ color: "var(--accent)" }}>About the publication</div>
              <h2 className="mt-3 font-heading text-[35px] font-bold tracking-[-0.03em] sm:text-[45px]">GlobalCareerHub is written for the next move.</h2>
              <p className="mt-5 max-w-[720px] text-[15px] leading-7" style={{ color: "var(--muted)" }}>
                Founded and managed by <strong style={{ color: "var(--fg)" }}>{AUTHOR_NAME}</strong>, GlobalCareerHub publishes practical guides on careers, skills, scholarships, technology and study routes.
              </p>
              <Link href="/about" className="mt-6 inline-block border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ borderColor: "var(--fg)", color: "var(--fg)" }}>About {AUTHOR_NAME}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="text-white" style={{ background: "#be123c" }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">The Career Brief</div>
              <h2 className="mt-3 max-w-[650px] font-heading text-[36px] font-bold leading-[1.05] sm:text-[48px]">Useful opportunities. No noise.</h2>
              <p className="mt-4 max-w-[600px] text-[14px] leading-6 text-white/90">Browse the latest career guides, scholarships and study opportunities.</p>
            </div>
            <form action="/search" className="border-b border-white/50">
              <div className="flex">
                <input name="q" type="search" placeholder="Search guides..." className="min-w-0 flex-1 bg-transparent px-0 py-4 text-[14px] text-white outline-none placeholder:text-white/50" aria-label="Search" />
                <button type="submit" className="px-3 text-[10px] font-bold uppercase tracking-[0.14em]">Search →</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="text-white" style={{ background: "var(--strip)" }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <div className="font-heading text-[27px] font-bold tracking-[-0.04em]">GlobalCareer<span style={{ color: "var(--accent-soft)" }}>Hub</span></div>
              <p className="mt-4 max-w-[430px] text-[13px] leading-6 text-white/70">Practical guides for careers, skills, scholarships, technology and study abroad.</p>
            </div>
            <FooterColumn title="Explore" links={[{ label: "Latest", href: "/articles" }, { label: "Careers", href: "/category/careers" }, { label: "Scholarships", href: "/category/scholarships" }, { label: "Study Abroad", href: "/category/study-abroad" }]} />
            <FooterColumn title="Topics" links={[{ label: "Skills", href: "/category/skills" }, { label: "Technology", href: "/category/technology" }, { label: "Applications", href: "/category/applications" }, { label: "Tutorials", href: "/category/tutorials" }]} />
            <FooterColumn title="Company" links={[{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Privacy", href: "/privacy" }, { label: "Disclaimer", href: "/disclaimer" }]} />
          </div>
          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.1em] text-white/70 sm:flex-row">
            <span>© {new Date().getFullYear()} GlobalCareerHub.org</span>
            <span>By {AUTHOR_NAME}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
