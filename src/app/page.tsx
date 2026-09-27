import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { preload } from "react-dom";
import { ArrowRight, BadgeCheck, CalendarCheck, Landmark, Mail, Search } from "lucide-react";
import { DEFAULT_OG_IMAGE, resolveCover } from "@/lib/covers";
import { AUTHOR_NAME } from "@/lib/schema";
import PostThumb from "@/components/PostThumb";
import { COVER_SIZES, coverSrcSet } from "@/lib/coverSrcset";
import { readingTimeLabel } from "@/lib/readingTime";
import { listPublishedPosts, listPublishedPostsBySlugs, type PostRow } from "@/lib/posts";
import { listCategories } from "@/lib/categories";
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

/** Editor's pick: the first of these that is currently published (else the newest post). */
const EDITORS_PICK = [
  "official-scholarship-map-pakistan-2026-hec-fulbright-daad",
  "germany-2026-pakistani-students-daad-aps-calendar",
  "study-abroad-roi-checklist-2026",
];

/** "Start here": hand-picked first reads, one per common goal (unpublished ones are skipped). */
const START_HERE: { slug: string; goal: string }[] = [
  { slug: "official-scholarship-map-pakistan-2026-hec-fulbright-daad", goal: "Find a scholarship" },
  { slug: "study-abroad-timelines-if-you-are-starting-from-pakistan", goal: "Plan study abroad" },
  { slug: "germany-2026-pakistani-students-daad-aps-calendar", goal: "Study in Germany" },
  { slug: "how-to-write-a-statement-of-purpose-that-a-reviewer-actually-finishes", goal: "Write your SOP" },
  { slug: "skills-that-get-interviews-2026", goal: "Get interviews" },
  { slug: "hec-attestation-mofa-tutorial-foreign-file", goal: "Prepare documents" },
  { slug: "scholarship-applications-without-scams", goal: "Avoid scams" },
];

const SHORT: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
function formatDate(value: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = SHORT) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", opts);
}
/** Most recent of published/updated (what readers see as "Updated"). */
function lastUpdated(p: PostRow) {
  const pub = p.published_at ? new Date(p.published_at).getTime() : 0;
  const upd = p.updated_at ? new Date(p.updated_at).getTime() : 0;
  return new Date(Math.max(pub, upd) || Date.now());
}

function SectionHeading({ id, eyebrow, title, intro, href, linkLabel }: { id?: string; eyebrow: string; title: string; intro?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="max-w-[720px]">
        <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
          {eyebrow}
        </div>
        <h2 id={id} className="font-heading text-[28px] font-bold leading-tight tracking-[-0.02em] sm:text-[34px]" style={{ color: "var(--fg)" }}>
          {title}
        </h2>
        {intro ? (
          <p className="mt-2 text-[15px] leading-7" style={{ color: "var(--muted)" }}>
            {intro}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link href={href} className="inline-flex items-center gap-1.5 text-[14px] font-semibold hover:underline" style={{ color: "var(--fg)" }}>
          {linkLabel} <ArrowRight size={15} />
        </Link>
      ) : null}
    </div>
  );
}

function LatestCard({ post }: { post: PostRow }) {
  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="flex items-start gap-4 sm:block">
        <div className="aspect-[1200/630] w-[132px] shrink-0 overflow-hidden rounded-lg sm:w-full sm:rounded-xl" style={{ background: "var(--bg2)" }}>
          <PostThumb post={post} alt={post.title} width={600} height={315} sizes={COVER_SIZES.latest} className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]" />
        </div>
        <div className="min-w-0 sm:mt-4">
          <div className="flex flex-wrap items-center gap-x-2 text-[12px]" style={{ color: "var(--muted)" }}>
            <span className="font-bold uppercase tracking-[0.08em]" style={{ color: "var(--accent)" }}>{post.category_name || "Guide"}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={new Date(post.published_at || post.created_at).toISOString()}>{formatDate(post.published_at)}</time>
          </div>
          <h3 className="mt-1.5 font-heading text-[16px] font-bold leading-snug transition group-hover:opacity-80 sm:text-[19px]" style={{ color: "var(--fg)" }}>
            {post.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}

