/* app/works/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWorks } from "@/lib/works";
import { WorksGrid } from "@/components/works/WorksGrid";
import { Pagination } from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "Works | Kou Nagai Studio",
  description: "制作実績 / サンプルの一覧",
};

const PER_PAGE = 6;

type Props = {
  searchParams?: Promise<{ page?: string; tag?: string }>;
};

const toInt = (v: string | undefined) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.trunc(n);
};

// 表示用（見た目）は trim のみ
const normalizeLabel = (s: string) => s.trim();

/**
 * 比較用（重複排除・一致判定）を強める
 * - NFKC：全角/半角などのゆれを吸収
 * - 連続空白を1つに潰す
 * - lower：大小文字ゆれを吸収（比較用だけ）
 */
const normalizeKey = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export default async function WorksPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, toInt(sp.page));

  // ✅ decodeURIComponent は外す（Next側でデコード済みのケースがある）
  const activeTagRaw = typeof sp.tag === "string" ? normalizeLabel(sp.tag) : "";
  const activeKey = activeTagRaw ? normalizeKey(activeTagRaw) : "";

  const works = await getAllWorks();

  if (works.length === 0) {
    return (
      <main className="container py-14">
        <header className="flex items-end justify-between gap-6">
          <div>
            <p className="kns-page-kicker">Portfolio</p>
            <h1 className="mt-3 kns-page-title">Works</h1>
            <p className="mt-4 kns-lead">
              制作物・サンプルの一覧です。各カードから詳細ページへ移動できます。
            </p>
          </div>

          <Link href="/" className="nav-link">
            Home
          </Link>
        </header>

        <div className="mt-10 hairline" />
        <p className="mt-8 text-sm text-muted-foreground">作品がまだありません。</p>
      </main>
    );
  }

  // ✅ フィルタ用タグ一覧：比較keyで重複排除しつつ、表示ラベルは最初の表記を採用
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

  // ✅ tag があるときだけ絞り込み（比較は key で）
  const filtered = activeKey
    ? works.filter((w) =>
        (w.meta.tags ?? []).some((t) => normalizeKey(normalizeLabel(t)) === activeKey)
      )
    : works;

  // ✅ フィルタ結果 0 件でも 404 にしない（UI上のフィルタとして自然）
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (requested > totalPages) notFound();

  const start = (requested - 1) * PER_PAGE;
  const items = filtered.slice(start, start + PER_PAGE);

  const hrefForPage = (n: number) => {
    const params = new URLSearchParams();
    // 表示ラベルをURLに入れる（人間が読める）
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
          <p className="kns-page-kicker">Portfolio</p>
          <h1 className="mt-3 kns-page-title">Works</h1>
          <p className="mt-4 kns-lead">
            制作物・サンプルの一覧です。各カードから詳細ページへ移動できます。
          </p>

          <p className="mt-2 text-xs tracking-[0.18em] text-muted-foreground">
            Page {requested} / {totalPages}
            {activeLabel ? <> ・ Tag: {activeLabel}</> : null}
          </p>
        </div>

        <Link href="/" className="nav-link">
          Home
        </Link>
      </header>

      <div className="mt-10 hairline" />

      {/* ✅ タグフィルタ（/tags と同じ “chip” UI） */}
      <section className="mt-8" aria-label="Tag filter">
        <h2 className="sr-only">Filter by tag</h2>

        <div className="flex flex-wrap gap-2">
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
        </div>

        {activeKey && filtered.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">このタグの作品はありません。</p>
        ) : null}
      </section>

      <div className="mt-8">
        <WorksGrid works={items} />
      </div>

      <Pagination
        className="mt-10"
        current={requested}
        total={totalPages}
        hrefForPage={hrefForPage}
      />
    </main>
  );
}
