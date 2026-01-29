// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPostLikes } from "@/lib/posts";
import { PostsList } from "@/components/blog/PostsList";
import { Pagination } from "@/components/ui/Pagination";
import { Reveal } from "@/components/ui/Reveal";

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

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  if (requested > totalPages) notFound();

  const start = (requested - 1) * PER_PAGE;
  const items = posts.slice(start, start + PER_PAGE);

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
          </Reveal>
        </div>

        <Reveal as="div" delay={220}>
          <Link href="/" className="kns-btn-ghost" aria-label="Homeへ戻る">
            <span>Home</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </header>

      {/* ✅ 区切り線（Worksと同テンポ） */}
      <Reveal as="div" className="mt-10 hairline" delay={260} />

      {/* ✅ 一覧 */}
      <Reveal as="div" className="mt-10" delay={300}>
        <PostsList posts={items} variant="blog" linkMode="title" showReadLabel />
      </Reveal>

      {/* ✅ ページネーション */}
      <Reveal as="div" className="mt-10" delay={360}>
        <Pagination
          current={requested}
          total={totalPages}
          hrefForPage={pageHref}
        />
      </Reveal>

      {/* ✅ 〆の区切り線 */}
      <Reveal as="div" className="mt-10 hairline" delay={420} />
    </main>
  );
}
