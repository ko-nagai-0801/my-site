/* lib/work-thumb.ts */
import type { WorkMeta } from "@/lib/works";
import { resolveThumb } from "@/lib/thumb";
import { SITE_OG_IMAGES } from "@/lib/site-meta";

// ✅ b) Works専用のnoimage（public/images/works/noimage.webp を用意する）
export const DEFAULT_WORK_THUMB = "/images/works/noimage.webp";

/**
 * ✅ Works: 一覧/詳細サムネ用
 * - image.src があれば優先、無ければ DEFAULT_WORK_THUMB
 * - alt は image.alt → title の順でフォールバック
 */
export function getWorkThumb(
  meta: Pick<WorkMeta, "title" | "image">,
  fallbackSrc = DEFAULT_WORK_THUMB
) {
  return resolveThumb(meta, fallbackSrc);
}

/**
 * ✅ Works: OGP images 用（Blogと同方針）
 * - 作品に image があれば優先
 * - 無ければサイト既定OGPへフォールバック（site-meta 単一ソース）
 */
export function getWorkOgImages(
  meta: Pick<WorkMeta, "title" | "image">,
  fallback = SITE_OG_IMAGES
) {
  const src = meta.image?.src?.trim() ? meta.image.src.trim() : "";
  if (!src) return fallback;

  const alt = meta.image?.alt?.trim() ? meta.image.alt.trim() : meta.title;
  return [{ url: src, alt }];
}
