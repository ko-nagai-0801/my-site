/* lib/tag-normalize.ts */

/**
 * 表記ゆれの「正」をここで固定（UI/OGP/タグ一覧の表示に使う）
 * - key は normalizeKey() の結果（= 小文字・NFKC・空白圧縮）
 */
const CANONICAL_LABELS: Record<string, string> = {
  mdx: "MDX",
  portfolio: "Portfolio",
};

/**
 * 表示用（見た目）は trim のみ
 */
export const normalizeLabel = (s: string) => s.trim();

/**
 * 比較用（重複排除・一致判定）を強める
 * - NFKC：全角/半角などのゆれを吸収
 * - 連続空白を1つに潰す
 * - lower：大小文字ゆれを吸収（比較用だけ）
 */
export const normalizeKey = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/**
 * key -> canonical label（存在すれば）
 */
export const canonicalLabelByKey = (key: string) => CANONICAL_LABELS[key];

/**
 * label -> canonical label（存在すれば）
 * - UIに出す label を最終的に整える用途（tagMap生成で使う）
 */
export const canonicalizeLabel = (label: string) => {
  const l = normalizeLabel(label);
  if (!l) return "";
  const key = normalizeKey(l);
  if (!key) return l;
  return canonicalLabelByKey(key) ?? l;
};

/**
 * label -> slug
 * - /tags/[tag] の [tag] には「正規化後キー」をURLエンコードしたものを使う
 * - これで Blog/Works 共通のタグ同一性が崩れない（単一ソース）
 */
export const tagToSlug = (label: string) =>
  encodeURIComponent(normalizeKey(normalizeLabel(label)));

/**
 * slug -> key
 * - ルーティングパラメータは Next がデコード済みの場合があるので、例外を飲んで安全に扱う
 */
export const slugToKey = (slug: string) => {
  try {
    return normalizeKey(decodeURIComponent(slug));
  } catch {
    return normalizeKey(slug);
  }
};

/**
 * slug -> 表示ラベル（軽い復元）
 * - tagToSlug() は normalizeKey() を通すため、大小文字などは元に戻せない
 * - ただし UI/OGP 用のラベルとしては十分（lib/tags.ts 側で実ラベルが取れるならそちら優先）
 */
export const slugToTag = (slug: string) => {
  try {
    return normalizeLabel(decodeURIComponent(slug));
  } catch {
    return normalizeLabel(slug);
  }
};
