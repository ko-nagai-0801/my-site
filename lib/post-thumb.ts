/* lib/post-thumb.ts */
import type { PostMeta } from "@/lib/posts";
import { resolveThumb } from "@/lib/thumb";
import { SITE_OG_IMAGES } from "@/lib/site-meta";

export const DEFAULT_BLOG_THUMB = "/images/blog/noimage.webp";

/**
 * ✅ Blog: 一覧/詳細サムネ用
 * - image.src があれば優先、無ければ DEFAULT_BLOG_THUMB
 * - alt は image.alt → title の順でフォールバック
 */
export function getPostThumb(
  meta: Pick<PostMeta, "title" | "image">,
  fallbackSrc = DEFAULT_BLOG_THUMB
) {
  return resolveThumb(meta, fallbackSrc);
}

/**
 * ✅ Blog: OGP images 用
 * - 記事に image があればそれを優先
 * - 無ければ「サイト既定OGP」へフォールバック（site-meta を単一ソースに）
 */
export function getPostOgImages(
  meta: Pick<PostMeta, "title" | "image">,
  fallback = SITE_OG_IMAGES
) {
  const src = meta.image?.src?.trim() ? meta.image.src.trim() : "";
  if (!src) return fallback;

  const alt = meta.image?.alt?.trim() ? meta.image.alt.trim() : meta.title;
  return [{ url: src, alt }];
}
