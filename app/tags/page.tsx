/* app/tags/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/tags";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tags",
  description: "Blog / Works 共通のタグ一覧",
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="kns-page-kicker">Index</p>
          <h1 className="mt-3 kns-page-title">Tags</h1>
          <p className="mt-4 kns-lead">
            Blog / Works 共通のタグ一覧です。クリックすると該当コンテンツに絞り込めます。
          </p>
        </div>

        <Link href="/" className="nav-link">
          Home
        </Link>
      </header>

      <div className="mt-10 hairline" />

      {tags.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">タグがまだありません。</p>
      ) : (
        <ul className="mt-8 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tags/${t.slug}`}
                className="chip inline-flex items-center gap-2"
              >
                <span>{t.tag}</span>
                <span className="opacity-70">
                  {t.total}（B{t.posts}/W{t.works}）
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
