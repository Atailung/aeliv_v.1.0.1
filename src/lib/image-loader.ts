import { ImageLoaderProps } from "next/image";

export default function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  // For external URLs (starting with http/https), return them as-is to bypass Next.js optimization
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // For data URLs, return as-is
  if (src.startsWith("data:")) {
    return src;
  }

  // For local images (starting with / or relative paths), use Next.js default optimization
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: (quality || 75).toString(),
  });

  return `/_next/image?${params.toString()}`;
}
