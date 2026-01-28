/* components/blog/PostsList.tsx */
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const DEFAULT_THUMB = "/images/blog/noimage.webp";

export type PostLike = {
  slug: string;
  meta: {
    title: string;
    date: string;
    description?: string;
    tags?: string[];
    image?: { src: string; alt: string };
  };
};

type Variant = "blog" | "home" | "latest";
type LinkMode = "wrap" | "title";

function PostThumb({ src, alt }: { src: string; alt: string }) {
  return (
    // ✅ 最小幅（sm未満）では大きく＆中央寄せ、sm以上では少し小さく左寄せ
    <div className="relative mx-auto aspect-[16/10] w-44 shrink-0 overflow-hidden rounded-xl border border-border bg-panel sm:mx-0 sm:w-36">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 144px, 160px"
        className="object-cover"
      />
    </div>
  );
}

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
  // ✅ latest（Home表示）だけ：2カラム行カード
  // - 右カラム全体をリンク
  // - Readは削除
  // - サムネはデフォルト noimage.webp
  if (variant === "latest") {
    return (
      <ul className="space-y-4 sm:space-y-5">
        {posts.map((p) => {
          const tags = p.meta.tags ?? [];

          const thumbSrc = p.meta.image?.src || DEFAULT_THUMB;
          const thumbAlt = p.meta.image?.alt || p.meta.title;

          const titleNode =
            linkMode === "title" ? (
              <span className="text-base font-medium tracking-tight underline underline-offset-4 group-hover:opacity-80">
                {p.meta.title}
              </span>
            ) : (
              <h2 className="text-base font-medium tracking-tight underline underline-offset-4">
                {p.meta.title}
              </h2>
            );

          const descriptionNode = p.meta.description ? (
            <p
              className={[
                "mt-2 text-sm leading-relaxed text-muted overflow-hidden",
                "[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]",
              ].join(" ")}
            >
              {p.meta.description}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              記事の概要は本文から自動生成しています。
            </p>
          );

          const tagsNode =
            tags.length > 0 ? (
              <div className="mt-3 max-h-[4.2rem] overflow-hidden">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const href = `/tags/${encodeURIComponent(tag.trim())}`;

                    return (
                      <Link key={`${p.slug}-${tag}`} href={href} className="chip">
                        {tag}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-xs tracking-[0.18em] text-muted">—</div>
            );

          return (
            <li key={p.slug}>
              <SpotlightCard
                className={[
                  "rounded-2xl border border-border bg-panel p-5 transition hover:border-foreground/15 sm:p-6",
                  "grid gap-4 md:grid-cols-[160px_1fr] md:gap-8",
                ].join(" ")}
              >
                {/* 左カラム：日付 + タグ */}
                <div className="min-w-0">
                  <div className="text-xs tracking-[0.18em] text-muted">
                    {formatDate(p.meta.date)}
                  </div>
                  {tagsNode}
                </div>

                {/* 右カラム：全体リンク（サムネ＋タイトル＋説明） */}
                <Link
                  href={`/blog/${p.slug}`}
                  className="group block min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-foreground/25"
                  aria-label={`${p.meta.title} を読む`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
                    <PostThumb src={thumbSrc} alt={thumbAlt} />

                    <div className="min-w-0">
                      {titleNode}
                      {descriptionNode}
                    </div>
                  </div>
                </Link>
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
