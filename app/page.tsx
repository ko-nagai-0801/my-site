// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getLatestPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";

export default async function Home() {
  const latest = await getLatestPosts(3);

  return (
    <main className="container py-14">
      {/* Hero */}
      <section>
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-panel shadow-2xl shadow-black/30">
          <div className="relative aspect-[4/3] sm:aspect-[21/9]">
            <Image
              src="/images/hero.webp"
              alt="Site hero visual"
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover saturate-[0.9] contrast-[1.05] brightness-[0.92]"
            />

            {/* 下部だけ薄い帯（グラデ） */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-border" />

            {/* Copy：日本語だけモバイル縦書き / 横書き時は2行 */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 hero-text">
              <div className="flex items-end gap-4 sm:flex-col sm:items-start sm:gap-2">
                {/* 日本語（モバイル縦書き） */}
                <p className="hero-ja-vertical shrink-0 text-sm sm:text-base font-medium text-foreground sm:max-w-[44rem]">
                  デザインの意図を、コードで「気持ち良い体験」へ。
                </p>

                {/* 英文（横書き固定） */}
                <p className="flex-1 text-xs sm:text-sm tracking-[0.18em] text-foreground/75 sm:max-w-[44rem]">
                  Semantic HTML / Spacing &amp; Type / Secure Forms
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <p className="text-xs tracking-[0.22em] uppercase text-muted">
            Portfolio &amp; Blog
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">My Site</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            セマンティックなHTMLと整った余白・タイポで、意図を崩さず実装します。ここでは制作のメモと学びを記録します。
          </p>
        </div>
      </section>

      {/* Latest */}
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
          {latest.map((p) => (
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
    </main>
  );
}
