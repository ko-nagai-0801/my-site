/* lib/tags.ts */
import "server-only";

import { getAllPostLikes } from "@/lib/posts";
import { getAllWorks } from "@/lib/works";
import { normalizeKey, normalizeLabel, tagToSlug, slugToTag } from "@/lib/tag-normalize";

export { tagToSlug, slugToTag };

export type TagSummary = {
  tag: string;  // 表示ラベル
  slug: string; // encodeURIComponent(tag)
  total: number;
  posts: number;
  works: number;
};

export type TagDetail = {
  tag: string;        // 表示ラベル（canonical）
  normalized: string; // 比較用 key（互換のため名前は維持）
  posts: Array<Awaited<ReturnType<typeof getAllPostLikes>>[number]>;
  works: Array<Awaited<ReturnType<typeof getAllWorks>>[number]>;
};

type TagCounter = { tag: string; posts: number; works: number };

async function buildTagIndex() {
  const [posts, works] = await Promise.all([getAllPostLikes(), getAllWorks()]);
  const map = new Map<string, TagCounter>(); // key -> counter（tag は最初の表記を採用）

  const add = (raw: string, kind: "posts" | "works") => {
    const label = normalizeLabel(raw);
    if (!label) return;
    const key = normalizeKey(label);
    if (!key) return;

    const cur = map.get(key) ?? { tag: label, posts: 0, works: 0 };
    cur[kind] += 1;
    map.set(key, cur);
  };

  // 1コンテンツ内で同一タグ（表記ゆれ含む）が複数ある場合は 1 回だけ数える
  for (const p of posts) {
    const seen = new Set<string>();
    for (const t of p.meta.tags ?? []) {
      const key = normalizeKey(normalizeLabel(t));
      if (!key || seen.has(key)) continue;
      seen.add(key);
      add(t, "posts");
    }
  }

  for (const w of works) {
    const seen = new Set<string>();
    for (const t of w.meta.tags ?? []) {
      const key = normalizeKey(normalizeLabel(t));
      if (!key || seen.has(key)) continue;
      seen.add(key);
      add(t, "works");
    }
  }

  const list: TagSummary[] = Array.from(map.values())
    .map((v) => ({
      tag: v.tag,
      slug: tagToSlug(v.tag),
      posts: v.posts,
      works: v.works,
      total: v.posts + v.works,
    }))
    .sort((a, b) => {
      if (a.total !== b.total) return b.total - a.total;
      return a.tag.localeCompare(b.tag, "ja", { sensitivity: "base" });
    });

  return { posts, works, map, list };
}

export async function getAllTags(): Promise<TagSummary[]> {
  const { list } = await buildTagIndex();
  return list;
}

export async function getTagDetail(tagParam: string): Promise<TagDetail> {
  const requestedRaw = normalizeLabel(slugToTag(tagParam));
  const requestedKey = requestedRaw ? normalizeKey(requestedRaw) : "";

  const { posts, works, map } = await buildTagIndex();

  const canonicalLabel = requestedKey ? map.get(requestedKey)?.tag ?? requestedRaw : requestedRaw;

  const filteredPosts = requestedKey
    ? posts.filter((p) =>
        (p.meta.tags ?? []).some((t) => normalizeKey(normalizeLabel(t)) === requestedKey)
      )
    : [];

  const filteredWorks = requestedKey
    ? works.filter((w) =>
        (w.meta.tags ?? []).some((t) => normalizeKey(normalizeLabel(t)) === requestedKey)
      )
    : [];

  return {
    tag: canonicalLabel,
    normalized: requestedKey,
    posts: filteredPosts,
    works: filteredWorks,
  };
}
