// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type React from "react";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About | Kou Nagai Studio",
  description: "プロフィール・できることリスト",
};

const ABOUT_HERO_SRC = "/images/about/hero.webp";
// 装飾目的のサブヒーローなので alt は空でOK（スクリーンリーダーに読ませない）
const ABOUT_HERO_ALT = "";

const whatIDo = [
  {
    title: "静的サイト / LP コーディング",
    desc: "構造（HTML）・見た目（CSS）・挙動（JS）の基本に沿って実装します。",
  },
  {
    title: "既存サイトの改修・バグ修正",
    desc: "崩れ・不具合・フォームの問題などを原因から切り分け、再発しにくい形に整えます。",
  },
  {
    title: "品質改善（A11y / セマンティック）",
    desc: "読みやすさ・操作しやすさ・保守性を意識し、公開前の品質を底上げします。",
  },
  {
    title: "フォーム実装（セキュリティ重視）",
    desc: "CSRF対策・バリデーション・スパム対策まで含めて、安心して運用できる形で組みます。",
  },
  {
    title: "WordPressテーマ化 / 組み込み",
    desc: "HTML/CSS/JSで作ったサイトをテーマ化し、更新しやすい運用に載せ替えます。",
  },
  {
    title: "Next.js + MDX のブログ構築",
    desc: "記事追加・一覧・詳細。運用しやすい最小構成から、回遊性の拡張まで。",
  },
  {
    title: "Tailwind CSS でのUI調整",
    desc: "余白・線・タイポ・コンポーネントの統一で、全体の雰囲気を整えます。",
  },
] as const;

const focus = [
  { label: "Build", value: "HTML / CSS / JS", note: "semantic / maintainable" },
  { label: "UX", value: "spacing / type", note: "readability first" },
  { label: "Motion", value: "animation", note: "JS assisted" },
  { label: "Forms", value: "PHP scratch", note: "CSRF / validate / spam" },
  { label: "Fix", value: "bugs / layout", note: "refactor & repair" },
  { label: "WP", value: "themeing", note: "static → WP" },
  { label: "Care", value: "A11y / Security", note: "quality as default" },
] as const;

function Section({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <section className="mt-12 border-t border-border pt-10">
      <Reveal
        as="h2"
        className="text-sm tracking-[0.22em] uppercase text-muted"
        delay={delay}
      >
        {title}
      </Reveal>
      {children}
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <Reveal
            as="p"
            className="text-xs tracking-[0.22em] uppercase text-muted"
            delay={60}
          >
            Profile
          </Reveal>
          <Reveal
            as="h1"
            className="mt-3 text-3xl font-semibold tracking-tight"
            delay={120}
          >
            About
          </Reveal>
        </div>

        <Reveal as="div" delay={180}>
          <Link href="/" className="kns-btn-ghost" aria-label="Homeへ戻る">
            <span>Home</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </header>

      {/* ✅ サブヒーロー（Reveal） */}
      <Reveal
        as="div"
        className="mt-10 overflow-hidden rounded-2xl border border-border bg-panel"
        delay={220}
      >
        <div className="relative h-44 sm:h-52 md:h-60">
          <Image
            src={ABOUT_HERO_SRC}
            alt={ABOUT_HERO_ALT}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />

          {/* ✅ 暗幕を弱める */}
          <div className="absolute inset-0 hero-scrim opacity-60" aria-hidden="true" />

          {/* ✅ うっすらグラデ（強すぎない） */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/0 to-transparent"
            aria-hidden="true"
          />
        </div>
      </Reveal>

      <Section title="Bio" delay={300}>
        <div className="mt-6 grid gap-8 md:grid-cols-12">
          {/* ✅ Bio本文（Reveal） */}
          <Reveal as="div" className="md:col-span-8" delay={360}>
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              ご覧いただきありがとうございます。Kou Nagaiです。
              <br />
              デザインの意図に沿って、コーディングで「気持ちいい体験」まで仕上げることが得意です。
              <br />
              HTMLはセマンティックを意識し、CSSでは余白とタイポを整え、保守しやすい構造で実装することを特に意識しています。必要に応じてJavaScriptでアニメーションやUIの改善も実施いたします。
              <br />
              フォームは基本的にスクラッチで組んでいます。CSRF対策・バリデーション・ハニーポットなど、セキュリティ面は特に丁寧に扱います。
              <br />
              既存サイトの崩れ・バグ修正、リニューアル時の調整も対応可能です。
              <br />
              ご相談はお気軽にどうぞ。
            </p>
          </Reveal>

          {/* ✅ Focusカード：カードもReveal、各行もReveal */}
          <div className="md:col-span-4">
            <Reveal
              as="div"
              className="rounded-2xl border border-border bg-panel p-5"
              delay={420}
            >
              <Reveal
                as="p"
                className="text-xs tracking-[0.22em] uppercase text-muted"
                delay={460}
              >
                Focus
              </Reveal>

              <ul className="mt-4 space-y-3">
                {focus.map((f, idx) => (
                  <Reveal
                    as="li"
                    key={f.label}
                    className="space-y-1"
                    delay={520 + idx * 70}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium text-muted">
                        {f.label}
                      </span>
                      <span className="text-xs tracking-[0.16em] text-muted">
                        {f.value}
                      </span>
                    </div>
                    <div className="h-px w-full bg-border" />
                    <p className="text-[11px] leading-relaxed tracking-[0.14em] text-muted">
                      {f.note}
                    </p>
                  </Reveal>
                ))}
              </ul>

              <Reveal as="div" className="mt-6 pl-4" delay={520 + focus.length * 70 + 40}>
                <p className="relative text-sm leading-relaxed text-muted">
                  <span className="absolute left-[-1rem] top-0 h-full w-px bg-border" />
                  “作って終わり”ではなく、運用と改善まで意識して仕上げます。
                </p>
              </Reveal>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section title="What I Do" delay={520}>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {whatIDo.map((item, idx) => (
            <Reveal
              as="li"
              key={item.title}
              className="rounded-2xl border border-border bg-panel p-6 transition hover:bg-foreground/5"
              delay={580 + idx * 80}
            >
              <p className="text-base font-medium tracking-tight">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
            </Reveal>
          ))}
        </ul>
      </Section>
    </main>
  );
}
