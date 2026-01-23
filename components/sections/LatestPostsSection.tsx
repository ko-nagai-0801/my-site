/* components/sections/LatestPostsSection.tsx */
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

export type LatestPost = {
  slug: string;
  meta: {
    title: string;
    date: string;
    description?: string;
    tags?: string[];
  };
};

export function LatestPostsSection({ posts }: { posts: LatestPost[] }) {
  return (
    <section className="mt-14">
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="text-sm tracking-[0.22em] uppercase text-muted">
          Latest Posts
        </h2>
        <Link href="/blog" className="nav-link">
          View all
        </Link>
      </div>

      <div className="mt-4 hairline" />

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {posts.map((p) => (
          <li key={p.slug} className="py-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <Link
                  href={`/blog/${p.slug}`}
                  className="underline underline-offset-4"
                >
                  <h3 className="text-lg font-medium tracking-tight">
                    {p.meta.title}
                  </h3>
                </Link>

                {p.meta.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.meta.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 text-xs tracking-[0.18em] text-muted">
                {formatDate(p.meta.date)}
              </div>
            </div>

            {p.meta.tags && p.meta.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.meta.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
