"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
};

/** Shows gradient fallback when image 404s (common after Hostinger redeploy). */
export default function SafeImg({
  src,
  alt = "",
  className = "",
  width,
  height,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-700 via-slate-800 to-rose-900 ${className}`}
        style={{ width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined }}
        aria-hidden
      />
    );
  }

  // Prefer relative /uploads path (works with rewrite)
  let url = src;
  try {
    if (src.startsWith("http")) {
      const u = new URL(src);
      if (u.pathname.startsWith("/uploads/")) url = u.pathname;
    }
  } catch {
    /* keep src */
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
