"use client";

import { useState } from "react";
import { DEFAULT_COVER } from "@/lib/covers";

type Props = {
  src: string;
  fallback?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  /** Above-the-fold / LCP image: load eagerly with high fetch priority. */
  priority?: boolean;
};

/** Tries src; on 404 falls back to permanent /covers image. */
export default function SafeImg({
  src,
  fallback = DEFAULT_COVER,
  alt = "",
  className = "",
  width,
  height,
  priority = false,
}: Props) {
  const [current, setCurrent] = useState(src || fallback);
  const [gaveUp, setGaveUp] = useState(false);

  if (gaveUp) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-800 via-slate-900 to-rose-900 ${className}`}
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => {
        if (current !== fallback) {
          setCurrent(fallback);
        } else {
          setGaveUp(true);
        }
      }}
    />
  );
}
