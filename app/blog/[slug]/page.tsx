/* app/blog/[slug]/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";
import { renderMdx } from "@/lib/render-mdx";
import { Reveal } from "@/components/ui/Reveal";

const DEFAULT_THUMB = "/images/blog/noimage.webp";

type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ PostMeta に image が未定義でも落ちないように安全に拾う
function pickPostImage(meta: unknown): { src: string; alt: string } | null {
  const m = meta as { image?: { src?: string; alt?: string }; title?: string };
  const src = m.image?.src;
  if (!src) return null;
  return { src, alt: m.image?.alt ?? (m.title ?? "") };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: "Not Found | Blog | Kou Nagai Studio",
      description: "指定された記事が見つかりませんでした。",
    };
  }

  const img = pickPostImage(post.meta);
  const ogImage = img?.src ?? DEFAULT_THUMB;
  const ogAlt = img?.alt ?? post.meta.title;
  const title = `${post.meta.title} | Blog | Kou Nagai Studio`;
  const description = post.meta.description ?? "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      // ✅ metadataBase が layout.tsx で設定されていれば相対でもOK
      url: `/blog/${slug}`,
      images: [
        {
          url: ogImage,
          width: 1600,
          height: 1000,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const content = await renderMdx(post.content);

  const tags = post.meta.tags ?? [];

  // ✅ 表示用サムネ：記事画像があればそれ、無ければデフォルト
  const img = pickPostImage(post.meta);
  const thumbSrc = img?.src ?? DEFAULT_THUMB;
  const thumbAlt = img?.alt ?? post.meta.title;

  return (
    <main className="container py-14">
      {/* Header */}
      <header className="flex items-end justify-between gap-6">
        <div className="min-w-0 max-w-3xl">
          <Reveal as="p" className="kns-page-kicker" delay={60}>
            Blog
          </Reveal>

          <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
            {post.meta.title}
          </Reveal>

          <Reveal
            as="p"
            className="mt-3 text-xs tracking-[0.18em] text-muted-foreground"
            delay={180}
          >
            {formatDate(post.meta.date)}
          </Reveal>

          {post.meta.description ? (
            <Reveal as="p" className="mt-4 kns-lead" delay={220}>
              {post.meta.description}
            </Reveal>
          ) : null}

          {tags.length ? (
            <Reveal as="div" className="mt-4 flex flex-wrap gap-2" delay={240}>
              {tags.map((tag) => (
                <Link
                  key={`${slug}-${tag}`}
                  href={`/tags/${encodeURIComponent(tag.trim())}`}
                  className="chip hover:opacity-80"
                >
                  {tag}
                </Link>
              ))}
            </Reveal>
          ) : null}
        </div>

        <Reveal as="div" delay={260}>
          <Link href="/blog" className="kns-btn-ghost" aria-label="Blog一覧へ戻る">
            <span>Blog</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </header>

      {/* Divider */}
      <Reveal as="div" className="mt-10 hairline" delay={300} />

      {/* ✅ Sub-hero：常に表示（無い場合は noimage.webp） */}
      <Reveal
        as="div"
        className="mt-10 overflow-hidden rounded-2xl border border-border bg-panel"
        delay={340}
      >
        <div className="relative aspect-[16/10]">
          <Image
            src={thumbSrc}
            alt={thumbAlt}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      {/* ✅ サムネより下：動きは最小限（まとめて） */}
      <div className="mt-10">
        <div className="mt-10 hairline" />

        <div className="mt-10">
          <article className="prose prose-invert max-w-none">{content}</article>
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/blog" className="kns-btn-ghost" aria-label="Blog一覧へ戻る">
            <span>Blog</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-10 hairline" />
      </div>
    </main>
  );
}
