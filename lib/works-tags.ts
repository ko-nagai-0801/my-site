/* lib/works-tags.ts */
import {
  canonicalLabelByKey,
  canonicalizeLabel,
  normalizeKey,
  normalizeLabel,
} from "@/lib/tag-normalize";

export type WorkLikeForTags = {
  slug: string;
  meta: {
    tags?: string[];
  };
};

export type WorkTagItem = {
  key: string;
  label: string;
};

const toKeyFromLabel = (raw: string) => {
  const label = normalizeLabel(raw);
  if (!label) return "";
  return normalizeKey(label);
};

const extractKeys = (tags: unknown): string[] => {
  if (!Array.isArray(tags)) return [];
  const keys = new Set<string>();
  for (const t of tags) {
    if (typeof t !== "string") continue;
    const key = toKeyFromLabel(t);
    if (key) keys.add(key);
  }
  return [...keys];
};

/**
 * key -> label の単一ソース（Works用）
 * - label は canonical（あれば）を優先して確定する
 */
export const buildWorkTagMap = <T extends WorkLikeForTags>(works: T[]) => {
  const map = new Map<string, string>();

  for (const w of works) {
    const keys = extractKeys(w.meta?.tags);
    for (const key of keys) {
      const canonical = canonicalLabelByKey(key);
      // mapが未登録なら確定
      if (!map.has(key)) {
        map.set(key, canonical ?? key);
        continue;
      }
      // canonical があるなら常に上書き（揺れを抑える）
      if (canonical && map.get(key) !== canonical) {
        map.set(key, canonical);
      }
    }

    // label候補が取れるときは、canonicalが無いkeyの表示用labelを安定させる
    const tags = Array.isArray(w.meta?.tags) ? w.meta.tags : [];
    for (const t of tags) {
      if (typeof t !== "string") continue;
      const label = canonicalizeLabel(t);
      if (!label) continue;
      const key = normalizeKey(label);
      if (!key) continue;
      if (!map.has(key)) map.set(key, label);
      const canonical = canonicalLabelByKey(key);
      if (canonical) map.set(key, canonical);
    }
  }

  return map;
};

/**
 * tagMap -> タグ一覧（chip用）
 */
export const getWorkTagList = (tagMap: Map<string, string>): WorkTagItem[] => {
  return [...tagMap.entries()]
    .map(([key, label]) => ({ key, label: canonicalLabelByKey(key) ?? label }))
    .filter((t) => t.key && t.label)
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
};

/**
 * /works?tag=... の active を決める
 * - URLのtagは「人が読めるlabel」を入れている想定
 * - 判定は normalizeKey(label) の key で行う
 */
export const getActiveWorkTag = (
  requestedTag: string | undefined,
  tagMap: Map<string, string>
) => {
  const raw = typeof requestedTag === "string" ? requestedTag : "";
  const label = normalizeLabel(raw);
  if (!label) return { activeKey: "", activeLabel: "" };

  const key = normalizeKey(label);
  if (!key) return { activeKey: "", activeLabel: "" };

  const activeLabel = tagMap.get(key) ?? canonicalLabelByKey(key) ?? canonicalizeLabel(label) ?? label;

  return { activeKey: key, activeLabel };
};

/**
 * Works を activeKey で絞る（比較は key のみ）
 */
export const filterWorksByActiveKey = <T extends WorkLikeForTags>(
  works: T[],
  activeKey: string
) => {
  if (!activeKey) return works;

  return works.filter((w) => {
    const tags = Array.isArray(w.meta?.tags) ? w.meta.tags : [];
    for (const t of tags) {
      if (typeof t !== "string") continue;
      const k = toKeyFromLabel(t);
      if (k === activeKey) return true;
    }
    return false;
  });
};
