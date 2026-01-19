// app/blog/page.tsx
import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/posts";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-foreground/60">
            Index
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Blog</h1>
        </div>

        <Link
          href="/"
          className="text-xs tracking-[0.22em] uppercase text-foreground/60 hover:text-foreground"
        >
          Home
        </Link>
      </header>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-foreground/70">
          記事がまだありません。
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-foreground/10 border-y border-foreground/10">
          {posts.map((p) => (
            <li key={p.slug} className="py-7">
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="flex items-start justify-between gap-6">
                  <h2 className="text-lg font-medium tracking-tight underline decoration-foreground/25 underline-offset-4 group-hover:decoration-foreground/50">
                    {p.meta.title}
                  </h2>
                  <span className="shrink-0 text-xs tracking-[0.18em] text-foreground/60">
                    {formatDate(p.meta.date)}
                  </span>
                </div>

                {p.meta.description && (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                    {p.meta.description}
                  </p>
                )}

                {p.meta.tags && p.meta.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-foreground/12 bg-foreground/3 px-3 py-1 text-[11px] tracking-[0.14em] text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 text-xs tracking-[0.22em] uppercase text-foreground/60 group-hover:text-foreground">
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
