/* components/blog/PostsList.tsx */
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import type { PostLike } from "@/lib/posts";

const DEFAULT_THUMB = "/images/blog/noimage.webp";

type Variant = "blog" | "home" | "latest";
type LinkMode = "wrap" | "title";

function getThumb(meta: PostLike["meta"]) {
  return {
    src: meta.image?.src ?? DEFAULT_THUMB,
    alt: meta.image?.alt ?? meta.title,
  };
}

function PostThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto aspect-[16/10] w-44 shrink-0 overflow-hidden rounded-xl border border-border bg-panel sm:mx-0 sm:w-36">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 640px) 144px, 176px"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}

/**
 * ✅ TOPの見え方（行カード）
 * - blog / home / latest を同じ見た目に寄せる
 */
function RowCardsList({
  posts,
  linkMode,
}: {
  posts: PostLike[];
  linkMode: LinkMode;
}) {
  return (
    <ul className="space-y-4 sm:space-y-5">
      {posts.map((p) => {
        const tags = p.meta.tags ?? [];
        const thumb = getThumb(p.meta);

        // ✅ 下線なし（hover opacityでリンク感）
        const titleNode =
          linkMode === "title" ? (
            <span className="text-base font-medium tracking-tight group-hover:opacity-80">
              {p.meta.title}
            </span>
          ) : (
            <h2 className="text-base font-medium tracking-tight">
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
                {tags.map((tag) => (
                  <Link
                    key={`${p.slug}-${tag}`}
                    href={`/tags/${encodeURIComponent(tag.trim())}`}
                    className="chip hover:opacity-80"
                  >
                    {tag}
                  </Link>
                ))}
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
                  <PostThumb src={thumb.src} alt={thumb.alt} />
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

export function PostsList({
  posts,
  variant = "blog",
  linkMode = "title",
  showReadLabel = false,
}: {
  posts: PostLike[];
  variant?: Variant;
  linkMode?: LinkMode;
  showReadLabel?: boolean; // 互換用（現状は row-card 表示では未使用）
}) {
  // ✅ blog / home / latest を同じ「TOPの見え方（行カード）」に寄せる
  if (variant === "latest" || variant === "blog" || variant === "home") {
    return <RowCardsList posts={posts} linkMode={linkMode} />;
  }

  // 将来 variant を増やす場合の保険（今は到達しない想定）
  const listClass = "divide-y divide-border border-y border-border";

  return (
    <ul className={listClass}>
      {posts.map((p) => (
        <li key={p.slug} className="py-7">
          <Link href={`/blog/${p.slug}`} className="group block">
            <div className="flex items-start justify-between gap-6">
              <span className="text-lg font-medium tracking-tight group-hover:opacity-80">
                {p.meta.title}
              </span>
              <span className="shrink-0 text-xs tracking-[0.18em] text-muted">
                {formatDate(p.meta.date)}
              </span>
            </div>

            {p.meta.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {p.meta.description}
              </p>
            ) : null}

            {showReadLabel ? (
              <div className="mt-4 text-xs tracking-[0.22em] uppercase text-muted">
                Read →
              </div>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
