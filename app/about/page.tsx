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
  // { label: "Qiita", href: "https://qiita.com/ko_nagai_0801" },
  // { label: "Blog", href: "https://gapsmilegeek.com" },
];

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

      <section className="mt-12 border-t border-foreground/10 pt-10">
        <h2 className="text-sm tracking-[0.22em] uppercase text-foreground/70">
          Bio
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/80">
          ここに自己紹介文を書きます（例：Web制作 / Next.js / MDXブログ構築 など）。
          <br />
          方針や得意領域を2〜3行でまとめると、読みやすくて信頼感が出ます。
        </p>
      </section>

      <section className="mt-12 border-t border-foreground/10 pt-10">
        <h2 className="text-sm tracking-[0.22em] uppercase text-foreground/70">
          What I Do
        </h2>

        <ul className="mt-6 space-y-4">
          {[
            {
              title: "Next.js + MDX のブログ構築",
              desc: "記事追加・一覧・詳細、運用しやすい最小構成から拡張まで。",
            },
            {
              title: "Tailwind CSS でのUI調整",
              desc: "余白・タイポ・コンポーネントの統一で見た目を整えます。",
            },
            {
              title: "静的サイト / LP コーディング",
              desc: "構造化（HTML）・見た目（CSS）・挙動（JS）の基本に強いです。",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-foreground/10 bg-foreground/3 p-6"
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
      </section>

      <section className="mt-12 border-t border-foreground/10 pt-10">
        <h2 className="text-sm tracking-[0.22em] uppercase text-foreground/70">
          Links
        </h2>

        <ul className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
          {links.map((l) => (
            <li key={l.href} className="py-5">
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6"
              >
                <span className="underline decoration-foreground/25 underline-offset-4 group-hover:decoration-foreground/50">
                  {l.label}
                </span>
                <span className="text-xs tracking-[0.18em] text-foreground/55 group-hover:text-foreground/75">
                  {l.href.replace(/^https?:\/\//, "")} →
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* <p className="mt-4 text-[11px] leading-relaxed tracking-[0.18em] text-foreground/55">
          ※必要ならここに「問い合わせ」や「制作実績」への導線も足せます。
        </p> */}
      </section>
    </main>
  );
}
