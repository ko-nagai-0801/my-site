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
  image?: { src: string; alt: string }; // ✅ 追加
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

function parseImage(
  value: unknown,
  fallbackAlt: string
): PostMeta["image"] | undefined {
  // ✅ 文字列で来た場合：src として採用（alt は title を補完）
  if (typeof value === "string") {
    const src = value.trim();
    if (!src) return undefined;
    return { src, alt: fallbackAlt };
  }

  // ✅ object の場合：{ src, alt } を見る（alt は title 補完）
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    const src = trimNonEmpty(v.src);
    if (!src) return undefined;
    const alt = trimNonEmpty(v.alt) ?? fallbackAlt;
    return { src, alt };
  }

  return undefined;
}

function assertPostMeta(
  meta: Record<string, unknown>,
  ctx: { slugFromFile: string; filename: string }
): PostMeta {
  const title = trimNonEmpty(meta.title);
  if (!title) throw new Error(`Missing title: ${ctx.filename}`);

  const source = trimNonEmpty(meta.source);
  if (source !== "blog") throw new Error(`Invalid source: ${ctx.filename}`);

  const slug = trimNonEmpty(meta.slug) ?? ctx.slugFromFile;
  if (!slug) throw new Error(`Missing slug: ${ctx.filename}`);

  // ✅ 仕様：ファイル名由来 slug と frontmatter slug は一致させる
  if (slug !== ctx.slugFromFile) {
    throw new Error(
      `Slug mismatch: ${ctx.slugFromFile} (frontmatter: ${slug}) in ${ctx.filename}`
    );
  }

  const date = normalizeDate(meta.date);
  if (!date) throw new Error(`Missing date: ${ctx.filename}`);
  if (!isValidDateString(date)) throw new Error(`Invalid date: ${ctx.filename}`);

  const description = trimNonEmpty(meta.description);
  const tags = toStringArray(meta.tags);

  // ✅ 追加：image
  const image = parseImage(meta.image, title);

  const draft = Boolean(meta.draft);

  return {
    title,
    slug,
    source: "blog",
    date,
    description,
    tags,
    image,
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

    const sff = slugFromFilename(filename);
    const meta = assertPostMeta(data as Record<string, unknown>, {
      slugFromFile: sff,
      filename,
    });

    if (meta.draft) continue;
    metas.push(meta);
  }

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

  const meta = assertPostMeta(data as Record<string, unknown>, {
    slugFromFile: slug,
    filename: found.filename,
  });

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
