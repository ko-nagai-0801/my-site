// lib/posts.ts
import { readdir } from "node:fs/promises";
import path from "node:path";
import type React from "react";

export type PostMeta = {
  title: string;
  date: string; // ISO 8601 推奨: "2026-01-19T21:30:00+09:00"
  description?: string;
  tags?: string[];
  draft?: boolean;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export async function getPostSlugs() {
  const files = await readdir(POSTS_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPostBySlug(slug: string) {
  const mod = await import(`../content/posts/${slug}.mdx`);
  const meta = (mod.meta ?? {}) as PostMeta;
  const Content = mod.default as React.ComponentType;

  return { slug, meta, Content };
}

function toTime(dateStr: string) {
  const t = Date.parse(dateStr);
  return Number.isNaN(t) ? 0 : t;
}

export async function getAllPosts() {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map(getPostBySlug));

  const published = posts.filter((p) => !p.meta.draft);

  published.sort((a, b) => {
    const ad = toTime(a.meta.date);
    const bd = toTime(b.meta.date);
    if (bd !== ad) return bd - ad; // 日付降順（時刻込みでOK）
    return a.slug.localeCompare(b.slug, "ja"); // 同一時刻ならslugで固定
  });

  return published;
}

export async function getLatestPosts(limit = 3) {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}
