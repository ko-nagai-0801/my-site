// components/blog/PostsList.tsx
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

export type PostLike = {
  slug: string;
  meta: {
    title: string;
    date: string;
    description?: string;
    tags?: string[];
  };
};

type Variant = "blog" | "latest";
type LinkMode = "wrap" | "title";

type Props = {
  posts: PostLike[];
  variant?: Variant; // spacing差分
  linkMode?: LinkMode; // blogは wrap, latestは title
  showReadLabel?: boolean; // blogだけ true
};

export function PostsList({
  posts,
  variant = "latest",
  linkMode = "title",
  showReadLabel = false,
}: Props) {
  const itemPadding = variant === "blog" ? "py-7" : "py-6";

  return (
    <ul className="divide-y divide-border border-y border-border">
      {posts.map((p) => {
        const tags = p.meta.tags ?? [];

        // ✅ blog: 行全体リンク（ネストリンクを避けるためタグはspan）
        if (linkMode === "wrap") {
          return (
            <li key={p.slug} className={itemPadding}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="flex items-start justify-between gap-6">
                  <h2 className="text-lg font-medium tracking-tight underline underline-offset-4">
                    {p.meta.title}
                  </h2>
                  <span className="shrink-0 text-xs tracking-[0.18em] text-muted">
                    {formatDate(p.meta.date)}
                  </span>
                </div>

                {p.meta.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.meta.description}
                  </p>
                ) : null}

                {tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={`${p.slug}-${tag}`} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {showReadLabel ? (
                  <div className="mt-4 text-xs tracking-[0.22em] uppercase text-muted">
                    Read →
                  </div>
                ) : null}
              </Link>
            </li>
          );
        }

        // ✅ latest: タイトルだけリンク（タグは /tags へリンク可能）
        return (
          <li key={p.slug} className={itemPadding}>
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

                {p.meta.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.meta.description}
                  </p>
                ) : null}
              </div>

              <div className="shrink-0 text-xs tracking-[0.18em] text-muted">
                {formatDate(p.meta.date)}
              </div>
            </div>

            {tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={`${p.slug}-${tag}`}
                    href={`/tags/${encodeURIComponent(tag.trim())}`}
                    className="chip"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
