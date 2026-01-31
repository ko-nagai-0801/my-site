/* lib/tag-normalize.ts */

export const CANONICAL_LABELS: Record<string, string> = {
  // 既存（確定）
  mdx: "MDX",
  portfolio: "Portfolio",

  // 追加（よく揺れるやつ）
  "next.js": "Next.js",
  react: "React",
  typescript: "TypeScript",
  tailwindcss: "TailwindCSS",
  javascript: "JavaScript",
  "node.js": "Node.js",

  // 追加（基礎タグ）
  html: "HTML",
  css: "CSS",
  php: "PHP",
  seo: "SEO",
  bootstrap: "Bootstrap",
  wordpress: "WordPress",

  // 追加（サービス/環境）
  vercel: "Vercel",
  netlify: "Netlify",

  // 追加（GitHub系：表示だけ寄せる）
  github: "GitHub",
  githubpages: "GitHubPages",
  "github pages": "GitHubPages",
  githubactions: "GitHubActions",
  "github actions": "GitHubActions",
  "github-actions": "GitHubActions",

  // 追加（サイト内で出やすい）
  "anti-spam": "Anti-Spam",
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
 *
 * NOTE:
 * - ここを変えると slug/key が変わってURLに影響するので、慎重に。
 */
export const normalizeKey = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/**
 * key -> canonical label
 * - 呼び出し側（tags.ts / post-tags.ts / works-tags.ts）で「canonical優先」にするための窓口
 */
export const canonicalLabelByKey = (key: string) => CANONICAL_LABELS[key];

/**
 * 表示ラベルを canonical に寄せる
 * - まず normalizeKey(rawLabel) を作り、辞書にあれば canonical 表記を返す
 * - key 自体を変える目的ではなく、表示統一（MDX/OGP/UI）を安定させる
 */
export const canonicalizeLabel = (rawLabel: string) => {
  const label = normalizeLabel(rawLabel);
  if (!label) return "";
  const key = normalizeKey(label);
  return canonicalLabelByKey(key) ?? label;
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
 * - 可能なら canonical を優先して返す（表示統一）
 * - tagToSlug() は normalizeKey() を通すため、大小文字などは元に戻せない
 */
export const slugToTag = (slug: string) => {
  const key = slugToKey(slug);
  const canonical = canonicalLabelByKey(key);
  if (canonical) return canonical;

  try {
    return normalizeLabel(decodeURIComponent(slug));
  } catch {
    return normalizeLabel(slug);
  }
};
