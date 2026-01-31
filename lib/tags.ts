/* lib/tags.ts */
import { getAllPostLikes } from "@/lib/posts";
import { getAllWorks } from "@/lib/works";
import {
  canonicalLabelByKey,
  canonicalizeLabel,
  slugToKey,
  slugToTag,
  normalizeKey,
  normalizeLabel,
} from "@/lib/tag-normalize";

export { slugToTag } from "@/lib/tag-normalize";

type PostLike = Awaited<ReturnType<typeof getAllPostLikes>>[number];
type WorkLike = Awaited<ReturnType<typeof getAllWorks>>[number];

export type TagSummary = {
  key: string;   // 正規化キー
  slug: string;  // encodeURIComponent(key)
  label: string; // 表示ラベル（canonical優先）
  postCount: number;
  workCount: number;
  totalCount: number;
};

export type TagDetail = {
  key: string;
  tag: string; // 表示ラベル
  posts: PostLike[];
  works: WorkLike[];
};

const toKeysFromTags = (tags: unknown): string[] => {
  if (!Array.isArray(tags)) return [];
  const set = new Set<string>();
  for (const t of tags) {
    if (typeof t !== "string") continue;
    const label = normalizeLabel(t);
    if (!label) continue;
    const key = normalizeKey(label);
    if (key) set.add(key);
  }
  return [...set];
};

const hasKey = (tags: unknown, key: string) => {
  if (!Array.isArray(tags)) return false;
  for (const t of tags) {
    if (typeof t !== "string") continue;
    const label = normalizeLabel(t);
    if (!label) continue;
    const k = normalizeKey(label);
    if (k === key) return true;
  }
  return false;
};

const preferCanonicalLabel = (key: string, fallbackLabel: string) => {
  const canonical = canonicalLabelByKey(key);
  if (canonical) return canonical;
  const l = canonicalizeLabel(fallbackLabel);
  return l || fallbackLabel;
};

/**
 * ✅ /tags 用：Blog/Works 共通のタグ一覧
 * - key を単一ソースにして、label は canonical を優先
 * - count は「そのタグを持つ post/work の件数」
 */
export async function getAllTags(): Promise<TagSummary[]> {
  const [posts, works] = await Promise.all([getAllPostLikes(), getAllWorks()]);

  const map = new Map<
    string,
    { label: string; postCount: number; workCount: number }
  >();

  // posts
  for (const p of posts) {
    const keys = toKeysFromTags(p.meta?.tags);
    for (const key of keys) {
      const row = map.get(key) ?? { label: preferCanonicalLabel(key, key), postCount: 0, workCount: 0 };
      row.postCount += 1;
      row.label = preferCanonicalLabel(key, row.label);
      map.set(key, row);
    }

    // labelの候補（canonicalが無いkeyの表示を安定させる）
    const tags = Array.isArray(p.meta?.tags) ? p.meta.tags : [];
    for (const t of tags) {
      if (typeof t !== "string") continue;
      const label = canonicalizeLabel(t);
      if (!label) continue;
      const key = normalizeKey(label);
      if (!key) continue;
      const row = map.get(key) ?? { label, postCount: 0, workCount: 0 };
      row.label = preferCanonicalLabel(key, row.label);
      map.set(key, row);
    }
  }

  // works
  for (const w of works) {
    const keys = toKeysFromTags(w.meta?.tags);
    for (const key of keys) {
      const row = map.get(key) ?? { label: preferCanonicalLabel(key, key), postCount: 0, workCount: 0 };
      row.workCount += 1;
      row.label = preferCanonicalLabel(key, row.label);
      map.set(key, row);
    }

    const tags = Array.isArray(w.meta?.tags) ? w.meta.tags : [];
    for (const t of tags) {
      if (typeof t !== "string") continue;
      const label = canonicalizeLabel(t);
      if (!label) continue;
      const key = normalizeKey(label);
      if (!key) continue;
      const row = map.get(key) ?? { label, postCount: 0, workCount: 0 };
      row.label = preferCanonicalLabel(key, row.label);
      map.set(key, row);
    }
  }

  return [...map.entries()]
    .map(([key, v]) => ({
      key,
      slug: encodeURIComponent(key),
      label: preferCanonicalLabel(key, v.label),
      postCount: v.postCount,
      workCount: v.workCount,
      totalCount: v.postCount + v.workCount,
    }))
    .filter((t) => t.key && t.label && t.totalCount > 0)
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}

/**
 * ✅ /tags/[tag] 用：タグ詳細（Blog/Works 共通）
 * - tagParam は slug（= encodeURIComponent(key)）
 */
export async function getTagDetail(tagParam: string): Promise<TagDetail> {
  const [posts, works, tags] = await Promise.all([
    getAllPostLikes(),
    getAllWorks(),
    getAllTags(), // canonical label を得るため
  ]);

  const key = slugToKey(tagParam);

  const fromList = tags.find((t) => t.key === key)?.label;
  const labelFallback = fromList ?? canonicalLabelByKey(key) ?? slugToTag(tagParam);

  const filteredPosts = posts.filter((p) => hasKey(p.meta?.tags, key));
  const filteredWorks = works.filter((w) => hasKey(w.meta?.tags, key));

  return {
    key,
    tag: preferCanonicalLabel(key, labelFallback),
    posts: filteredPosts,
    works: filteredWorks,
  };
}
