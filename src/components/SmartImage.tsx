import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Use next/image for local paths; plain img for external URLs. */
export default function SmartImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
}: Props) {
  const isLocal = src.startsWith("/") && !src.startsWith("//");

  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={80}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // @ts-expect-error fetchPriority is valid in modern browsers
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
