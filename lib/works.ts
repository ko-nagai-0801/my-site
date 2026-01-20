/* lib/works.ts */
import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type WorkImage = {
  src: string;
  alt: string;
};

export type WorkMeta = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  repo?: string;
  note?: string;
  order?: number;
  image?: WorkImage;
};

export type WorkIndexItem = {
  slug: string;
  meta: WorkMeta;
};

export type WorkDoc = WorkIndexItem & {
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

function assertWorkMeta(meta: unknown, slug: string): WorkMeta {
  if (!isRecord(meta)) {
    throw new Error(`Invalid frontmatter: ${slug}`);
  }

  const title = trimNonEmpty(meta.title) ?? "";
  if (!title) throw new Error(`Missing title: ${slug}`);

  const summary = trimNonEmpty(meta.summary) ?? "";
  if (!summary) throw new Error(`Missing summary: ${slug}`);

  const rawTags = meta.tags;
  if (
    !Array.isArray(rawTags) ||
    !rawTags.every((t) => typeof t === "string" && t.trim().length > 0)
  ) {
    throw new Error(`Invalid tags: ${slug}`);
  }
  const tags = rawTags.map((t) => t.trim());

  const href = trimNonEmpty(meta.href);
  const repo = trimNonEmpty(meta.repo);
  const note = trimNonEmpty(meta.note);

  const order =
    typeof meta.order === "number" && Number.isFinite(meta.order)
      ? meta.order
      : undefined;

  const rawImage = meta.image;
  const image =
    isRecord(rawImage) &&
    typeof rawImage.src === "string" &&
    typeof rawImage.alt === "string" &&
    rawImage.src.trim().length > 0 &&
    rawImage.alt.trim().length > 0
      ? { src: rawImage.src.trim(), alt: rawImage.alt.trim() }
      : undefined;

  return { title, summary, tags, href, repo, note, order, image };
}

async function readWorkFile(
  slug: string
): Promise<{ filePath: string; source: string } | null> {
  const mdxPath = path.join(WORKS_DIR, `${slug}.mdx`);
  const mdPath = path.join(WORKS_DIR, `${slug}.md`);

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

export async function getAllWorks(): Promise<WorkIndexItem[]> {
  const entries = await readdir(WORKS_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && /\.mdx?$/.test(e.name))
    .map((e) => e.name);

  const items = await Promise.all(
    files.map(async (name) => {
      const slug = toSlug(name);
      const source = await readFile(path.join(WORKS_DIR, name), "utf8");
      const { data } = matter(source);
      const meta = assertWorkMeta(data, slug);
      return { slug, meta } satisfies WorkIndexItem;
    })
  );

  // order があるものは昇順、無いものは後ろ。次に title で安定ソート
  items.sort((a, b) => {
    const ao = a.meta.order ?? Number.POSITIVE_INFINITY;
    const bo = b.meta.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return a.meta.title.localeCompare(b.meta.title, "ja");
  });

  return items;
}

export async function getWorkBySlug(slug: string): Promise<WorkDoc | null> {
  const file = await readWorkFile(slug);
  if (!file) return null;

  const { data, content } = matter(file.source);
  const meta = assertWorkMeta(data, slug);

  return { slug, meta, content };
}
