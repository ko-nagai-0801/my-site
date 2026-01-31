/* app/tags/[tag]/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllTags, getTagDetail } from "@/lib/tags";
import { Reveal } from "@/components/ui/Reveal";
import { SITE_NAME, SITE_LOCALE, SITE_OG_IMAGES } from "@/lib/site-meta";

export const revalidate = 3600;

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

const formatDateYMD = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: tagParam } = await params;

  const { tag, posts, works } = await getTagDetail(tagParam);
  const total = posts.length + works.length;

  if (total === 0) {
    return {
      title: `Not Found | Tags | ${SITE_NAME}`,
      description: "指定されたタグは見つかりませんでした。",
    };
  }

  const title = `${tag} | Tags | ${SITE_NAME}`;
  const description = `タグ「${tag}」で絞り込んだ一覧（Blog ${posts.length}件 / Works ${works.length}件）`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
      url: `/tags/${tagParam}`,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: SITE_OG_IMAGES,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: SITE_OG_IMAGES.map((i) => i.url),
    },
  };
}

export default async function TagDetailPage({ params }: Props) {
  const { tag: tagParam } = await params;

  const { tag, posts, works } = await getTagDetail(tagParam);

  if (posts.length === 0 && works.length === 0) {
    notFound();
  }

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <Reveal as="p" className="kns-page-kicker" delay={60}>
            Tags
          </Reveal>

          <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
            {tag}
          </Reveal>

          <Reveal as="p" className="mt-4 kns-lead" delay={180}>
            Blog {posts.length}件 / Works {works.length}件
          </Reveal>
        </div>

        <Reveal as="div" delay={220}>
          <Link href="/tags" className="kns-btn-ghost" aria-label="Tags一覧へ戻る">
            <span>Tags</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </header>

      <Reveal as="div" className="mt-10 hairline" delay={260} />

      {/* Blog */}
      <section className="mt-10" aria-label="Blog results">
        <Reveal as="h2" className="kns-section-title" delay={300}>
          Blog
        </Reveal>

        {posts.length === 0 ? (
          <Reveal as="p" className="mt-4 text-sm text-muted-foreground" delay={340}>
            このタグのブログ記事はありません。
          </Reveal>
        ) : (
          <Reveal as="ul" className="mt-6 space-y-4" delay={340}>
            {posts.map((p) => (
              <li key={p.slug} className="rounded-2xl border border-border bg-panel p-5 sm:p-6">
                <p className="text-xs tracking-[0.16em] text-muted-foreground">
                  {formatDateYMD(p.meta.date)}
                </p>

                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-2 block text-base font-medium tracking-tight hover:underline underline-offset-4"
                >
                  {p.meta.title}
                </Link>

                {p.meta.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.meta.description}
                  </p>
                ) : null}
              </li>
            ))}
          </Reveal>
        )}
      </section>

      <div className="mt-10 hairline" />

      {/* Works */}
      <section className="mt-10" aria-label="Works results">
        <Reveal as="h2" className="kns-section-title" delay={380}>
          Works
        </Reveal>

        {works.length === 0 ? (
          <Reveal as="p" className="mt-4 text-sm text-muted-foreground" delay={420}>
            このタグの作品はありません。
          </Reveal>
        ) : (
          <Reveal as="ul" className="mt-6 space-y-4" delay={420}>
            {works.map((w) => (
              <li key={w.slug} className="rounded-2xl border border-border bg-panel p-5 sm:p-6">
                <Link
                  href={`/works/${w.slug}`}
                  className="block text-base font-medium tracking-tight hover:underline underline-offset-4"
                >
                  {w.meta.title}
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.meta.summary}</p>
              </li>
            ))}
          </Reveal>
        )}
      </section>

      <Reveal as="div" className="mt-10 hairline" delay={460} />
    </main>
  );
}
