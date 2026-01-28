/* components/blog/PostsList.tsx */
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export type PostLike = {
  slug: string;
  meta: {
    title: string;
    date: string;
    description?: string;
    tags?: string[];
  };
};

type Variant = "blog" | "home" | "latest";
type LinkMode = "wrap" | "title";

export function PostsList({
  posts,
  variant = "blog",
  linkMode = "title",
  showReadLabel = false,
}: {
  posts: PostLike[];
  variant?: Variant;
  linkMode?: LinkMode;
  showReadLabel?: boolean;
}) {
  // ✅ latest（Home表示）だけ「Works寄せ：カード型」にする
  if (variant === "latest") {
    return (
      <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => {
          const tags = p.meta.tags ?? [];

          return (
            <li key={p.slug} className="flex">
              <SpotlightCard
                className={[
                  "flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-panel p-5 transition hover:border-foreground/15 sm:p-6",
                  // ✅ 2列になる md 以上で高さ固定（Worksと同じ思想）
                  "md:h-[340px]",
                ].join(" ")}
              >
                {/* タイトル + 日付 */}
                <div className="flex items-start justify-between gap-6">
                  {linkMode === "title" ? (
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-base font-medium tracking-tight underline underline-offset-4 hover:opacity-80"
                    >
                      {p.meta.title}
                    </Link>
                  ) : (
                    <h2 className="text-base font-medium tracking-tight underline underline-offset-4">
                      {p.meta.title}
                    </h2>
                  )}

                  <span className="shrink-0 text-xs tracking-[0.18em] text-muted">
                    {formatDate(p.meta.date)}
                  </span>
                </div>

                {/* description（最大3行） */}
                {p.meta.description ? (
                  <p
                    className={[
                      "mt-3 text-sm leading-relaxed text-muted overflow-hidden",
                      "[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]",
                    ].join(" ")}
                  >
                    {p.meta.description}
                  </p>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    記事の概要は本文から自動生成しています。
                  </p>
                )}

                {/* tags（最大2段くらい） */}
                {tags.length > 0 ? (
                  <div className="mt-4 max-h-[3.9rem] overflow-hidden">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        const href = `/tags/${encodeURIComponent(tag.trim())}`;

                        return linkMode === "wrap" ? (
                          <span key={`${p.slug}-${tag}`} className="chip">
                            {tag}
                          </span>
                        ) : (
                          <Link key={`${p.slug}-${tag}`} href={href} className="chip">
                            {tag}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {/* footer（常に下） */}
                <div className="mt-auto pt-5 text-xs tracking-[0.22em] uppercase text-muted">
                  <Link href={`/blog/${p.slug}`} className="hover:opacity-80">
                    Read →
                  </Link>
                </div>
              </SpotlightCard>
            </li>
          );
        })}
      </ul>
    );
  }

  // ✅ blog / home はこれまで通り：罫線リスト型
  const listClass =
    variant === "blog"
      ? "divide-y divide-border border-y border-border"
      : "divide-y divide-border border-y border-border";

  return (
    <ul className={listClass}>
      {posts.map((p) => {
        const tags = p.meta.tags ?? [];
        const inner = (
          <>
            <div className="flex items-start justify-between gap-6">
              {linkMode === "title" ? (
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-lg font-medium tracking-tight underline underline-offset-4 hover:opacity-80"
                >
                  {p.meta.title}
                </Link>
              ) : (
                <h2 className="text-lg font-medium tracking-tight underline underline-offset-4">
                  {p.meta.title}
                </h2>
              )}

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
                {tags.map((tag) => {
                  const href = `/tags/${encodeURIComponent(tag.trim())}`;

                  // wrap のときはネスト回避のため span 表示（title モードで Link になる）
                  return linkMode === "wrap" ? (
                    <span key={`${p.slug}-${tag}`} className="chip">
                      {tag}
                    </span>
                  ) : (
                    <Link key={`${p.slug}-${tag}`} href={href} className="chip">
                      {tag}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {showReadLabel ? (
              <div className="mt-4 text-xs tracking-[0.22em] uppercase text-muted">
                <Link href={`/blog/${p.slug}`} className="hover:opacity-80">
                  Read →
                </Link>
              </div>
            ) : null}
          </>
        );

        return (
          <li key={p.slug} className="py-7">
            {linkMode === "wrap" ? (
              <Link href={`/blog/${p.slug}`} className="group block">
                {inner}
              </Link>
            ) : (
              <div className="group">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
