/* app/works/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllWorks } from "@/lib/works";
import { WorksGrid } from "@/components/works/WorksGrid";
import { Pagination } from "@/components/ui/Pagination";
import { Reveal } from "@/components/ui/Reveal";
import { SITE_NAME, SITE_LOCALE, SITE_OG_IMAGES, SITE_DESCRIPTION } from "@/lib/site-meta";

const PER_PAGE = 6;

type Props = {
  searchParams?: Promise<{ page?: string; tag?: string }>;
};

const toInt = (v: string | undefined) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.trunc(n);
};

const normalizeLabel = (s: string) => s.trim();

const normalizeKey = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/**
 * ✅ c) /works の OGP をタグ/ページに追従
 * - title/description を searchParams から生成
 * - images はサイト既定（site-meta単一ソース）
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, toInt(sp.page));

  const activeTagRaw = typeof sp.tag === "string" ? normalizeLabel(sp.tag) : "";
  const activeKey = activeTagRaw ? normalizeKey(activeTagRaw) : "";

  const works = await getAllWorks();

  // フィルタ用タグ一覧（比較keyで重複排除しつつ、表示ラベルは最初の表記を採用）
  const tagMap = new Map<string, string>(); // key -> label
  for (const w of works) {
    for (const t of w.meta.tags ?? []) {
      const label = normalizeLabel(t);
      if (!label) continue;
      const key = normalizeKey(label);
      if (!tagMap.has(key)) tagMap.set(key, label);
    }
  }

  const activeLabel = activeKey ? tagMap.get(activeKey) ?? activeTagRaw : "";

  const titleBase = activeLabel ? `Works: ${activeLabel}` : "Works";
  const title = requested > 1 ? `${titleBase} - Page ${requested}` : titleBase;

  const description = activeLabel
    ? `制作実績 / サンプルの一覧（Tag: ${activeLabel}）`
    : "制作実績 / サンプルの一覧";

  const params = new URLSearchParams();
  if (activeLabel) params.set("tag", activeLabel);
  if (requested > 1) params.set("page", String(requested));
  const qs = params.toString();
  const url = qs ? `/works?${qs}` : "/works";

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

export default async function WorksPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, toInt(sp.page));

  const activeTagRaw = typeof sp.tag === "string" ? normalizeLabel(sp.tag) : "";
  const activeKey = activeTagRaw ? normalizeKey(activeTagRaw) : "";

  const works = await getAllWorks();

  if (works.length === 0) {
    return (
      <main className="container py-14">
        <header className="flex items-end justify-between gap-6">
          <div>
            <Reveal as="p" className="kns-page-kicker" delay={60}>
              Portfolio
            </Reveal>
            <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
              Works
            </Reveal>
            <Reveal as="p" className="mt-4 kns-lead" delay={180}>
              制作物・サンプルの一覧です。各カードから詳細ページへ移動できます。
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
          作品がまだありません。
        </Reveal>

        <Reveal as="div" className="mt-10 hairline" delay={360} />
      </main>
    );
  }

  const tagMap = new Map<string, string>(); // key -> label
  for (const w of works) {
    for (const t of w.meta.tags ?? []) {
      const label = normalizeLabel(t);
      if (!label) continue;
      const key = normalizeKey(label);
      if (!tagMap.has(key)) tagMap.set(key, label);
    }
  }

  const allTags = Array.from(tagMap.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "ja", { sensitivity: "base" }));

  const activeLabel = activeKey ? tagMap.get(activeKey) ?? activeTagRaw : "";

  const filtered = activeKey
    ? works.filter((w) =>
        (w.meta.tags ?? []).some((t) => normalizeKey(normalizeLabel(t)) === activeKey)
      )
    : works;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (requested > totalPages) notFound();

  const start = (requested - 1) * PER_PAGE;
  const items = filtered.slice(start, start + PER_PAGE);

  const hrefForPage = (n: number) => {
    const params = new URLSearchParams();
    if (activeLabel) params.set("tag", activeLabel);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/works?${qs}` : "/works";
  };

  const chipBase = "chip hover:opacity-80";
  const chipActive = "chip ring-1 ring-foreground/20";

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="kns-page-kicker" delay={60}>
            Portfolio
          </Reveal>
          <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
            Works
          </Reveal>
          <Reveal as="p" className="mt-4 kns-lead" delay={180}>
            制作物・サンプルの一覧です。各カードから詳細ページへ移動できます。
          </Reveal>

          <Reveal
            as="p"
            className="mt-2 text-xs tracking-[0.18em] text-muted-foreground"
            delay={220}
          >
            Page {requested} / {totalPages}
            {activeLabel ? <> ・ Tag: {activeLabel}</> : null}
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

      <section className="mt-8" aria-label="Tag filter">
        <h2 className="sr-only">Filter by tag</h2>

        <Reveal as="div" className="flex flex-wrap gap-2" delay={320}>
          <Link href="/works" className={activeKey ? chipBase : chipActive}>
            All
          </Link>

          {allTags.map(({ key, label }) => {
            const href = `/works?tag=${encodeURIComponent(label)}`;
            const isActive = key === activeKey;
            return (
              <Link key={key} href={href} className={isActive ? chipActive : chipBase}>
                {label}
              </Link>
            );
          })}
        </Reveal>

        {activeKey && filtered.length === 0 ? (
          <Reveal as="p" className="mt-4 text-sm text-muted-foreground" delay={360}>
            このタグの作品はありません。
          </Reveal>
        ) : null}
      </section>

      <Reveal as="div" className="mt-10" delay={380}>
        <WorksGrid works={items} />
      </Reveal>

      <Reveal as="div" className="mt-10" delay={440}>
        <Pagination current={requested} total={totalPages} hrefForPage={hrefForPage} />
      </Reveal>

      <Reveal as="div" className="mt-10 hairline" delay={500} />
    </main>
  );
}
