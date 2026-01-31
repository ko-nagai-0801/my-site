/* app/tags/[tag]/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllTags, getTagDetail, slugToTag } from "@/lib/tags";
import { SITE_NAME, SITE_LOCALE, SITE_OG_IMAGES } from "@/lib/site-meta";

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

  const title = `${tagLabel} | Tags | ${SITE_NAME}`;
  const description = `タグ「${tagLabel}」で絞り込んだ一覧（Blog / Works 共通）`;
  const url = `/tags/${tag}`;

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

  const worksHref = `/works?tag=${encodeURIComponent(tag)}`;
  const blogHref = `/blog?tag=${encodeURIComponent(tag)}`;

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

        {/* ✅ 追加：戻り導線（絞り込み） */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={worksHref} className="chip hover:opacity-80">
            Worksで絞り込む
          </Link>
          <Link href={blogHref} className="chip hover:opacity-80">
            Blogで絞り込む
          </Link>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold">Blog</h2>

        {posts.length === 0 ? (
          <p className="mt-3 text-sm opacity-80">
            このタグのブログ記事はありません。
          </p>
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
