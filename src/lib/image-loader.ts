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

  // For blob URLs (object URLs), return as-is
  if (src.startsWith("blob:")) {
    return src;
  }

  // For S3 keys or relative paths, construct the full S3 URL
  if (!src.startsWith("/")) {
    // This is likely an S3 key, construct the full URL
    return `https://aeliv-lms-web-application-v.1.1.t3.storage.dev/${src}`;
  }

  // For local images (starting with / or relative paths), use Next.js default optimization
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: (quality || 75).toString(),
  });

  return `/_next/image?${params.toString()}`;
}
