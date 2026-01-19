import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import Link from "next/link";

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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/blog" className="text-sm underline opacity-80">
        ← ブログ一覧に戻る
      </Link>

      <p className="text-sm opacity-70">{meta.date}</p>
      <h1 className="mt-2 text-3xl font-bold">{meta.title}</h1>
      {meta.tags && meta.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1 text-xs opacity-80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <article className="prose mt-8 max-w-none dark:prose-invert prose-code:before:content-none prose-code:after:content-none">
        <Content />
      </article>
    </main>
  );
}
