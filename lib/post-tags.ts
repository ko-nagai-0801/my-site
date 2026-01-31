/* lib/post-tags.ts */
import { normalizeKey, normalizeLabel, slugToKey, tagToSlug } from "@/lib/tag-normalize";

export type PostLikeForTags = {
  slug: string;
  meta: {
    tags?: string[] | null;
  };
};

export type TagItem = {
  key: string;
  label: string;
  slug: string;
};

function toTagLabels(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * ✅ posts から tagMap(key -> label) を生成
 * - label は normalizeLabel を通す
 * - key は normalizeKey を通す（比較は key で統一）
 */
export function buildPostTagMap(posts: PostLikeForTags[]): Map<string, string> {
  const map = new Map<string, string>();

  for (const p of posts) {
    const rawTags = toTagLabels(p.meta?.tags);
    for (const raw of rawTags) {
      const label = normalizeLabel(raw);
      const key = normalizeKey(label);
      if (!key) continue;

      // 既に同じ key があれば、最初の label を優先（表記ブレを抑える）
      if (!map.has(key)) map.set(key, label);
    }
  }

  return map;
}

/**
 * ✅ tagMap から表示用の tag list を生成（slug 付き）
 */
export function getPostTagList(tagMap: Map<string, string>): TagItem[] {
  const list: TagItem[] = [];

  for (const [key, label] of tagMap.entries()) {
    list.push({ key, label, slug: tagToSlug(label) });
  }

  // label の見た目でソート（読みやすさ優先）
  list.sort((a, b) => a.label.localeCompare(b.label, "ja"));

  return list;
}

/**
 * ✅ /blog?tag=... の tagParam を “key/slug” 両対応で解釈して active を返す
 * - tag=Label でも tag=slug でも OK（事故防止）
 */
export function getActivePostTag(
  tagParam: string | undefined,
  tagMap: Map<string, string>
): { activeKey: string | null; activeLabel: string | null; activeSlug: string | null } {
  if (!tagParam) return { activeKey: null, activeLabel: null, activeSlug: null };

  // まず “label想定” で key を作る
  const byLabelKey = normalizeKey(normalizeLabel(tagParam));
  if (byLabelKey && tagMap.has(byLabelKey)) {
    const label = tagMap.get(byLabelKey) ?? null;
    return {
      activeKey: byLabelKey,
      activeLabel: label,
      activeSlug: label ? tagToSlug(label) : null,
    };
  }

  // 次に “slug想定” で key を作る
  const bySlugKey = slugToKey(tagParam);
  if (bySlugKey && tagMap.has(bySlugKey)) {
    const label = tagMap.get(bySlugKey) ?? null;
    return {
      activeKey: bySlugKey,
      activeLabel: label,
      activeSlug: label ? tagToSlug(label) : null,
    };
  }

  return { activeKey: null, activeLabel: null, activeSlug: null };
}

/**
 * ✅ activeKey がある時だけ絞り込み（比較は key）
 */
export function filterPostsByActiveKey<T extends PostLikeForTags>(
  posts: T[],
  activeKey: string | null | undefined
): T[] {
  if (!activeKey) return posts;

  return posts.filter((p) => {
    const rawTags = toTagLabels(p.meta?.tags);
    return rawTags.some((raw) => normalizeKey(normalizeLabel(raw)) === activeKey);
  });
}
