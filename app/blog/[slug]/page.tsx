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
        <Link
          href="/blog"
          className="text-xs tracking-[0.22em] uppercase text-foreground/60 hover:text-foreground"
        >
          ← Back to Blog
        </Link>

        <span className="text-xs tracking-[0.18em] text-foreground/60">
          {formatDate(meta.date)}
        </span>
      </div>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight">
        {meta.title}
      </h1>

      {meta.description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
          {meta.description}
        </p>
      )}

      {meta.tags && meta.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-foreground/12 bg-foreground/3 px-3 py-1 text-[11px] tracking-[0.14em] text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-foreground/10 pt-10">
        <article
          className="prose prose-neutral max-w-none dark:prose-invert
            prose-p:leading-relaxed
            prose-a:decoration-foreground/25 prose-a:underline-offset-4 hover:prose-a:decoration-foreground/50
            prose-headings:tracking-tight
            prose-h2:mt-12 prose-h2:mb-4
            prose-h3:mt-10 prose-h3:mb-3
            prose-code:before:content-none prose-code:after:content-none"
        >
          <Content />
        </article>
      </div>
    </main>
  );
}
