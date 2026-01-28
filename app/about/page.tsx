// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import type React from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export const metadata: Metadata = {
  title: "About | Kou Nagai Studio",
  description: "プロフィール・できることリスト",
};

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
    <section className="mt-10">
      <Reveal as="h2" className="kns-section-label" delay={delay}>
        {title}
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="container py-14">
      {/* 上部導線（Homeへ戻る） */}
      <Reveal as="div" className="flex justify-end" delay={40}>
        <Link href="/" className="kns-btn-ghost">
          <span>Home</span>
          <span aria-hidden="true">→</span>
        </Link>
      </Reveal>

      {/* ページ見出し：Home側のタイポに寄せる */}
      <header className="mt-10 text-center">
        <Reveal as="p" className="kns-page-kicker" delay={80}>
          Profile
        </Reveal>

        <Reveal as="h1" className="mt-3 kns-page-title" delay={120}>
          About
        </Reveal>

        <Reveal as="p" className="mx-auto mt-4 kns-lead" delay={160}>
          デザインの意図を崩さず、読みやすさ・余白・導線まで整えて実装します。
        </Reveal>
      </header>

      {/* 区切り線：Homeと同じリズム */}
      <Reveal as="div" className="mt-10 hairline" delay={200} />

      <Section title="Bio" delay={240}>
        <div className="grid gap-8 md:grid-cols-12">
          {/* Bio */}
          <div className="md:col-span-8">
            <div className="space-y-4">
              <Reveal as="p" className="kns-body" delay={260}>
                ご覧いただきありがとうございます。Kou Nagaiです。
              </Reveal>

              <Reveal as="p" className="kns-body" delay={300}>
                デザインの意図に沿って、コーディングで「気持ちいい体験」まで仕上げることが得意です。
              </Reveal>

              <Reveal as="p" className="kns-body" delay={340}>
                HTMLはセマンティックを意識し、CSSでは余白とタイポを整え、保守しやすい構造で実装することを特に意識しています。必要に応じてJavaScriptでアニメーションやUIの改善も実施いたします。
              </Reveal>

              <Reveal as="p" className="kns-body" delay={380}>
                フォームは基本的にスクラッチで組んでいます。CSRF対策・バリデーション・ハニーポットなど、セキュリティ面は特に丁寧に扱います。
              </Reveal>

              <Reveal as="p" className="kns-body" delay={420}>
                既存サイトの崩れ・バグ修正、リニューアル時の調整も対応可能です。
              </Reveal>

              <Reveal as="p" className="kns-body" delay={460}>
                ご相談はお気軽にどうぞ。
              </Reveal>
            </div>
          </div>

          {/* Focus */}
          <div className="md:col-span-4">
            <SpotlightCard className="rounded-2xl border border-border bg-panel p-6 transition hover:border-foreground/15">
              <Reveal as="p" className="kns-section-label" delay={260}>
                Focus
              </Reveal>

              <ul className="mt-5 space-y-4">
                {focus.map((f, i) => (
                  <Reveal as="li" key={f.label} className="space-y-2" delay={300 + i * 60}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium text-foreground/80">
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

              <Reveal as="div" className="mt-6 pl-4" delay={760}>
                <p className="relative text-sm leading-relaxed text-muted">
                  <span className="absolute left-[-1rem] top-0 h-full w-px bg-border" />
                  “作って終わり”ではなく、運用と改善まで意識して仕上げます。
                </p>
              </Reveal>
            </SpotlightCard>
          </div>
        </div>
      </Section>

      <Reveal as="div" className="mt-10 hairline" delay={220} />

      <Section title="What I Do" delay={260}>
        <ul className="grid gap-4 md:grid-cols-2">
          {whatIDo.map((item, idx) => (
            <Reveal as="li" key={item.title} delay={300 + idx * 80}>
              <SpotlightCard className="h-full rounded-2xl border border-border bg-panel p-6 transition hover:border-foreground/15">
                <p className="text-base font-medium tracking-[0.02em] text-foreground">
                  {item.title}
                </p>
                <p className="mt-2 kns-body">{item.desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Reveal as="div" className="mt-10 hairline" delay={220} />
    </main>
  );
}