export default async function HomePage() {
  let latest: PostRow[] = [];
  let total = 0;
  let picks: PostRow[] = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];

  await Promise.all([
    listPublishedPosts(1, 8).then((r) => { latest = r.posts; total = Number(r.total) || r.posts.length; }).catch((e) => console.error(e)),
    listPublishedPostsBySlugs([...new Set([...EDITORS_PICK, ...START_HERE.map((s) => s.slug)])]).then((r) => { picks = r; }).catch(() => {}),
    listCategories().then((r) => { categories = r; }).catch(() => {}),
  ]);

  const bySlug = new Map(picks.map((p) => [p.slug, p]));
  const featured = EDITORS_PICK.map((s) => bySlug.get(s)).find(Boolean) || latest[0];
  const startHere = START_HERE.filter((s) => s.slug !== featured?.slug)
    .map((s) => ({ ...s, post: bySlug.get(s.slug) }))
    .filter((s): s is { slug: string; goal: string; post: PostRow } => Boolean(s.post))
    .slice(0, 6);
  const latestList = latest.filter((p) => p.id !== featured?.id).slice(0, 6);
  const orderedCategories = orderCategories(categories);
  // Hint the LCP image (editor's-pick cover) in <head>, ahead of the CSS/JS requests.
  const heroImg = featured ? coverSrcSet(resolveCover(featured.featured_image, featured.category_slug, featured.slug)) : null;
  if (heroImg) preload(heroImg.src, { as: "image", imageSrcSet: heroImg.srcSet, imageSizes: COVER_SIZES.hero, fetchPriority: "high" });
  const newest = [...latest, ...picks].reduce<Date | null>((d, p) => { const u = lastUpdated(p); return !d || u > d ? u : d; }, null);

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)" }}>
      {/* Hero: who the site is for + the editor's pick */}
      <section className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-semibold" style={{ borderColor: "var(--border)", color: "var(--muted)", background: "var(--bg2)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              For students &amp; job seekers in Pakistan
            </p>
            <h1 className="mt-4 font-heading text-[34px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[46px] lg:text-[54px]">
              Practical guides for your next <span style={{ color: "var(--accent)" }}>career or study</span> move.
            </h1>
            <p className="mt-4 max-w-[560px] text-[16px] leading-7 sm:text-[17px]" style={{ color: "var(--muted)" }}>
              Free, step-by-step guides on scholarships, study abroad, skills and first jobs, written for readers
              in Pakistan. Every guide points you to the official source.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#start-here" className="inline-flex h-11 items-center gap-2 rounded-full bg-rose-600 px-6 text-[14px] font-bold text-white shadow-sm transition hover:bg-rose-700">
                Start here <ArrowRight size={16} />
              </Link>
              <Link href="/articles" className="inline-flex h-11 items-center rounded-full border px-6 text-[14px] font-bold transition hover:border-[var(--fg)]" style={{ borderColor: "var(--border)", color: "var(--fg)", background: "var(--bg2)" }}>
                Browse all {total > 0 ? `${total} ` : ""}guides
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] sm:mt-7 sm:gap-x-6" style={{ color: "var(--muted)" }}>
              <li className="flex items-center gap-2"><Landmark size={16} style={{ color: "var(--accent)" }} /> Official sources linked</li>
              <li className="flex items-center gap-2"><CalendarCheck size={16} style={{ color: "var(--accent)" }} /> {newest ? `Updated ${formatDate(newest, { month: "long", year: "numeric" })}` : "Dated and updated"}</li>
              <li className="flex items-center gap-2"><BadgeCheck size={16} style={{ color: "var(--accent)" }} /> <span>By <Link href="/about" className="font-semibold hover:underline" style={{ color: "var(--fg)" }}>{AUTHOR_NAME}</Link>, not an agency</span></li>
            </ul>
          </div>

          {featured ? (
            <article className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
              <Link href={`/posts/${featured.slug}`} className="block aspect-[1200/630] w-full overflow-hidden" style={{ background: "var(--bg)" }}>
                <PostThumb post={featured} alt={featured.title} width={1200} height={630} priority sizes={COVER_SIZES.hero} className="h-full w-full object-cover object-center" />
              </Link>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em]">
                  <span className="rounded-full px-2.5 py-0.5 text-white" style={{ background: "var(--accent)" }}>Editor&apos;s pick</span>
                  {featured.category_slug ? (
                    <Link href={`/category/${featured.category_slug}`} className="hover:underline" style={{ color: "var(--muted)" }}>{featured.category_name}</Link>
                  ) : null}
                </div>
                <h2 className="mt-3 font-heading text-[21px] font-bold leading-snug sm:text-[24px]">
                  <Link href={`/posts/${featured.slug}`} className="transition hover:opacity-80" style={{ color: "var(--fg)" }}>{featured.title}</Link>
                </h2>
                {featured.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-[15px] leading-6" style={{ color: "var(--muted)" }}>{featured.excerpt}</p>
                ) : null}
                <p className="mt-4 text-[12.5px]" style={{ color: "var(--muted)" }}>
                  By {AUTHOR_NAME} · Updated {formatDate(lastUpdated(featured))} · {readingTimeLabel(featured.content || "")}
                </p>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      {/* Latest */}
      {latestList.length > 0 ? (
        <section id="latest" aria-labelledby="latest-title" className="scroll-mt-24">
          <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:py-16">
            <SectionHeading id="latest-title" eyebrow="New and updated" title="Latest guides" href="/articles" linkLabel="All guides" />
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {latestList.map((p) => (
                <LatestCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Start here */}
      {startHere.length > 0 ? (
        <section id="start-here" aria-labelledby="start-title" className="scroll-mt-24 border-y" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:py-16">
            <SectionHeading id="start-title" eyebrow="Start here" title="The most useful first reads" intro="New here? Pick your goal. Each guide gives you the steps, the documents, and the official links to check." />
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {startHere.map(({ goal, post }, i) => (
                <li key={post.id}>
                  <Link href={`/posts/${post.slug}`} className="group flex h-full flex-col rounded-xl border p-5 transition hover:border-[var(--accent)]" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                    <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-[0.1em]">
                      <span style={{ color: "var(--accent)" }}>{goal}</span>
                      <span className="tabular-nums" style={{ color: "var(--muted)" }}>0{i + 1}</span>
                    </div>
                    <h3 className="mt-2.5 font-heading text-[17px] font-bold leading-snug sm:text-[18px]" style={{ color: "var(--fg)" }}>{post.title}</h3>
                    {post.excerpt ? <p className="mt-2 line-clamp-2 text-[14px] leading-6" style={{ color: "var(--muted)" }}>{post.excerpt}</p> : null}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold" style={{ color: "var(--fg)" }}>
                      Read guide <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* One section per topic (streams in) */}
      <Suspense fallback={<TopicSectionsSkeleton />}>
        <TopicSections categories={orderedCategories} />
      </Suspense>

      {/* Trust: who writes this and how */}
      <section aria-labelledby="about-title" style={{ background: "var(--bg2)" }}>
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 font-heading text-[28px] font-bold text-white shadow-md" aria-hidden="true">
              FB
            </div>
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Who writes this</div>
              <h2 id="about-title" className="mt-2 font-heading text-[28px] font-bold leading-tight sm:text-[32px]">Written and edited by {AUTHOR_NAME}</h2>
              <p className="mt-3 max-w-[560px] text-[15px] leading-7" style={{ color: "var(--muted)" }}>
                GlobalCareerHub is an independent reading desk for students and early-career readers in Pakistan.
                It is not a consultancy, a visa shop, or a job board, and it never charges a fee.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-semibold">
                <Link href="/about" className="inline-flex items-center gap-1.5 hover:underline" style={{ color: "var(--fg)" }}>About the author <ArrowRight size={14} /></Link>
                <Link href="/about#editorial-policy" className="inline-flex items-center gap-1.5 hover:underline" style={{ color: "var(--fg)" }}>Editorial policy <ArrowRight size={14} /></Link>
                <Link href="/contact" className="inline-flex items-center gap-1.5 hover:underline" style={{ color: "var(--fg)" }}>Contact <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {([
              [Landmark, "Official sources first", "Guides link to HEC, DAAD, Fulbright/USEFP, GOV.UK and other official pages. If we disagree, trust them."],
              [CalendarCheck, "Dated and updated", "Every guide shows when it was published, and dates are rechecked when rules change."],
              [BadgeCheck, "No promises, no fees", "No visa, scholarship or job guarantees, and no agent packages or processing fees."],
              [Mail, "Corrections welcome", "Spotted something out of date? Email admin@globalcareerhub.org and it gets fixed."],
            ] as const).map(([Icon, title, text]) => (
              <li key={title} className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                <Icon size={20} style={{ color: "var(--accent)" }} />
                <div className="mt-3 font-heading text-[16px] font-bold">{title}</div>
                <p className="mt-1 text-[14px] leading-6" style={{ color: "var(--muted)" }}>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Search */}
      <section aria-labelledby="search-title">
        <div className="mx-auto max-w-[1280px] px-5 pt-12 sm:px-8 lg:pt-16">
          <div className="grid gap-6 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 p-6 text-white sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 id="search-title" className="font-heading text-[26px] font-bold leading-tight sm:text-[34px]">Looking for something specific?</h2>
              <p className="mt-2 text-[15px] leading-6 text-white/90">Search all guides: a scholarship name, a country, a document or a skill.</p>
            </div>
            <form action="/search" role="search" className="flex overflow-hidden rounded-full bg-white p-1 shadow-sm">
              <label htmlFor="home-search" className="sr-only">Search guides</label>
              <input id="home-search" name="q" type="search" placeholder="e.g. DAAD, SOP, IELTS…" className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-slate-900 outline-none placeholder:text-slate-500" />
              <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-900 px-5 text-[14px] font-bold text-white">
                <Search size={15} /> Search
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
