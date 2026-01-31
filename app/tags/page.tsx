/* app/tags/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

import { getAllTags } from "@/lib/tags";
import { Reveal } from "@/components/ui/Reveal";
import { SITE_NAME, SITE_LOCALE, SITE_OG_IMAGES } from "@/lib/site-meta";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Tags | ${SITE_NAME}`,
  description: "Blog / Works 共通のタグ一覧です。",
  openGraph: {
    title: `Tags | ${SITE_NAME}`,
    description: "Blog / Works 共通のタグ一覧です。",
    type: "website",
    url: "/tags",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: SITE_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: `Tags | ${SITE_NAME}`,
    description: "Blog / Works 共通のタグ一覧です。",
    images: SITE_OG_IMAGES.map((i) => i.url),
  },
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="kns-page-kicker" delay={60}>
            Index
          </Reveal>

          <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
            Tags
          </Reveal>

          <Reveal as="p" className="mt-4 kns-lead" delay={180}>
            Blog / Works 共通のタグ一覧です。
          </Reveal>

          <Reveal
            as="p"
            className="mt-2 text-xs tracking-[0.18em] text-muted-foreground"
            delay={220}
          >
            Total {tags.length} tags
          </Reveal>
        </div>

        <Reveal as="div" delay={240}>
          <Link href="/" className="kns-btn-ghost" aria-label="Homeへ戻る">
            <span>Home</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </header>

      <Reveal as="div" className="mt-10 hairline" delay={280} />

      <section className="mt-8" aria-label="Tag list">
        <h2 className="sr-only">Tag list</h2>

        <Reveal as="div" className="flex flex-wrap gap-2" delay={320}>
          {tags.map((t) => (
            <Link key={t.slug} href={`/tags/${t.slug}`} className="chip hover:opacity-80">
              {t.tag}
            </Link>
          ))}
        </Reveal>
      </section>

      <Reveal as="div" className="mt-10 hairline" delay={380} />
    </main>
  );
}
