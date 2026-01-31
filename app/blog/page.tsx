/* app/blog/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPostLikes } from "@/lib/posts";
import { PostsList } from "@/components/blog/PostsList";
import { Pagination } from "@/components/ui/Pagination";
import { Reveal } from "@/components/ui/Reveal";
import { SITE_NAME, SITE_LOCALE, SITE_OG_IMAGES } from "@/lib/site-meta";
import {
  normalizeKey,
  normalizeLabel,
  slugToKey,
  tagToSlug,
} from "@/lib/tag-normalize";

export const revalidate = 3600;

const PER_PAGE = 10;

type Props = {
  searchParams?: Promise<{ page?: string; tag?: string }>;
};

const toInt = (v: string | undefined) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.trunc(n);
};

type TagItem = { key: string; label: string; slug: string };

function buildTagList(posts: Awaited<ReturnType<typeof getAllPostLikes>>): TagItem[] {
  const map = new Map<string, string>(); // key -> label（表示）

  for (const p of posts) {
    const tags = p.meta.tags ?? [];
    for (const raw of tags) {
      const label = normalizeLabel(raw);
      if (!label) continue;
      const key = normalizeKey(label);
      if (!key) continue;

      if (!map.has(key)) map.set(key, label);
    }
  }

  const list = [...map.entries()].map(([key, label]) => ({
    key,
    label,
    slug: tagToSlug(label),
  }));

  list.sort((a, b) => a.label.localeCompare(b.label, "ja"));
  return list;
}

function resolveActiveTag(
  tagParam: string | undefined,
  tagList: TagItem[]
): { activeKey: string; activeLabel: string } {
  if (!tagParam) return { activeKey: "", activeLabel: "" };

  // まず slug として解釈（/tags/<slug> と同一方針）
  const keyFromSlug = slugToKey(tagParam);
  const hitSlug = tagList.find((t) => t.key === keyFromSlug);
  if (hitSlug) return { activeKey: hitSlug.key, activeLabel: hitSlug.label };

  // 次に label として解釈（/blog?tag=Next.js など）
  const label = normalizeLabel(tagParam);
  const keyFromLabel = normalizeKey(label);
  const hitLabel = tagList.find((t) => t.key === keyFromLabel);
  if (hitLabel) return { activeKey: hitLabel.key, activeLabel: hitLabel.label };

  return { activeKey: "", activeLabel: "" };
}

function filterPostsByActiveKey(
  posts: Awaited<ReturnType<typeof getAllPostLikes>>,
  activeKey: string
) {
  if (!activeKey) return posts;

  return posts.filter((p) => {
    const tags = p.meta.tags ?? [];
    return tags.some((raw) => normalizeKey(normalizeLabel(raw)) === activeKey);
  });
}

/**
 * ✅ /blog の OGP を tag/page に追従（/works と同方針）
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, toInt(sp.page));

  const posts = await getAllPostLikes();
  const tags = buildTagList(posts);
  const { activeLabel } = resolveActiveTag(sp.tag, tags);

  const titleBase = activeLabel ? `Blog: ${activeLabel}` : "Blog";
  const title = requested > 1 ? `${titleBase} - Page ${requested}` : titleBase;

  const description = activeLabel
    ? `ブログ記事一覧（Tag: ${activeLabel}）`
    : "ブログ記事一覧（学習ログ / 制作メモ など）";

  const params = new URLSearchParams();
  if (activeLabel) params.set("tag", activeLabel);
  if (requested > 1) params.set("page", String(requested));
  const qs = params.toString();
  const url = qs ? `/blog?${qs}` : "/blog";

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
      url,
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

export default async function BlogPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, toInt(sp.page));

  const posts = await getAllPostLikes();

  if (posts.length === 0) {
    return (
      <main className="container py-14">
        <header className="flex items-end justify-between gap-6">
          <div>
            <Reveal as="p" className="kns-page-kicker" delay={60}>
              Index
            </Reveal>
            <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
              Blog
            </Reveal>
            <Reveal as="p" className="mt-4 kns-lead" delay={180}>
              学習ログ・制作メモなどの一覧です。
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
          記事がまだありません。
        </Reveal>

        <Reveal as="div" className="mt-10 hairline" delay={360} />
      </main>
    );
  }

  const tagList = buildTagList(posts);
  const { activeKey, activeLabel } = resolveActiveTag(sp.tag, tagList);
  const filtered = filterPostsByActiveKey(posts, activeKey);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (requested > totalPages) notFound();

  const start = (requested - 1) * PER_PAGE;
  const items = filtered.slice(start, start + PER_PAGE);

  const hrefForPage = (n: number) => {
    const params = new URLSearchParams();
    if (activeLabel) params.set("tag", activeLabel);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  const chipBase = "chip hover:opacity-80";
  const chipActive = "chip ring-1 ring-foreground/20";

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="kns-page-kicker" delay={60}>
            Index
          </Reveal>
          <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
            Blog
          </Reveal>

          <Reveal
            as="p"
            className="mt-2 text-xs tracking-[0.18em] text-muted-foreground"
            delay={180}
          >
            Page {requested} / {totalPages}
            {activeLabel ? <> ・ Tag: {activeLabel}</> : null}
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

      {/* ✅ タグフィルタ（chip UI） + ✅ /tags/<slug> 導線 */}
      <section className="mt-8" aria-label="Tag filter">
        <h2 className="sr-only">Filter by tag</h2>

        <Reveal as="div" className="flex flex-wrap items-center gap-2" delay={300}>
          <Link href="/blog" className={activeKey ? chipBase : chipActive}>
            All
          </Link>

          {tagList.map(({ key, label, slug }) => {
            const href = `/blog?tag=${encodeURIComponent(label)}`;
            const isActive = key === activeKey;

            return (
              <div key={key} className="flex items-center gap-1">
                <Link href={href} className={isActive ? chipActive : chipBase}>
                  {label}
                </Link>
                <Link
                  href={`/tags/${slug}`}
                  className="text-xs text-muted-foreground hover:text-foreground"
                  aria-label={`${label} のタグページへ`}
                >
                  ↗
                </Link>
              </div>
            );
          })}
        </Reveal>

        {activeKey && filtered.length === 0 ? (
          <Reveal as="p" className="mt-4 text-sm text-muted-foreground" delay={340}>
            このタグのブログ記事はありません。
          </Reveal>
        ) : null}
      </section>

      <Reveal as="div" className="mt-10" delay={360}>
        <PostsList posts={items} variant="latest" linkMode="title" />
      </Reveal>

      <Reveal as="div" className="mt-10" delay={420}>
        <Pagination current={requested} total={totalPages} hrefForPage={hrefForPage} />
      </Reveal>

      <Reveal as="div" className="mt-10 hairline" delay={480} />
    </main>
  );
}
