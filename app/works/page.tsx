/* app/works/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWorks } from "@/lib/works";
import { WorksGrid } from "@/components/works/WorksGrid";

export const metadata: Metadata = {
  title: "Works | Kou Nagai Studio",
  description: "制作実績 / サンプルの一覧",
};

const PER_PAGE = 6;

type Props = {
  searchParams?: Promise<{ page?: string }>;
};

const toInt = (v: string | undefined) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.trunc(n);
};

const pageHref = (n: number) => (n <= 1 ? "/works" : `/works?page=${n}`);

export default async function WorksPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, toInt(sp.page));

  const works = await getAllWorks();

  if (works.length === 0) {
    return (
      <main className="container py-14">
        <header className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-muted">Portfolio</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Works</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              制作物・サンプルの一覧です。各カードから詳細ページへ移動できます。
            </p>
          </div>

          <Link
            href="/"
            className="text-xs tracking-[0.22em] uppercase text-muted hover:text-foreground"
          >
            Home
          </Link>
        </header>

        <div className="mt-10 hairline" />
        <p className="mt-8 text-sm text-muted">作品がまだありません。</p>
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(works.length / PER_PAGE));
  if (requested > totalPages) notFound();

  const start = (requested - 1) * PER_PAGE;
  const items = works.slice(start, start + PER_PAGE);

  const prev = requested > 1 ? requested - 1 : null;
  const next = requested < totalPages ? requested + 1 : null;

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-muted">Portfolio</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Works</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            制作物・サンプルの一覧です。各カードから詳細ページへ移動できます。
          </p>
          <p className="mt-2 text-xs tracking-[0.18em] text-muted">
            Page {requested} / {totalPages}
          </p>
        </div>

        <Link
          href="/"
          className="text-xs tracking-[0.22em] uppercase text-muted hover:text-foreground"
        >
          Home
        </Link>
      </header>

      <div className="mt-10 hairline" />

      <div className="mt-8">
        <WorksGrid works={items} />
      </div>

      <nav className="mt-10 flex items-center justify-between">
        {prev ? (
          <Link href={pageHref(prev)} className="nav-link">
            ← Prev
          </Link>
        ) : (
          <span className="text-xs tracking-[0.22em] uppercase text-muted opacity-50">← Prev</span>
        )}

        <span className="text-xs tracking-[0.22em] uppercase text-muted">
          {requested} / {totalPages}
        </span>

        {next ? (
          <Link href={pageHref(next)} className="nav-link">
            Next →
          </Link>
        ) : (
          <span className="text-xs tracking-[0.22em] uppercase text-muted opacity-50">Next →</span>
        )}
      </nav>

    </main>
  );
}
