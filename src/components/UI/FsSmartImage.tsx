"use client";

import Image from "next/image";
import { useState } from "react";

interface SmartImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: string;
  blurDataURL?: string;      // tiny blurred base64
  dominantColor?: string;    // from backend/cloudinary
}

const FsSmartImage: React.FC<SmartImageProps> = ({
  src,
  alt = "",
  className = "",
  fallback = "/images/thumbnail_fallback.jpeg",
  blurDataURL,
  dominantColor = "#f3f4f6", // soft gray default
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const finalSrc = !src || error ? fallback : src;

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: dominantColor }}
    >
      {/* Blur placeholder */}
      {!loaded && blurDataURL && (
        <Image
          src={blurDataURL}
          alt=""
          fill
          className="object-cover scale-110 blur-xl"
          aria-hidden
        />
      )}

      {/* Skeleton fallback if no blur */}
      {!loaded && !blurDataURL && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Main image */}
      <Image
        src={finalSrc}
        alt={alt}
        fill
        sizes="100vw"
        unoptimized
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`object-cover transition-all duration-700 ease-out ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      />
    </div>
  );
};

export default FsSmartImage;