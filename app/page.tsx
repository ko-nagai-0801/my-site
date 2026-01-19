// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getLatestPosts } from "@/lib/posts";

export default async function Home() {
  const latest = await getLatestPosts(3);

  return (
    <main className="container py-14">
      {/* Hero Visual */}
      <section>
        <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 shadow-2xl shadow-black/30">
          {/* モバイルは見やすさ優先で少し縦長、sm以上は21:9 */}
          <div className="relative aspect-[16/10] sm:aspect-[21/9]">
            <Image
              src="/images/hero.png"
              alt="Site hero visual"
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover saturate-[0.85] contrast-[1.05] brightness-[0.9]"
            />

            {/* トーンを揃える薄い被せ（暗背景でも成立） */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />
            {/* うっすらフレーム感 */}
            <div className="absolute inset-0 ring-1 ring-foreground/10" />
          </div>
        </div>

        <p className="mt-3 text-[11px] tracking-[0.18em] text-foreground/55">
          VISUAL / ONE IMAGE HERO
        </p>
      </section>

      {/* Intro */}
      <section className="mt-10">
        <p className="text-xs tracking-[0.22em] uppercase text-foreground/60">
          Portfolio & Blog
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">My Site</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
          余白・タイポ・情報設計を整えながら、MDXで記事を積み上げていくミニブログ。
        </p>
      </section>

      {/* Latest */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="text-sm tracking-[0.22em] uppercase text-foreground/70">
            Latest Posts
          </h2>
          <Link
            href="/blog"
            className="text-xs tracking-[0.22em] uppercase text-foreground/60 hover:text-foreground"
          >
            View all
          </Link>
        </div>

        <ul className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
          {latest.map((p) => (
            <li key={p.slug} className="py-6">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground/50"
                  >
                    <h3 className="text-lg font-medium tracking-tight">
                      {p.meta.title}
                    </h3>
                  </Link>

                  {p.meta.description && (
                    <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                      {p.meta.description}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-xs tracking-[0.18em] text-foreground/60">
                  {p.meta.date}
                </div>
              </div>

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
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
