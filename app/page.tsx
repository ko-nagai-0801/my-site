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
        {/* 画像は “面” を優先。スマホは角丸弱め（参考寄せ） */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-panel">
          <div className="relative aspect-[4/3] sm:aspect-[21/9]">
            <Image
              src="/images/hero.webp"
              alt="Site hero visual"
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover saturate-[0.9] contrast-[1.05] brightness-[0.92]"
            />

            {/* うっすら暗幕（文字を重ねないので弱めでOK） */}
            <div className="hero-scrim pointer-events-none absolute inset-0 opacity-70" />

            {/* 参考寄せ：画像上にカードを置かない（=写真が主役） */}
          </div>
        </div>

        {/* 画像の下でテキストを読む（参考サイトの“余白で読ませる”） */}
        <div className="mt-8 sm:mt-10">
          <p className="text-xs tracking-[0.22em] uppercase text-muted">
            Portfolio & Blog
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            My Site
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            セマンティックなHTMLと整った余白・タイポで、意図を崩さず実装します。ここでは制作のメモと学びを記録します。
          </p>

          {/* キャッチコピーを入れるならここ（画像上ではなく下） */}
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/85">
            デザインの意図を、コードで「気持ち良い体験」へ。
          </p>

          <p className="mt-2 text-xs tracking-[0.18em] text-muted">
            Semantic HTML / Spacing &amp; Type / Secure Forms
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
                  <Link href={`/blog/${p.slug}`} className="underline underline-offset-4">
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
