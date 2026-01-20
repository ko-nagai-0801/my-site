/* app/works/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllWorks } from "@/lib/works";

export const metadata: Metadata = {
  title: "Works | My Site",
  description: "制作実績 / 作業ログ / サンプルの一覧",
};

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4"
      aria-label={label}
    >
      {label} ↗
    </a>
  );
}

function WorkThumb({
  src,
  alt,
  slug,
}: {
  src: string;
  alt: string;
  slug: string;
}) {
  return (
    <Link
      href={`/works/${slug}`}
      aria-label={`${alt} の詳細へ`}
      className="block"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-panel">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 520px, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>
    </Link>
  );
}

export default async function WorksPage() {
  const works = await getAllWorks();

  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-muted">
            Portfolio
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Works</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            制作物・サンプル・作業ログの一覧です。各カードから詳細ページへ移動できます。
          </p>
        </div>

        <Link
          href="/"
          className="text-xs tracking-[0.22em] uppercase text-muted hover:text-foreground"
        >
          Home
        </Link>
      </header>

      <div className="mt-10 hairline" />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {works.map((w) => (
          <li
            key={w.slug}
            className="group rounded-2xl border border-border bg-panel p-5 sm:p-6 transition hover:border-foreground/15"
          >
            {w.meta.image && (
              <WorkThumb
                src={w.meta.image.src}
                alt={w.meta.image.alt}
                slug={w.slug}
              />
            )}

            <h2 className="mt-5 text-base font-medium tracking-tight">
              <Link href={`/works/${w.slug}`} className="hover:underline">
                {w.meta.title}
              </Link>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              {w.meta.summary}
            </p>

            {w.meta.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {w.meta.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {(w.meta.href || w.meta.repo || w.meta.note) && (
              <div className="mt-5 space-y-2">
                {(w.meta.href || w.meta.repo) && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-[0.16em] text-muted">
                    {w.meta.href && (
                      <ExternalLink href={w.meta.href} label="Open site" />
                    )}
                    {w.meta.repo && (
                      <ExternalLink href={w.meta.repo} label="Repository" />
                    )}
                  </div>
                )}

                {w.meta.note && (
                  <p className="text-xs leading-relaxed text-muted">
                    {w.meta.note}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-10 text-xs leading-relaxed tracking-[0.16em] text-muted">
        ※ 次は「タグ絞り込み（フィルタ）」を追加していきます。
      </p>
    </main>
  );
}
