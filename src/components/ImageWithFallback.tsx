"use client";

import Image from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
}: ImageProps) {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`${className} w-full h-full`} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      priority={priority}
    />
  );
}
