/* lib/works-tags.ts */
export type WorkLikeForTags = {
  meta: {
    tags?: string[];
  };
};

// 表示用（見た目）は trim のみ
export const normalizeWorkTagLabel = (s: string) => s.trim();

/**
 * 比較用（重複排除・一致判定）を強める
 * - NFKC：全角/半角などのゆれを吸収
 * - 連続空白を1つに潰す
 * - lower：大小文字ゆれを吸収（比較用だけ）
 */
export const normalizeWorkTagKey = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/**
 * ✅ Worksの全タグを「比較key」で重複排除しつつ、
 * 表示ラベルは最初に見つかった表記を採用する
 */
export function buildWorkTagMap<T extends WorkLikeForTags>(works: T[]) {
  const tagMap = new Map<string, string>(); // key -> label

  for (const w of works) {
    const tags = w.meta.tags ?? [];
    for (const t of tags) {
      const label = normalizeWorkTagLabel(t);
      if (!label) continue;

      const key = normalizeWorkTagKey(label);
      if (!tagMap.has(key)) tagMap.set(key, label);
    }
  }

  return tagMap;
}

export function getWorkTagList(tagMap: Map<string, string>) {
  return Array.from(tagMap.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "ja", { sensitivity: "base" }));
}

export function getActiveWorkTag(
  rawTag: unknown,
  tagMap: Map<string, string>
): { activeTagRaw: string; activeKey: string; activeLabel: string } {
  const activeTagRaw = typeof rawTag === "string" ? normalizeWorkTagLabel(rawTag) : "";
  const activeKey = activeTagRaw ? normalizeWorkTagKey(activeTagRaw) : "";
  const activeLabel = activeKey ? tagMap.get(activeKey) ?? activeTagRaw : "";
  return { activeTagRaw, activeKey, activeLabel };
}

export function filterWorksByActiveTag<T extends WorkLikeForTags>(works: T[], activeKey: string) {
  if (!activeKey) return works;

  return works.filter((w) =>
    (w.meta.tags ?? []).some(
      (t) => normalizeWorkTagKey(normalizeWorkTagLabel(t)) === activeKey
    )
  );
}
