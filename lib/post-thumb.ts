/* lib/post-thumb.ts */
import type { PostMeta } from "@/lib/posts";

export const DEFAULT_BLOG_THUMB = "/images/blog/noimage.webp";

export function getPostThumb(
  meta: Pick<PostMeta, "title" | "image">,
  fallbackSrc = DEFAULT_BLOG_THUMB
) {
  const src = meta.image?.src ?? fallbackSrc;
  const alt = meta.image?.alt?.trim() ? meta.image.alt : meta.title;
  return { src, alt };
}
