/* lib/posts.ts */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

export type PostImage = {
  src: string;
  alt: string;
};

export type PostMeta = {
  title: string;
  slug: string;
  source: "blog";
  date: string; // ISO string
  description?: string;
  tags?: string[];
  draft?: boolean;

  // ✅ 追加：記事サムネ（16:10 / 1600x1000 推奨）
  image?: PostImage;
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

function trimNonEmpty(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  return v.length ? v : undefined;
}

/**
 * tags を
 * - trim
 * - 空を除去
 * - 重複を除去（順序は維持）
 */
function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const out: string[] = [];
  const seen = new Set<string>();

  for (const v of value) {
    if (typeof v !== "string") continue;
    const t = v.trim();
    if (!t) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }

  return out.length ? out : undefined;
}

/**
 * gray-matter が YAML を Date として解釈することがあるため、
 * date は string / Date / number を許容して最終的に string に正規化する。
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

type FrontmatterImage =
  | { src?: unknown; alt?: unknown }
  | string
  | undefined;

function normalizeImage(value: unknown, fallbackAlt: string): PostImage | undefined {
  if (!value) return undefined;

  // image: "/images/blog/foo.webp"
  if (typeof value === "string") {
    const src = value.trim();
    if (!src) return undefined;
    return { src, alt: fallbackAlt };
  }

  // image: { src: "...", alt: "..." }
  if (typeof value === "object" && value !== null) {
    const v = value as Record<string, unknown>;
    const src = trimNonEmpty(v.src);
    if (!src) return undefined;
    const alt = trimNonEmpty(v.alt) ?? fallbackAlt;
    return { src, alt };
  }

  return undefined;
}

function assertPostMeta(meta: Record<string, unknown>, slugFromFile: string): PostMeta {
  const title = trimNonEmpty(meta.title);
  if (!title) throw new Error(`Missing title: ${slugFromFile}`);

  const source = trimNonEmpty(meta.source);
  if (source !== "blog") throw new Error(`Invalid source: ${slugFromFile}`);

  // ✅ slug は frontmatter 必須にせず、ファイル名からの値と一致を強制
  const slug = trimNonEmpty(meta.slug) ?? slugFromFile;
  if (!slug) throw new Error(`Missing slug: ${slugFromFile}`);

  if (slug !== slugFromFile) {
    // 例のエラー（template / tempate）を、より分かりやすく
    throw new Error(
      `Slug mismatch: expected "${slugFromFile}" (frontmatter: "${slug}")`
    );
  }

  const date = normalizeDate(meta.date);
  if (!date) throw new Error(`Missing date: ${slugFromFile}`);
  if (!isValidDateString(date)) throw new Error(`Invalid date: ${slugFromFile}`);

  const description = trimNonEmpty(meta.description);
  const tags = toStringArray(meta.tags);
  const draft = Boolean(meta.draft);

  // ✅ 追加：image
  const image = normalizeImage(meta.image as FrontmatterImage, title);

  return {
    title,
    slug,
    source: "blog",
    date,
    description,
    tags,
    draft,
    image,
  };
}

/**
 * ✅ ファイル一覧をキャッシュ（getAllPosts / getPostBySlug のムダを減らす）
 */
const listPostFiles = cache(async () => {
  const files = await readdir(BLOG_DIR);
  return files.filter((f) => /\.(md|mdx)$/i.test(f));
});

/**
 * ✅ slug -> filename のマップをキャッシュ
 * - slug は filename から導出する（frontmatter ではなく）
 */
const getSlugToFileMap = cache(async () => {
  const files = await listPostFiles();
  const map = new Map<string, string>();

  for (const filename of files) {
    const s = slugFromFilename(filename);
    if (!s) continue;

    // 同一slugが複数存在する異常系
    if (map.has(s)) {
      throw new Error(`Duplicate slug detected: "${s}"`);
    }
    map.set(s, filename);
  }

  return map;
});

async function readPostFileBySlug(
  slug: string
): Promise<{ filename: string; fullpath: string } | null> {
  const map = await getSlugToFileMap();
  const filename = map.get(slug);
  if (!filename) return null;
  return { filename, fullpath: path.join(BLOG_DIR, filename) };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await listPostFiles();
  const metas: PostMeta[] = [];

  for (const filename of files) {
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

  // ✅ frontmatter slug とファイルslugの一致を assert で保証
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
