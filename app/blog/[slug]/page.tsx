// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";

type Props = {
  // Next.js の型生成に合わせて Promise 扱い
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found | My Site" };

  return {
    title: `${post.meta.title} | My Site`,
    description: post.meta.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              // 見出し全体をリンク化しない（青＋下線になりにくい）
              behavior: "append",
              properties: {
                className: ["heading-anchor"],
                "aria-label": "見出しへのリンク",
              },
              content: { type: "text", value: "#" },
            },
          ],
        ],
      },
    },
  });

  return (
    <main className="container py-14">
      <header className="max-w-3xl">
        <p className="text-xs tracking-[0.22em] uppercase text-muted">Blog</p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {post.meta.title}
        </h1>

        <p className="mt-3 text-xs tracking-[0.16em] text-muted">
          {formatDate(post.meta.date)}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          {post.meta.description}
        </p>
      </header>

      <article className="prose mt-10 max-w-none dark:prose-invert">
        {content}
      </article>
    </main>
  );
}
