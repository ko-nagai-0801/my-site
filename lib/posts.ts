import { readdir } from "node:fs/promises";
import path from "node:path";

export type PostMeta = {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export async function getPostSlugs() {
  const files = await readdir(POSTS_DIR);
  return files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPostBySlug(slug: string) {
  const mod = await import(`../content/posts/${slug}.mdx`);
  const meta = (mod.meta ?? {}) as PostMeta;
  const Content = mod.default as React.ComponentType;

  return { slug, meta, Content };
}

export async function getAllPosts() {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map(getPostBySlug));
  posts.sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
  return posts;
}

export async function getLatestPosts(limit = 3) {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}
