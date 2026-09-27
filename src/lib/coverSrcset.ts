import { COVER_VERSIONS, COVER_WIDTHS } from "@/lib/coverVariants.generated";

/**
 * Responsive, cache-busted URLs for a branded post cover (/covers/posts/<slug>.webp).
 * Returns null for any other image (category SVGs, external URLs), which are used as-is.
 * The ?v=<hash> query lets the files be cached for a year (see public/.htaccess).
 */
export function coverSrcSet(src: string | null | undefined): { src: string; srcSet: string } | null {
  const m = src ? /^\/covers\/posts\/([a-z0-9-]+)\.webp$/.exec(src) : null;
  if (!m) return null;
  const slug = m[1];
  if (!Object.prototype.hasOwnProperty.call(COVER_VERSIONS, slug)) return null;
  const q = `?v=${COVER_VERSIONS[slug]}`;
  const srcSet = [
    ...COVER_WIDTHS.map((w) => `/covers/posts/w${w}/${slug}.webp${q} ${w}w`),
    `/covers/posts/${slug}.webp${q} 1200w`,
  ].join(", ");
  return { src: `/covers/posts/${slug}.webp${q}`, srcSet };
}

/** `sizes` for the common cover slots (CSS px widths at each breakpoint). */
export const COVER_SIZES = {
  /** Homepage hero: left column of the 1.65fr/.75fr grid inside max-w-[1440px] px-8, pr-10. */
  hero: "(min-width: 1440px) 906px, (min-width: 1024px) calc(68.75vw - 84px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)",
  /** Homepage topic cards: 4 cols (lg) / 2 cols (sm) / 78% swipe cards (mobile). */
  topic: "(min-width: 1440px) 326px, (min-width: 1024px) calc(25vw - 34px), (min-width: 640px) calc(50vw - 44px), calc(78vw - 32px)",
  /** PostCard grid in max-w-7xl px-4: 3 cols (lg) / 2 cols (md) / 1 col. */
  card: "(min-width: 1280px) 400px, (min-width: 1024px) calc(33vw - 27px), (min-width: 768px) calc(50vw - 28px), calc(100vw - 32px)",
  /** Post page cover in max-w-3xl px-4 sm:px-6. */
  article: "(min-width: 768px) 720px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)",
  /** Small compact-row thumbnails (w-28 / sm:w-36). */
  thumb: "(min-width: 640px) 144px, 112px",
} as const;
