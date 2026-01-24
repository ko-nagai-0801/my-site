// lib/works.ts
import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type WorkMeta = {
  title: string;
  summary: string;
  tags: string[]; // ここは常に配列（無ければ []）
  href?: string;
  repo?: string;
  note?: string;
  order?: number;
  image?: {
    src: string;
    alt: string;
  };
};

export type WorkItem = {
  slug: string;
  meta: WorkMeta;
};

export type WorkDetail = WorkItem & {
  content: string;
};

const WORKS_DIR = path.join(process.cwd(), "content", "works");

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const toSlug = (filename: string) => filename.replace(/\.mdx?$/, "");

const trimNonEmpty = (v: unknown): string | undefined => {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length > 0 ? s : undefined;
};

function assertWorkMeta(meta: unknown, slugFromFile: string): WorkMeta {
  if (!isRecord(meta)) {
    throw new Error(`Invalid frontmatter: ${slugFromFile}`);
  }

  const title = trimNonEmpty(meta.title) ?? "";
  if (!title) throw new Error(`Missing title: ${slugFromFile}`);

  const summary = trimNonEmpty(meta.summary) ?? "";
  if (!summary) throw new Error(`Missing summary: ${slugFromFile}`);

  // ✅ tags は任意：無ければ []
  const rawTags = (meta as Record<string, unknown>).tags;
  let tags: string[] = [];

  if (rawTags === undefined || rawTags === null) {
    tags = [];
  } else if (Array.isArray(rawTags)) {
    if (!rawTags.every((t) => typeof t === "string" && t.trim().length > 0)) {
      throw new Error(`Invalid tags: ${slugFromFile}`);
    }
    tags = rawTags.map((t) => t.trim());
  } else {
    // string 等は弾く（運用が崩れるので）
    throw new Error(`Invalid tags: ${slugFromFile}`);
  }

  const href = trimNonEmpty(meta.href);
  const repo = trimNonEmpty(meta.repo);
  const note = trimNonEmpty(meta.note);

  const order =
    typeof meta.order === "number" && Number.isFinite(meta.order)
      ? meta.order
      : undefined;

  const imageRaw = (meta as Record<string, unknown>).image;
  const image =
    isRecord(imageRaw) &&
    typeof imageRaw.src === "string" &&
    typeof imageRaw.alt === "string" &&
    imageRaw.src.trim().length > 0 &&
    imageRaw.alt.trim().length > 0
      ? { src: imageRaw.src.trim(), alt: imageRaw.alt.trim() }
      : undefined;

  return {
    title,
    summary,
    tags,
    href,
    repo,
    note,
    order,
    image,
  };
}

async function readWorkFile(slug: string) {
  const mdxPath = path.join(WORKS_DIR, `${slug}.mdx`);
  const mdPath = path.join(WORKS_DIR, `${slug}.md`);

  try {
    const source = await readFile(mdxPath, "utf8");
    return { filePath: mdxPath, source };
  } catch {
    // .mdx が無ければ .md を試す
  }

  try {
    const source = await readFile(mdPath, "utf8");
    return { filePath: mdPath, source };
  } catch {
    return null;
  }
}

async function getWorkSlugs() {
  const entries = await readdir(WORKS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.mdx?$/.test(e.name))
    .map((e) => toSlug(e.name));
}

export async function getAllWorks(): Promise<WorkItem[]> {
  const slugs = await getWorkSlugs();
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const file = await readWorkFile(slug);
      if (!file) throw new Error(`Missing work file: ${slug}`);
      const { data } = matter(file.source);
      const meta = assertWorkMeta(data, slug);
      return { slug, meta };
    })
  );

  // order 昇順 → title で安定
  items.sort((a, b) => {
    const ao = a.meta.order ?? Number.POSITIVE_INFINITY;
    const bo = b.meta.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return a.meta.title.localeCompare(b.meta.title, "ja");
  });

  return items;
}

export async function getWorkBySlug(slug: string): Promise<WorkDetail | null> {
  const file = await readWorkFile(slug);
  if (!file) return null;

  const { data, content } = matter(file.source);
  const meta = assertWorkMeta(data, slug);

  return { slug, meta, content };
}
