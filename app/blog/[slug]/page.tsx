/* app/blog/[slug]/page.tsx */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";
import { renderMdx } from "@/lib/render-mdx";

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

  const content = await renderMdx(post.content);

  return (
    <main className="container py-14">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="kns-page-kicker">Blog</p>

          <h1 className="mt-3 kns-page-title">{post.meta.title}</h1>

          <p className="mt-3 text-xs tracking-[0.18em] text-muted-foreground">
            {formatDate(post.meta.date)}
          </p>

          {post.meta.description ? <p className="mt-4 kns-lead">{post.meta.description}</p> : null}
        </div>

        <Link href="/blog" className="nav-link">
          View all
        </Link>
      </header>

      <article className="prose prose-invert mt-10 max-w-none">{content}</article>
    </main>
  );
}
