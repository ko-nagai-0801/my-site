/* lib/post-thumb.ts */
import type { PostMeta } from "@/lib/posts";
import { DEFAULT_OG_IMAGES } from "@/lib/site-meta";

export const DEFAULT_BLOG_THUMB = "/images/blog/noimage.webp";

function normalizeAssetSrc(src: string): string {
  const s = src.trim();
  if (!s) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

export function getPostThumb(
  meta: Pick<PostMeta, "title" | "image">,
  fallbackSrc = DEFAULT_BLOG_THUMB
) {
  const src = meta.image?.src ? normalizeAssetSrc(meta.image.src) : fallbackSrc;
  const alt = meta.image?.alt?.trim() ? meta.image.alt : meta.title;
  return { src, alt };
}

/**
 * ✅ OGP用（単一ソース）
 * - 記事画像があれば優先
 * - 無ければサイト既定OGPへフォールバック（layoutと同一）
 */
export function getPostOgImages(meta: Pick<PostMeta, "title" | "image">) {
  if (meta.image?.src?.trim()) {
    const url = normalizeAssetSrc(meta.image.src);
    const alt = meta.image?.alt?.trim() ? meta.image.alt : meta.title;
    return [{ url, alt }];
  }

  // デフォルトOGP（width/height付き）
  return DEFAULT_OG_IMAGES.map((img) => ({
    url: img.url,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }));
}
