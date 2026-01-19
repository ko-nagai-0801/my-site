// app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";

export default async function BlogPage() {
  const posts = await getAllPosts();

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

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-muted">記事がまだありません。</p>
      ) : (
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <li key={p.slug} className="py-7">
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="flex items-start justify-between gap-6">
                  <h2 className="text-lg font-medium tracking-tight underline underline-offset-4">
                    {p.meta.title}
                  </h2>
                  <span className="shrink-0 text-xs tracking-[0.18em] text-muted">
                    {formatDate(p.meta.date)}
                  </span>
                </div>

                {p.meta.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.meta.description}
                  </p>
                )}

                {p.meta.tags && p.meta.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-panel px-3 py-1 text-[11px] tracking-[0.14em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 text-xs tracking-[0.22em] uppercase text-muted">
                  Read →
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
