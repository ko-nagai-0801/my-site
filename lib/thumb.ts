/* lib/thumb.ts */
export type Thumb = { src: string; alt: string };

type ImageLike = { src?: string | null; alt?: string | null };

const trimNonEmpty = (v: unknown): string | undefined => {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length ? s : undefined;
};

/**
 * ✅ 共通：サムネ（一覧/詳細/OGP）用の src/alt を解決
 * - src：image.src があれば優先、無ければ fallbackSrc
 * - alt：image.alt があれば優先、無ければ title、最後に fallbackAlt
 */
export function resolveThumb(
  meta: { title: string; image?: ImageLike | null },
  fallbackSrc: string,
  fallbackAlt?: string
): Thumb {
  const src = trimNonEmpty(meta.image?.src) ?? fallbackSrc;

  const alt =
    trimNonEmpty(meta.image?.alt) ??
    trimNonEmpty(meta.title) ??
    trimNonEmpty(fallbackAlt) ??
    "thumbnail";

  return { src, alt };
}
