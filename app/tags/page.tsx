/* app/tags/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

import { getAllPostLikes } from "@/lib/posts";
import { getAllWorks } from "@/lib/works";
import { Reveal } from "@/components/ui/Reveal";
import { SITE_NAME, SITE_LOCALE, SITE_OG_IMAGES } from "@/lib/site-meta";
import { normalizeKey, normalizeLabel, tagToSlug } from "@/lib/tag-normalize";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tags",
  description: "Blog / Works 共通のタグ一覧",
  openGraph: {
    title: "Tags",
    description: "Blog / Works 共通のタグ一覧",
    type: "website",
    url: "/tags",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: SITE_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tags",
    description: "Blog / Works 共通のタグ一覧",
    images: SITE_OG_IMAGES.map((i) => i.url),
  },
};

type TagRow = {
  key: string;
  label: string;
  slug: string;
  postsCount: number;
  worksCount: number;
  total: number;
};

function buildTagRows(
  posts: Array<{ meta?: { tags?: string[] | null } }>,
  works: Array<{ meta?: { tags?: string[] | null } }>
): TagRow[] {
  const map = new Map<string, TagRow>();

  const add = (raw: string, from: "post" | "work") => {
    const label = normalizeLabel(raw);
    const key = normalizeKey(label);
    if (!key) return;

    const slug = tagToSlug(label);

    const cur =
      map.get(key) ??
      ({
        key,
        label,
        slug,
        postsCount: 0,
        worksCount: 0,
        total: 0,
      } satisfies TagRow);

    // label/slug は最初の表記を優先（見た目の安定）
    if (!cur.label) cur.label = label;
    if (!cur.slug) cur.slug = slug;

    if (from === "post") cur.postsCount += 1;
    if (from === "work") cur.worksCount += 1;

    cur.total = cur.postsCount + cur.worksCount;
    map.set(key, cur);
  };

  for (const p of posts) {
    const tags = p.meta?.tags ?? [];
    for (const t of tags) add(String(t), "post");
  }

  for (const w of works) {
    const tags = w.meta?.tags ?? [];
    for (const t of tags) add(String(t), "work");
  }

  const rows = Array.from(map.values());

  // ✅ 合計 desc → label asc
  rows.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.label.localeCompare(b.label, "ja");
  });

  return rows;
}

export default async function TagsPage() {
  const posts = await getAllPostLikes();
  const works = await getAllWorks();

  const rows = buildTagRows(posts, works);

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
            Blog / Works 共通のタグ一覧です。タグページ、または各一覧へジャンプできます。
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

      {rows.length === 0 ? (
        <Reveal as="p" className="mt-8 text-sm text-muted-foreground" delay={300}>
          タグがまだありません。
        </Reveal>
      ) : (
        <section className="mt-10" aria-label="All tags">
          <Reveal as="div" className="grid gap-3" delay={300}>
            {rows.map((t) => (
              <div key={t.key} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/tags/${t.slug}`}
                    className="text-lg font-semibold hover:underline underline-offset-4"
                  >
                    {t.label}
                  </Link>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Blog {t.postsCount}</span>
                    <span className="opacity-60">/</span>
                    <span>Works {t.worksCount}</span>
                    <span className="opacity-60">/</span>
                    <span>Total {t.total}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {t.postsCount > 0 ? (
                    <Link
                      href={`/blog?tag=${encodeURIComponent(t.label)}`}
                      className="chip hover:opacity-80"
                    >
                      Blogで見る
                    </Link>
                  ) : null}

                  {t.worksCount > 0 ? (
                    <Link
                      href={`/works?tag=${encodeURIComponent(t.label)}`}
                      className="chip hover:opacity-80"
                    >
                      Worksで見る
                    </Link>
                  ) : null}

                  <Link href={`/tags/${t.slug}`} className="chip hover:opacity-80">
                    Tagページ
                  </Link>
                </div>
              </div>
            ))}
          </Reveal>
        </section>
      )}

      <Reveal as="div" className="mt-10 hairline" delay={420} />
    </main>
  );
}
