"use client";

import { useState } from "react";

export interface AvatarProps {
  src?: string | undefined;
  alt: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Avatar with initials fallback on image error.
 *
 * Requirements: 13.6
 */
export function Avatar({
  src,
  alt,
  name,
  size = 40,
  className = "",
}: AvatarProps): JSX.Element {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-accent/20 text-accent font-sans font-semibold text-sm ${className}`}
        style={{ width: size, height: size }}
        aria-label={alt}
        role="img"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
