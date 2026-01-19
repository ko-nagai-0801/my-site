// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | My Site",
  description: "プロフィール・できること・リンク集",
};

const links = [
  { label: "X", href: "https://x.com/k_n_8141" },
  { label: "GitHub", href: "https://github.com/ko-nagai-0801" },
  { label: "note", href: "https://note.com/gapsmilegeek" },
  { label: "Qiita", href: "https://qiita.com/ko_nagai_0801" },
  // { label: "Blog", href: "https://gapsmilegeek.com" },
] as const;

const whatIDo = [
  {
    title: "Next.js + MDX のブログ構築",
    desc: "記事追加・一覧・詳細。運用しやすい最小構成から、回遊性の拡張まで。",
  },
  {
    title: "Tailwind CSS でのUI調整",
    desc: "余白・線・タイポ・コンポーネントの統一で、全体の雰囲気を整えます。",
  },
  {
    title: "静的サイト / LP コーディング",
    desc: "構造（HTML）・見た目（CSS）・挙動（JS）の基本に沿って実装します。",
  },
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-foreground/10 pt-10">
      <h2 className="text-sm tracking-[0.22em] uppercase text-foreground/70">
        {title}
      </h2>
      {children}
    </section>
  );
}

function displayUrl(href: string) {
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function AboutPage() {
  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-foreground/60">
            Profile
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">About</h1>
        </div>

        <Link
          href="/"
          className="text-xs tracking-[0.22em] uppercase text-foreground/60 hover:text-foreground"
        >
          Home
        </Link>
      </header>

      <Section title="Bio">
        <div className="mt-6 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="max-w-2xl text-sm leading-relaxed text-foreground/80">
              ここに自己紹介文を書きます（例：Web制作 / Next.js / MDXブログ構築 など）。
              <br />
              方針や得意領域を2〜3行でまとめると、読みやすくて信頼感が出ます。
            </p>
          </div>

          {/* 一旦非表示にしたい場合は、このブロックを丸ごとコメントアウトでOK */}
          <div className="md:col-span-4">
            <div className="rounded-2xl border border-foreground/10 bg-foreground/3 p-5">
              <p className="text-xs tracking-[0.22em] uppercase text-foreground/60">
                Focus
              </p>
              <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground/75">Design</span>
                  <span className="text-[11px] tracking-[0.14em] text-foreground/60">
                    spacing / type
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground/75">Build</span>
                  <span className="text-[11px] tracking-[0.14em] text-foreground/60">
                    Next.js / MDX
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground/75">Ship</span>
                  <span className="text-[11px] tracking-[0.14em] text-foreground/60">
                    CI / deploy
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section title="What I Do">
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {whatIDo.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-foreground/10 bg-foreground/3 p-6 transition hover:border-foreground/15 hover:bg-foreground/5"
            >
              <p className="text-base font-medium tracking-tight">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                {item.desc}
              </p>
            </li>
          ))}
        </ul>

        {/* 必要ならここも一旦非表示にできます */}
        {/* <p className="mt-6 text-[11px] leading-relaxed tracking-[0.18em] text-foreground/55">
          具体的な実績・制作範囲は、別ページにまとめてリンクする想定です。
        </p> */}
      </Section>

      <Section title="Links">
        <ul className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
          {links.map((l) => (
            <li key={l.href} className="py-5">
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l.label} を開く`}
                className="group flex items-center justify-between gap-6"
              >
                <div className="min-w-0">
                  <span className="text-sm font-medium underline decoration-foreground/25 underline-offset-4 group-hover:decoration-foreground/50">
                    {l.label}
                  </span>
                  <p className="mt-1 truncate text-xs tracking-[0.16em] text-foreground/55">
                    {displayUrl(l.href)}
                  </p>
                </div>

                <span className="shrink-0 text-xs tracking-[0.22em] uppercase text-foreground/55 group-hover:text-foreground/75">
                  Open →
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* <p className="mt-4 text-[11px] leading-relaxed tracking-[0.18em] text-foreground/55">
          ※必要なら「お問い合わせ」「制作実績」への導線をここに追加できます。
        </p> */}
      </Section>
    </main>
  );
}
