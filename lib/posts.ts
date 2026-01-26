// lib/posts.ts
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  title: string;
  slug: string;
  source: "blog";
  date: string; // ISO string (ex: "2026-01-26T00:00:00+09:00" or "2026-01-25T15:00:00.000Z")
  description?: string;
  tags?: string[];
  draft?: boolean;
};

export type Post = {
  meta: PostMeta;
  content: string;
};

/**
 * ✅ 一覧表示用（PostsList向け）
 * - PostsList が { meta } 形式を要求しているため、ここで統一して供給する
 */
export type PostLike = {
  meta: PostMeta;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function trimNonEmpty(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  return v.length ? v : undefined;
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const arr = value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
  return arr.length ? arr : undefined;
}

/**
 * gray-matter が YAML を Date として解釈することがあるため、
 * date は string / Date を許容して最終的に string に正規化する。
 */
function normalizeDate(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value instanceof Date) return value.toISOString();
  // まれに number (timestamp) になるケースも保険で吸収
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }
  return "";
}

function isValidDateString(value: string): boolean {
  // "YYYY-MM-DD" / ISO 8601 / "....Z" などを許容して Date.parse で判定
  const t = Date.parse(value);
  return !Number.isNaN(t);
}

function slugFromFilename(filename: string): string {
  // 例: "2026-01-26-pretty-code-tuning-log.mdx" -> "pretty-code-tuning-log"
  const base = filename.replace(/\.(md|mdx)$/i, "");
  return base.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function assertPostMeta(
  meta: Record<string, unknown>,
  slugFromFile: string
): PostMeta {
  const title = trimNonEmpty(meta.title);
  if (!title) throw new Error(`Missing title: ${slugFromFile}`);

  const source = trimNonEmpty(meta.source);
  if (source !== "blog") throw new Error(`Invalid source: ${slugFromFile}`);

  const slug = trimNonEmpty(meta.slug) ?? slugFromFile;
  if (!slug) throw new Error(`Missing slug: ${slugFromFile}`);
  if (slug !== slugFromFile) {
    // ファイル名由来slugとfrontmatterのslugがズレたら気づけるように
    throw new Error(`Slug mismatch: ${slugFromFile} (frontmatter: ${slug})`);
  }

  const date = normalizeDate(meta.date);
  if (!date) throw new Error(`Missing date: ${slugFromFile}`);
  if (!isValidDateString(date)) throw new Error(`Invalid date: ${slugFromFile}`);

  const description = trimNonEmpty(meta.description);
  const tags = toStringArray(meta.tags);
  const draft = Boolean(meta.draft);

  return {
    title,
    slug,
    source: "blog",
    date,
    description,
    tags,
    draft,
  };
}

async function readPostFileBySlug(
  slug: string
): Promise<{ filename: string; fullpath: string } | null> {
  const files = await readdir(BLOG_DIR);
  const candidates = files.filter((f) => /\.(md|mdx)$/i.test(f));

  for (const filename of candidates) {
    const s = slugFromFilename(filename);
    if (s === slug) {
      return { filename, fullpath: path.join(BLOG_DIR, filename) };
    }
  }
  return null;
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await readdir(BLOG_DIR);
  const targets = files.filter((f) => /\.(md|mdx)$/i.test(f));

  const metas: PostMeta[] = [];

  for (const filename of targets) {
    const fullpath = path.join(BLOG_DIR, filename);
    const raw = await readFile(fullpath, "utf8");
    const { data } = matter(raw);

    const slugFromFile = slugFromFilename(filename);
    const meta = assertPostMeta(data as Record<string, unknown>, slugFromFile);

    // draft は一覧から除外
    if (meta.draft) continue;

    metas.push(meta);
  }

  // 新しい順
  metas.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  return metas;
}

/**
 * ✅ PostsList向け：{ meta } 形式で返す
 */
export async function getAllPostLikes(): Promise<PostLike[]> {
  const metas = await getAllPosts();
  return metas.map((meta) => ({ meta }));
}

/**
 * ✅ TOPなど「最新n件」向け
 * app/page.tsx が import している想定の関数名をここで提供する
 */
export async function getLatestPosts(limit = 3): Promise<PostLike[]> {
  const all = await getAllPostLikes();
  return all.slice(0, Math.max(0, limit));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const found = await readPostFileBySlug(slug);
  if (!found) return null;

  const raw = await readFile(found.fullpath, "utf8");
  const { data, content } = matter(raw);

  const meta = assertPostMeta(data as Record<string, unknown>, slug);
  if (meta.draft) return null;

  return { meta, content };
}

export async function getPostBySlugOrThrow(slug: string): Promise<Post> {
  const post = await getPostBySlug(slug);
  if (!post) throw new Error(`Post not found: ${slug}`);
  return post;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
