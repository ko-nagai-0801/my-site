/* lib/tag-normalize.ts */
import "server-only";

/** 表示用（見た目）は trim のみ */
export const normalizeLabel = (s: string) => s.trim();

/**
 * 比較用（重複排除・一致判定）を強める
 * - NFKC：全角/半角などのゆれを吸収
 * - 連続空白を1つに潰す
 * - lower：大小文字ゆれを吸収（比較用だけ）
 */
export const normalizeKey = (s: string) =>
  normalizeLabel(s)
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** タグ文字列 → URL に入れる（人間が読める形を優先） */
export const tagToSlug = (tag: string) => encodeURIComponent(normalizeLabel(tag));

/** URL パラメータ → タグ文字列（壊れたエンコードも落とさない） */
export const slugToTag = (slug: string) => {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
};
