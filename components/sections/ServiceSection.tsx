/* components/sections/ServiceSection.tsx */
import type { ComponentType } from "react";
import { Reveal } from "@/components/ui/Reveal";

function IconCode(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8.5 8L4 12l4.5 4M15.5 8L20 12l-4.5 4M13.5 6l-3 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWordPress(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 20.2A8.2 8.2 0 1 0 12 3.8a8.2 8.2 0 0 0 0 16.4Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M7.2 9.2c.7 3.1 2.2 7.5 2.2 7.5l2-6.1 1.9 6.1 2.3-7.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3.5 19 6.5v6.2c0 4.5-3 7.7-7 8.8-4-1.1-7-4.3-7-8.8V6.5l7-3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12 1.8 1.8 3.8-3.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Item = {
  title: string;
  kicker: string;
  body: string;
  Icon: ComponentType<React.SVGProps<SVGSVGElement>>;
};

const items: Item[] = [
  {
    title: "Frontend",
    kicker: "Semantic HTML / spacing / type",
    body: "意図を崩さない実装。見た目だけでなく、読みやすさ・導線・余白まで整えます。",
    Icon: IconCode,
  },
  {
    title: "WordPress",
    kicker: "Theme tweak / layout fixes",
    body: "表示崩れやテーマ調整、軽微改善。運用しやすい形に整備して引き継ぎます。",
    Icon: IconWordPress,
  },
  {
    title: "Secure forms",
    kicker: "CSRF / validation / hygiene",
    body: "フォームやデータ周りは安全側で。実務で困りがちな罠を避ける設計にします。",
    Icon: IconShield,
  },
];

export function ServiceSection() {
  return (
    <section className="mt-14">
      <header className="text-center">
        <Reveal as="h2" className="kns-section-title" delay={60}>
          Service
        </Reveal>
      </header>

      <div className="mt-10 hairline" />

      <ul className="mt-10 grid gap-10 md:grid-cols-3">
        {items.map(({ title, kicker, body, Icon }, idx) => (
          <Reveal
            as="li"
            key={title}
            className="text-center"
            delay={120 + idx * 120}
          >
            {/* ✅ 枠/背景を消して「アイコンのみ」＋サイズUP */}
            <Icon className="mx-auto h-10 w-10 text-foreground/80 sm:h-12 sm:w-12" />

            <h3 className="mt-4 kns-item-title">{title}</h3>

            {/* ✅ 既存のタイポユーティリティに寄せてトーン統一 */}
            <p className="mt-2 kns-kicker">{kicker}</p>

            <p className="mt-4 kns-body text-left">{body}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
