/* lib/post-tags.ts */
import "server-only";

import { normalizeKey, normalizeLabel } from "@/lib/tag-normalize";

export { normalizeKey, normalizeLabel };

export type PostLikeForTags = {
  meta: {
    tags?: string[];
  };
};

export type TagEntry = { key: string; label: string };

export function buildPostTagMap<T extends PostLikeForTags>(posts: T[]) {
  const tagMap = new Map<string, string>();

  for (const p of posts) {
    const seen = new Set<string>();
    for (const t of p.meta.tags ?? []) {
      const label = normalizeLabel(t);
      if (!label) continue;

      const key = normalizeKey(label);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      if (!tagMap.has(key)) tagMap.set(key, label);
    }
  }

  return tagMap;
}

export function getPostTagList<T extends PostLikeForTags>(posts: T[]): TagEntry[] {
  const tagMap = buildPostTagMap(posts);

  return Array.from(tagMap.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, "ja", { sensitivity: "base" })
    );
}

export function getActivePostTag(tagRaw: string | undefined, tagMap: Map<string, string>) {
  const activeTagRaw = typeof tagRaw === "string" ? normalizeLabel(tagRaw) : "";
  const activeKey = activeTagRaw ? normalizeKey(activeTagRaw) : "";
  const activeLabel = activeKey ? tagMap.get(activeKey) ?? activeTagRaw : "";

  return { activeTagRaw, activeKey, activeLabel };
}

export function filterPostsByActiveTag<T extends PostLikeForTags>(posts: T[], activeKey: string) {
  if (!activeKey) return posts;

  return posts.filter((p) =>
    (p.meta.tags ?? []).some((t) => normalizeKey(normalizeLabel(t)) === activeKey)
  );
}
