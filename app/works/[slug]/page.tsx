/* app/works/[slug]/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { getAllWorks, getWorkBySlug } from "@/lib/works";

type PageProps = {
  // ★ Next.js 16 の型生成に合わせて Promise 扱い
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const items = await getAllWorks();
  return items.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const work = await getWorkBySlug(slug);
  if (!work) {
    return {
      title: "Not Found | Works | My Site",
      description: "指定された作品が見つかりませんでした。",
    };
  }

  return {
    title: `${work.meta.title} | Works | My Site`,
    description: work.meta.summary,
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-muted">
            Portfolio
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {work.meta.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {work.meta.summary}
          </p>
        </div>

        <Link
          href="/works"
          className="text-xs tracking-[0.22em] uppercase text-muted hover:text-foreground"
        >
          Back
        </Link>
      </header>

      <div className="mt-10 hairline" />

      {(work.meta.href || work.meta.repo || work.meta.note) && (
        <div className="mt-6 space-y-2">
          {(work.meta.href || work.meta.repo) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-[0.16em] text-muted">
              {work.meta.href && (
                <a
                  href={work.meta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  Open site ↗
                </a>
              )}
              {work.meta.repo && (
                <a
                  href={work.meta.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  Repository ↗
                </a>
              )}
            </div>
          )}

          {work.meta.note && (
            <p className="text-xs leading-relaxed text-muted">
              {work.meta.note}
            </p>
          )}
        </div>
      )}

      <article className="prose prose-invert mt-10 max-w-none">
        <MDXRemote
          source={work.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  { behavior: "wrap", properties: { className: ["anchor"] } },
                ],
              ],
            },
          }}
        />
      </article>
    </main>
  );
}
