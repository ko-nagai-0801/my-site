/* app/blog/[slug]/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";
import { renderMdx } from "@/lib/render-mdx";
import { Reveal } from "@/components/ui/Reveal";
import { getPostThumb } from "@/lib/post-thumb";

const DEFAULT_THUMB = "/images/blog/noimage.webp";

// layout と同じ既定OGP（フォールバック用）
const SITE_OG_IMAGES = [
  { url: "/og-kns-1200x630.png", alt: "Kou Nagai Studio" },
  { url: "/og-kns-2400x1260.png", alt: "Kou Nagai Studio" },
];

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
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

  const title = `${post.meta.title} | Blog | Kou Nagai Studio`;
  const description = post.meta.description ?? "";

  // ✅ OGP は「記事画像があれば優先」→ 無ければサイト既定へ
  const ogImage = post.meta.image?.src;
  const ogImages = ogImage
    ? [{ url: ogImage, alt: post.meta.image?.alt?.trim() ? post.meta.image.alt : post.meta.title }]
    : SITE_OG_IMAGES;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "article",
      url: `/blog/${post.meta.slug}`,
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const content = await renderMdx(post.content);

  const tags = post.meta.tags ?? [];

  // ✅ 詳細サムネ：記事画像が無ければデフォルト（一覧と同ロジック）
  const thumb = getPostThumb(post.meta, DEFAULT_THUMB);

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
                  key={`${post.meta.slug}-${tag}`}
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

      {/* Sub-hero (thumb) - ✅ 常に表示（記事画像 or デフォルト） */}
      <Reveal
        as="div"
        className="mt-10 overflow-hidden rounded-2xl border border-border bg-panel"
        delay={340}
      >
        <div className="relative aspect-[16/10]">
          <Image
            src={thumb.src}
            alt={thumb.alt}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

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
