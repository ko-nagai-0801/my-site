/* components/sections/ServiceSection.tsx */
import type { ComponentType } from "react";

type ServiceItem = {
  ja: string;
  en: string;
  Icon: ComponentType<{ className?: string }>;
  body: string;
};

function IconPencil({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4 20l4.5-1 10-10a2 2 0 0 0 0-2.8l-.7-.7a2 2 0 0 0-2.8 0l-10 10L4 20z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M13 6l5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconMouse({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 3c3 0 6 2.4 6 6.2V15c0 3.6-2.7 6-6 6s-6-2.4-6-6V9.2C6 5.4 9 3 12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M12 7v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconCode({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M9 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServiceSection() {
  const items: ServiceItem[] = [
    {
      ja: "ディレクション",
      en: "DIRECTION",
      Icon: IconPencil,
      body:
        "要望のヒアリングから課題整理、優先順位付けまで。制作に入る前の準備を丁寧に行い、目的達成に必要な要素を見極めて進行します。",
    },
    {
      ja: "デザイン",
      en: "DESIGN",
      Icon: IconMouse,
      body:
        "使う人の迷いを減らし、情報が自然に伝わる設計を重視。トーンや余白、視線誘導を整え、目的に沿った表現に落とし込みます。",
    },
    {
      ja: "コーディング",
      en: "CODING",
      Icon: IconCode,
      body:
        "見た目の再現だけでなく、保守性や表示速度にも配慮。コンポーネント設計・アクセシビリティ・レスポンシブ対応を前提に実装します。",
    },
  ];

  return (
    <section id="service" className="py-20 sm:py-28">
      <header className="text-center">
        <h2 className="kns-section-title">Service</h2>
      </header>

      <ul className="mx-auto mt-14 max-w-3xl space-y-16 sm:mt-16 sm:space-y-20">
        {items.map(({ en, ja, Icon, body }) => (
          <li key={en} className="text-center">
            <h3 className="kns-item-title">{ja}</h3>
            <p className="mt-3 kns-kicker">{en}</p>

            <div className="mt-6 flex justify-center">
              <Icon className="h-10 w-10 text-muted-foreground" />
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-left kns-body">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
