/* lib/tags.ts */
import "server-only";

import { getAllPostLikes, type PostLike } from "@/lib/posts";
import { getAllWorks, type WorkItem } from "@/lib/works";

export type TagSummary = {
  tag: string; // 表示名（最初に出現した表記）
  slug: string; // URL用（encodeURIComponent済み）
  total: number;
  posts: number;
  works: number;
};

const normalize = (tag: string) => tag.trim().toLowerCase();

export const tagToSlug = (tag: string) => encodeURIComponent(tag.trim());
export const slugToTag = (slug: string) => decodeURIComponent(slug);

export async function getAllTags(): Promise<TagSummary[]> {
  const [posts, works] = await Promise.all([getAllPostLikes(), getAllWorks()]);

  const map = new Map<string, { tag: string; posts: number; works: number }>();

  for (const p of posts) {
    for (const raw of p.meta.tags ?? []) {
      const t = raw.trim();
      if (!t) continue;
      const key = normalize(t);

      const cur = map.get(key);
      if (!cur) map.set(key, { tag: t, posts: 1, works: 0 });
      else cur.posts += 1;
    }
  }

  for (const w of works) {
    for (const raw of w.meta.tags ?? []) {
      const t = raw.trim();
      if (!t) continue;
      const key = normalize(t);

      const cur = map.get(key);
      if (!cur) map.set(key, { tag: t, posts: 0, works: 1 });
      else cur.works += 1;
    }
  }

  const list: TagSummary[] = Array.from(map.values()).map((v) => ({
    tag: v.tag,
    slug: tagToSlug(v.tag),
    posts: v.posts,
    works: v.works,
    total: v.posts + v.works,
  }));

  // 件数多い順 → 名前で安定
  list.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.tag.localeCompare(b.tag, "ja");
  });

  return list;
}

export async function getTagDetail(tagParam: string): Promise<{
  tag: string;
  normalized: string;
  posts: PostLike[];
  works: WorkItem[];
}> {
  const tag = slugToTag(tagParam).trim();
  const normalized = normalize(tag);

  const [postsAll, worksAll] = await Promise.all([
    getAllPostLikes(),
    getAllWorks(),
  ]);

  const posts = postsAll.filter((p) =>
    (p.meta.tags ?? []).some((t) => normalize(t) === normalized)
  );

  const works = worksAll.filter((w) =>
    (w.meta.tags ?? []).some((t) => normalize(t) === normalized)
  );

  return { tag, normalized, posts, works };
}
