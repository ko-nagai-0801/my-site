// app/tags/[tag]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getTagDetail, slugToTag } from "@/lib/tags";

export const revalidate = 3600;

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const tagLabel = slugToTag(tag);

  return {
    title: `${tagLabel} | Tags`,
    description: `タグ「${tagLabel}」で絞り込んだ一覧（Blog / Works 共通）`,
  };
}

const formatDateYMD = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

export default async function TagDetailPage({ params }: Props) {
  const { tag: tagParam } = await params;

  const { tag, posts, works } = await getTagDetail(tagParam);

  if (posts.length === 0 && works.length === 0) {
    notFound();
  }
  

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm opacity-80">
          <Link
            href="/tags"
            className="underline underline-offset-4 hover:opacity-80"
          >
            Tags
          </Link>
          <span className="mx-2 opacity-60">/</span>
          <span className="opacity-80">{tag}</span>
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          <span className="opacity-70">Tag:</span> {tag}
        </h1>

        <p className="mt-2 text-sm opacity-80">
          Blog {posts.length}件 / Works {works.length}件
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold">Blog</h2>

        {posts.length === 0 ? (
          <p className="mt-3 text-sm opacity-80">このタグのブログ記事はありません。</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {posts.map((p) => (
              <li key={p.slug} className="rounded-lg border p-4">
                <p className="text-xs opacity-70">{formatDateYMD(p.meta.date)}</p>
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-1 block text-lg font-semibold hover:underline underline-offset-4"
                >
                  {p.meta.title}
                </Link>
                {p.meta.description ? (
                  <p className="mt-2 text-sm opacity-80">{p.meta.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Works</h2>

        {works.length === 0 ? (
          <p className="mt-3 text-sm opacity-80">このタグの作品はありません。</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {works.map((w) => (
              <li key={w.slug} className="rounded-lg border p-4">
                <Link
                  href={`/works/${w.slug}`}
                  className="block text-lg font-semibold hover:underline underline-offset-4"
                >
                  {w.meta.title}
                </Link>
                <p className="mt-2 text-sm opacity-80">{w.meta.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
