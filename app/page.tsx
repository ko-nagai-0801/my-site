// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getLatestPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";

export default async function Home() {
  const latest = await getLatestPosts(3);

  return (
    <main className="container py-14">
      {/* Hero Visual + Catch (bottom-left) */}
      <section>
        <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 shadow-2xl shadow-black/30">
          <div className="relative aspect-[16/10] sm:aspect-[21/9]">
            <Image
              src="/images/hero.webp"
              alt="Site hero visual"
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover saturate-[0.85] contrast-[1.05] brightness-[0.85]"
            />

            {/* 可読性用 overlay（下と左を少し強めに） */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-foreground/10" />

            {/* Catch copy (bottom-left) */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <div className="inline-block max-w-[52rem] bg-black/35 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm sm:text-base font-medium leading-relaxed text-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                  デザインの意図を、コードで「気持ち良い体験」へ。
                </p>
                <p className="mt-1 text-xs sm:text-sm tracking-[0.18em] text-foreground/85 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                  Semantic HTML / Spacing & Type / Secure Forms
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs tracking-[0.22em] uppercase text-foreground/60">
            Portfolio & Blog
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            My Site
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
            セマンティックなHTMLと整った余白・タイポで、意図を崩さず実装します。ここでは制作のメモと学びを記録します。
          </p>
        </div>
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
                  {formatDate(p.meta.date)}
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
