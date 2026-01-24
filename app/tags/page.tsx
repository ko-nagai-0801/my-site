// app/tags/page.tsx
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
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Tags</h1>
        <p className="mt-2 text-sm opacity-80">
          Blog / Works 共通のタグ一覧です。クリックすると該当コンテンツに絞り込めます。
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="text-sm opacity-80">タグがまだありません。</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tags/${t.slug}`}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:opacity-80"
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
