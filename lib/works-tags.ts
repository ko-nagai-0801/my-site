/* lib/works-tags.ts */
import "server-only";

export type WorkLikeForTags = {
  meta: {
    tags?: string[];
  };
};

export type WorkTagItem = {
  key: string;
  label: string;
};

// 表示用（見た目）は trim のみ
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
 * works の tags から tagMap を生成する
 * - key: normalizeKey(label)
 * - label: 最初に登場した表記を採用
 */
export function buildWorkTagMap(works: WorkLikeForTags[]): Map<string, string> {
  const tagMap = new Map<string, string>();

  for (const w of works) {
    for (const t of w.meta.tags ?? []) {
      const label = normalizeLabel(t);
      if (!label) continue;

      const key = normalizeKey(label);
      if (!tagMap.has(key)) tagMap.set(key, label);
    }
  }

  return tagMap;
}

/**
 * Tag list を作る（ソート済み）
 * ✅ works からでも tagMap からでも作れるようにして、呼び出し側の重複を減らす
 */
export function getWorkTagList(works: WorkLikeForTags[]): WorkTagItem[];
export function getWorkTagList(tagMap: Map<string, string>): WorkTagItem[];
export function getWorkTagList(
  input: WorkLikeForTags[] | Map<string, string>
): WorkTagItem[] {
  const tagMap = input instanceof Map ? input : buildWorkTagMap(input);

  return Array.from(tagMap.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, "ja", { sensitivity: "base" })
    );
}

/**
 * クエリ(tag)から activeKey/activeLabel を解決する
 * - tagParam は decodeURIComponent しない（Next側でデコード済みのケースがある）
 */
export function getActiveWorkTag(
  tagParam: unknown,
  tagMap: Map<string, string>
): { activeKey: string; activeLabel: string } {
  const raw = typeof tagParam === "string" ? normalizeLabel(tagParam) : "";
  const activeKey = raw ? normalizeKey(raw) : "";
  const activeLabel = activeKey ? tagMap.get(activeKey) ?? raw : "";
  return { activeKey, activeLabel };
}

/**
 * activeKey がある場合だけフィルタする（比較は key で）
 */
export function filterWorksByActiveKey<T extends WorkLikeForTags>(
  works: T[],
  activeKey: string
): T[] {
  if (!activeKey) return works;

  return works.filter((w) =>
    (w.meta.tags ?? []).some((t) => normalizeKey(normalizeLabel(t)) === activeKey)
  );
}
