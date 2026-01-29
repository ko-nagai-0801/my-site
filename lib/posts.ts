/* lib/posts.ts */
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
 * - PostsList 側が top-level の slug を要求するため、ここで供給する
 */
export type PostLike = {
  slug: string;
  meta: PostMeta;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// --------------------
// Utils
// --------------------

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

  if (!arr.length) return undefined;

  // 重複は軽く除去（完全一致のみ）
  const uniq = Array.from(new Set(arr));
  return uniq.length ? uniq : undefined;
}

/**
 * ✅ draft の解釈を厳密に
 * - YAMLで "false"（文字列）になっても false 扱いできるように
 */
function toBoolean(value: unknown): boolean {
  if (value === true) return true;
  if (value === false) return false;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  return false;
}

/**
 * gray-matter が YAML を Date として解釈することがあるため、
 * date は string / Date / number(timestamp) を許容して最終的に string に正規化する。
 */
function normalizeDate(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }
  return "";
}

function isValidDateString(value: string): boolean {
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

  // ファイル名由来slugとfrontmatterのslugがズレたら気づけるように
  if (slug !== slugFromFile) {
    throw new Error(`Slug mismatch: ${slugFromFile} (frontmatter: ${slug})`);
  }

  const date = normalizeDate(meta.date);
  if (!date) throw new Error(`Missing date: ${slugFromFile}`);
  if (!isValidDateString(date)) {
    throw new Error(`Invalid date: ${slugFromFile} (value: ${String(meta.date)})`);
  }

  const description = trimNonEmpty(meta.description);
  const tags = toStringArray(meta.tags);
  const draft = toBoolean(meta.draft);

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

// --------------------
// Slug index cache (I/O削減)
// --------------------

type FileEntry = { filename: string; fullpath: string };

let slugIndexPromise: Promise<Map<string, FileEntry>> | null = null;

async function buildSlugIndex(): Promise<Map<string, FileEntry>> {
  const files = await readdir(BLOG_DIR);
  const targets = files.filter((f) => /\.(md|mdx)$/i.test(f));

  const map = new Map<string, FileEntry>();
  for (const filename of targets) {
    const slug = slugFromFilename(filename);
    // 同一slugがあれば後勝ち（通常は起きない想定）
    map.set(slug, { filename, fullpath: path.join(BLOG_DIR, filename) });
  }
  return map;
}

async function ensureSlugIndex(): Promise<Map<string, FileEntry>> {
  if (!slugIndexPromise) {
    slugIndexPromise = buildSlugIndex();
  }
  return slugIndexPromise;
}

async function readPostFileBySlug(slug: string): Promise<FileEntry | null> {
  const index = await ensureSlugIndex();
  return index.get(slug) ?? null;
}

// --------------------
// Public APIs
// --------------------

export async function getAllPosts(): Promise<PostMeta[]> {
  const index = await ensureSlugIndex();
  const entries = Array.from(index.entries()); // [slug, {filename, fullpath}]

  const metas: PostMeta[] = [];

  for (const [slugFromFile, entry] of entries) {
    const raw = await readFile(entry.fullpath, "utf8");
    const { data } = matter(raw);

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
 * ✅ PostsList向け：{ slug, meta } 形式で返す
 */
export async function getAllPostLikes(): Promise<PostLike[]> {
  const metas = await getAllPosts();
  return metas.map((meta) => ({ slug: meta.slug, meta }));
}

/**
 * ✅ TOPなど「最新n件」向け
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
  const index = await ensureSlugIndex();
  return Array.from(index.keys());
}
