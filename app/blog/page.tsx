/* app/blog/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPostLikes } from "@/lib/posts";
import { PostsList } from "@/components/blog/PostsList";
import { Pagination } from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "Blog | Kou Nagai Studio",
  description: "ブログ記事一覧（学習ログ / 制作メモ など）",
};

const PER_PAGE = 10;

type Props = {
  searchParams?: Promise<{ page?: string }>;
};

const toInt = (v: string | undefined) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.trunc(n);
};

const pageHref = (n: number) => (n <= 1 ? "/blog" : `/blog?page=${n}`);

export default async function BlogPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, toInt(sp.page));

  const posts = await getAllPostLikes();

  if (posts.length === 0) {
    return (
      <main className="container py-14">
        <header className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-muted">
              Index
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Blog</h1>
          </div>

          <Link href="/" className="text-xs tracking-[0.22em] uppercase">
            Home
          </Link>
        </header>

        <p className="mt-10 text-sm text-muted">記事がまだありません。</p>
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  if (requested > totalPages) notFound();

  const start = (requested - 1) * PER_PAGE;
  const items = posts.slice(start, start + PER_PAGE);

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-muted">Index</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-2 text-xs tracking-[0.18em] text-muted">
            Page {requested} / {totalPages}
          </p>
        </div>

        <Link href="/" className="text-xs tracking-[0.22em] uppercase">
          Home
        </Link>
      </header>

      <div className="mt-10">
        <PostsList posts={items} variant="blog" linkMode="title" showReadLabel />
      </div>

      <Pagination
        className="mt-10"
        current={requested}
        total={totalPages}
        hrefForPage={pageHref}
      />
    </main>
  );
}
