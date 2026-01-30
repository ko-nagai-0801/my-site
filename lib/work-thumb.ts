/* lib/work-thumb.ts */
import type { WorkMeta } from "@/lib/works";
import { resolveThumb } from "@/lib/thumb";

export const DEFAULT_WORK_THUMB = "/images/blog/noimage.webp";

export function getWorkThumb(
  meta: Pick<WorkMeta, "title" | "image">,
  fallbackSrc = DEFAULT_WORK_THUMB
) {
  return resolveThumb(meta, fallbackSrc);
}
