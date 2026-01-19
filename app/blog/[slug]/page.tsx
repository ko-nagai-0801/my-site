// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { Content, meta } = post;

  return (
    <main className="container py-14">
      <div className="flex items-baseline justify-between gap-6">
        <Link href="/blog" className="text-xs tracking-[0.22em] uppercase">
          ← Back to Blog
        </Link>

        <span className="text-xs tracking-[0.18em] text-muted">
          {formatDate(meta.date)}
        </span>
      </div>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight">{meta.title}</h1>

      {meta.description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {meta.description}
        </p>
      )}

      {meta.tags && meta.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-panel px-3 py-1 text-[11px] tracking-[0.14em] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-border pt-10">
        <article
          className={[
            "prose max-w-none",
            "prose-p:leading-relaxed",
            "prose-headings:tracking-tight",
            "prose-h2:mt-12 prose-h2:mb-4",
            "prose-h3:mt-10 prose-h3:mb-3",
            "prose-code:before:content-none prose-code:after:content-none",
            "prose-a:underline prose-a:underline-offset-4",
          ].join(" ")}
        >
          <Content />
        </article>
      </div>
    </main>
  );
}
