/* lib/post-tags.ts */
import {
  canonicalLabelByKey,
  canonicalizeLabel,
  normalizeKey,
  normalizeLabel,
} from "@/lib/tag-normalize";

export type PostLikeForTags = {
  slug: string;
  meta: {
    tags?: string[];
  };
};

export type PostTagItem = {
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
 * key -> label の単一ソース（Blog用）
 * - label は canonical（あれば）を優先して確定する
 */
export const buildPostTagMap = <T extends PostLikeForTags>(posts: T[]) => {
  const map = new Map<string, string>();

  for (const p of posts) {
    const keys = extractKeys(p.meta?.tags);
    for (const key of keys) {
      const canonical = canonicalLabelByKey(key);
      if (!map.has(key)) {
        map.set(key, canonical ?? key);
        continue;
      }
      if (canonical && map.get(key) !== canonical) {
        map.set(key, canonical);
      }
    }

    const tags = Array.isArray(p.meta?.tags) ? p.meta.tags : [];
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
 * tagMap -> タグ一覧（/tags 用）
 */
export const getPostTagList = (tagMap: Map<string, string>): PostTagItem[] => {
  return [...tagMap.entries()]
    .map(([key, label]) => ({ key, label: canonicalLabelByKey(key) ?? label }))
    .filter((t) => t.key && t.label)
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
};

/**
 * Posts を activeKey で絞る（比較は key のみ）
 */
export const filterPostsByActiveKey = <T extends PostLikeForTags>(
  posts: T[],
  activeKey: string
) => {
  if (!activeKey) return posts;

  return posts.filter((p) => {
    const tags = Array.isArray(p.meta?.tags) ? p.meta.tags : [];
    for (const t of tags) {
      if (typeof t !== "string") continue;
      const k = toKeyFromLabel(t);
      if (k === activeKey) return true;
    }
    return false;
  });
};
