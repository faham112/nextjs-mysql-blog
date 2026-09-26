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
};

/** Tries src; on 404 falls back to permanent /covers image. */
export default function SafeImg({
  src,
  fallback = DEFAULT_COVER,
  alt = "",
  className = "",
  width,
  height,
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
      loading="lazy"
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
