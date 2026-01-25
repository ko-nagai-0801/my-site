/* app/blog/[slug]/page.tsx */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";

import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";
import { mdxComponents, mdxOptions } from "@/lib/mdx";

type Props = {
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
    components: mdxComponents,
    options: {
      mdxOptions,
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

      <article className="prose prose-invert mt-10 max-w-none">{content}</article>
    </main>
  );
}
