/* app/tags/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { SITE_NAME, SITE_LOCALE, SITE_OG_IMAGES } from "@/lib/site-meta";
import { getAllTags } from "@/lib/tags";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Tags";
  const description = "タグ一覧（Blog / Works 共通）";

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
      url: "/tags",
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

type TagItem = Awaited<ReturnType<typeof getAllTags>>[number];

function readCounts(t: TagItem): { blog: number; works: number; total: number } {
  const obj = t as unknown as Record<string, unknown>;

  const blog =
    (typeof obj.blog === "number" && obj.blog) ||
    (typeof obj.blogCount === "number" && obj.blogCount) ||
    (typeof obj.posts === "number" && obj.posts) ||
    (typeof obj.postsCount === "number" && obj.postsCount) ||
    0;

  const works =
    (typeof obj.works === "number" && obj.works) ||
    (typeof obj.worksCount === "number" && obj.worksCount) ||
    0;

  const total =
    (typeof obj.total === "number" && obj.total) ||
    (typeof obj.totalCount === "number" && obj.totalCount) ||
    blog + works;

  return { blog, works, total };
}

export default async function TagsPage() {
  const tags = await getAllTags();

  if (tags.length === 0) {
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
          </div>

          <Reveal as="div" delay={220}>
            <Link href="/" className="kns-btn-ghost" aria-label="Homeへ戻る">
              <span>Home</span>
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </header>

        <Reveal as="div" className="mt-10 hairline" delay={260} />

        <Reveal as="p" className="mt-8 text-sm text-muted-foreground" delay={320}>
          タグがまだありません。
        </Reveal>

        <Reveal as="div" className="mt-10 hairline" delay={360} />
      </main>
    );
  }

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
            Blog / Works 共通のタグ一覧です。タグページから両方の一覧へ移動できます。
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

      <section className="mt-10" aria-label="Tags list">
        <Reveal as="ul" className="grid gap-4 md:grid-cols-2" delay={320}>
          {tags.map((t) => {
            const label = (t as unknown as { label: string }).label;
            const slug = (t as unknown as { slug: string }).slug;
            const { blog, works, total } = readCounts(t);

            const blogHref = `/blog?tag=${encodeURIComponent(label)}`;
            const worksHref = `/works?tag=${encodeURIComponent(label)}`;
            const tagHref = `/tags/${slug}`;

            return (
              <li key={slug} className="rounded-xl border border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={tagHref}
                      className="text-lg font-semibold tracking-tight hover:underline underline-offset-4"
                    >
                      {label}
                    </Link>
                    <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground">
                      Blog {blog} / Works {works} / Total {total}
                    </p>
                  </div>

                  <Link href={tagHref} className="kns-btn-ghost" aria-label="タグページへ">
                    <span>Open</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={blogHref} className="chip hover:opacity-80">
                    Blogで見る
                  </Link>
                  <Link href={worksHref} className="chip hover:opacity-80">
                    Worksで見る
                  </Link>
                  <Link href={tagHref} className="chip hover:opacity-80">
                    Tagページ
                  </Link>
                </div>
              </li>
            );
          })}
        </Reveal>
      </section>

      <Reveal as="div" className="mt-10 hairline" delay={420} />
    </main>
  );
}
