// lib/posts.ts
import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  // 共通
  title: string;
  slug: string;
  source: string;

  // posts 用
  date: string; // ISO 8601 推奨: "2026-01-19T21:30:00+09:00"
  description: string;
  tags: string[];
  draft?: boolean;
};

export type PostIndexItem = {
  slug: string;
  meta: PostMeta;
};

export type PostDoc = PostIndexItem & {
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const toSlug = (filename: string) => filename.replace(/\.mdx?$/, "");

const trimNonEmpty = (v: unknown): string | undefined => {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length > 0 ? s : undefined;
};

const isValidDateString = (v: string) => {
  const t = Date.parse(v);
  return !Number.isNaN(t);
};

function assertPostMeta(meta: unknown, slugFromFile: string): PostMeta {
  if (!isRecord(meta)) {
    throw new Error(`Invalid frontmatter: ${slugFromFile}`);
  }

  const title = trimNonEmpty(meta.title) ?? "";
  if (!title) throw new Error(`Missing title: ${slugFromFile}`);

  const slug = trimNonEmpty(meta.slug) ?? "";
  if (!slug) throw new Error(`Missing slug: ${slugFromFile}`);

  // ファイル名(slug) と frontmatter.slug の不一致を防ぐ（運用が崩れにくい）
  if (slug !== slugFromFile) {
    throw new Error(
      `Slug mismatch: file=${slugFromFile} frontmatter.slug=${slug}`
    );
  }

  const source = trimNonEmpty(meta.source) ?? "";
  if (!source) throw new Error(`Missing source: ${slugFromFile}`);

  const date = trimNonEmpty(meta.date) ?? "";
  if (!date) throw new Error(`Missing date: ${slugFromFile}`);
  if (!isValidDateString(date)) throw new Error(`Invalid date: ${slugFromFile}`);

  const description = trimNonEmpty(meta.description) ?? "";
  if (!description) throw new Error(`Missing description: ${slugFromFile}`);

  const rawTags = meta.tags;
  if (
    !Array.isArray(rawTags) ||
    !rawTags.every((t) => typeof t === "string" && t.trim().length > 0)
  ) {
    throw new Error(`Invalid tags: ${slugFromFile}`);
  }
  const tags = rawTags.map((t) => t.trim());

  const draft = typeof meta.draft === "boolean" ? meta.draft : undefined;

  return { title, slug, source, date, description, tags, draft };
}

async function readPostFile(
  slug: string
): Promise<{ filePath: string; source: string } | null> {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);

  try {
    const source = await readFile(mdxPath, "utf8");
    return { filePath: mdxPath, source };
  } catch {
    // .mdx が無ければ .md を試す（将来用）
  }

  try {
    const source = await readFile(mdPath, "utf8");
    return { filePath: mdPath, source };
  } catch {
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const entries = await readdir(POSTS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.mdx?$/.test(e.name))
    .map((e) => toSlug(e.name));
}

export async function getAllPosts(): Promise<PostIndexItem[]> {
  const slugs = await getPostSlugs();

  const items = await Promise.all(
    slugs.map(async (slug) => {
      const file = await readPostFile(slug);
      if (!file) throw new Error(`Missing post file: ${slug}`);

      const { data } = matter(file.source);
      const meta = assertPostMeta(data, slug);
      return { slug, meta } satisfies PostIndexItem;
    })
  );

  // draft を除外 → 日付降順 → slugで安定
  const published = items.filter((p) => !p.meta.draft);

  published.sort((a, b) => {
    const ad = Date.parse(a.meta.date);
    const bd = Date.parse(b.meta.date);
    if (bd !== ad) return bd - ad;
    return a.slug.localeCompare(b.slug, "ja");
  });

  return published;
}

export async function getLatestPosts(limit = 3): Promise<PostIndexItem[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<PostDoc | null> {
  const file = await readPostFile(slug);
  if (!file) return null;

  const { data, content } = matter(file.source);
  const meta = assertPostMeta(data, slug);

  return { slug, meta, content };
}
