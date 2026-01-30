/* lib/post-thumb.ts */
import type { PostMeta } from "@/lib/posts";
import { resolveThumb } from "@/lib/thumb";

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
 * - 無ければ「サイト既定OGP」へフォールバック
 *
 * ※ site-meta 側に既定OGPを寄せる最適化は後でOK（まずはビルド復旧優先）
 */
const DEFAULT_SITE_OG_IMAGES: Array<{ url: string; alt: string }> = [
  { url: "/og-kns-1200x630.png", alt: "Kou Nagai Studio" },
  { url: "/og-kns-2400x1260.png", alt: "Kou Nagai Studio" },
];

export function getPostOgImages(
  meta: Pick<PostMeta, "title" | "image">,
  fallback = DEFAULT_SITE_OG_IMAGES
) {
  const src = meta.image?.src?.trim() ? meta.image.src.trim() : "";
  if (!src) return fallback;

  const alt = meta.image?.alt?.trim() ? meta.image.alt.trim() : meta.title;
  return [{ url: src, alt }];
}
