/* app/works/[slug]/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getAllWorks, getWorkBySlug } from "@/lib/works";
import { renderMdx } from "@/lib/render-mdx";
import { Reveal } from "@/components/ui/Reveal";
import { getWorkThumb, getWorkOgImages, DEFAULT_WORK_THUMB } from "@/lib/work-thumb";
import { SITE_NAME, SITE_DESCRIPTION, SITE_LOCALE } from "@/lib/site-meta";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const items = await getAllWorks();
  return items.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const work = await getWorkBySlug(slug);
  if (!work) {
    return {
      title: "Not Found | Works",
      description: "指定された作品が見つかりませんでした。",
    };
  }

  const pageTitle = `${work.meta.title} | Works`;
  const description = work.meta.summary ?? SITE_DESCRIPTION;

  const ogImages = getWorkOgImages(work.meta);

  return {
    title: pageTitle,
    description,

    openGraph: {
      title: pageTitle,
      description,
      type: "article",
      url: `/works/${work.slug}`,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

function ExternalButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="kns-btn-ghost"
      aria-label={label}
    >
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const content = await renderMdx(work.content);

  const hasLinks = Boolean(work.meta.href || work.meta.repo);
  const hasNote = Boolean(work.meta.note);
  const hasMetaBlock = hasLinks || hasNote;

  // ✅ 詳細サムネ：作品画像が無ければデフォルト（Blogと同方針）
  const thumb = getWorkThumb(work.meta, DEFAULT_WORK_THUMB);

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <Reveal as="p" className="kns-page-kicker" delay={60}>
            Portfolio
          </Reveal>

          <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
            {work.meta.title}
          </Reveal>

          <Reveal as="p" className="mt-4 kns-lead" delay={180}>
            {work.meta.summary}
          </Reveal>
        </div>

        <Reveal as="div" delay={220}>
          <Link href="/works" className="kns-btn-ghost" aria-label="Works一覧へ戻る">
            <span>Works</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </header>

      <Reveal as="div" className="mt-10 hairline" delay={260} />

      {/* ✅ 常に表示（作品画像 or デフォルト） */}
      <Reveal
        as="div"
        className="mt-10 overflow-hidden rounded-2xl border border-border bg-panel"
        delay={300}
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
        {hasMetaBlock ? (
          <section aria-label="Work links">
            {hasLinks ? (
              <div className="flex flex-wrap items-center gap-3">
                {work.meta.href ? <ExternalButton href={work.meta.href} label="Open site" /> : null}
                {work.meta.repo ? <ExternalButton href={work.meta.repo} label="Repository" /> : null}
              </div>
            ) : null}

            {hasNote ? (
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{work.meta.note}</p>
            ) : null}
          </section>
        ) : null}

        <div className="mt-10 hairline" />

        <div className="mt-10">
          <article className="prose prose-invert max-w-none">{content}</article>
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/works" className="kns-btn-ghost" aria-label="Works一覧へ戻る">
            <span>Works</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-10 hairline" />
      </div>
    </main>
  );
}
