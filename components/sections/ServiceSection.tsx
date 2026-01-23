/* components/sections/ServiceSection.tsx */
import type { ReactNode } from "react";

type ServiceItem = {
  ja: string;
  en: string;
  icon: ReactNode;
  body: string;
};

function IconPencil() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10"
      fill="none"
    >
      <path
        d="M4 20l4.5-1 10-10a2 2 0 0 0 0-2.8l-.7-.7a2 2 0 0 0-2.8 0l-10 10L4 20z"
        className="stroke-muted-foreground"
        strokeWidth="1.5"
      />
      <path
        d="M13 6l5 5"
        className="stroke-muted-foreground"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconMouse() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10"
      fill="none"
    >
      <path
        d="M12 3c3 0 6 2.4 6 6.2V15c0 3.6-2.7 6-6 6s-6-2.4-6-6V9.2C6 5.4 9 3 12 3z"
        className="stroke-muted-foreground"
        strokeWidth="1.5"
      />
      <path
        d="M12 7v3"
        className="stroke-muted-foreground"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconCode() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10"
      fill="none"
    >
      <path
        d="M9 18l-6-6 6-6"
        className="stroke-muted-foreground"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 6l6 6-6 6"
        className="stroke-muted-foreground"
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
      icon: <IconPencil />,
      body:
        "要望のヒアリングから課題整理、優先順位付けまで。制作に入る前の準備を丁寧に行い、目的達成に必要な要素を見極めて進行します。",
    },
    {
      ja: "デザイン",
      en: "DESIGN",
      icon: <IconMouse />,
      body:
        "使う人の迷いを減らし、情報が自然に伝わる設計を重視。トーンや余白、視線誘導を整え、目的に沿った表現に落とし込みます。",
    },
    {
      ja: "コーディング",
      en: "CODING",
      icon: <IconCode />,
      body:
        "見た目の再現だけでなく、保守性や表示速度にも配慮。コンポーネント設計・アクセシビリティ・レスポンシブ対応を前提に実装します。",
    },
  ];

  return (
    <section id="service" className="container py-20 sm:py-28">
      {/* Title */}
      <header className="text-center">
        <h2 className="text-5xl font-light tracking-[0.08em] text-foreground sm:text-6xl">
          Service
        </h2>
      </header>

      {/* Items */}
      <div className="mx-auto mt-14 max-w-3xl space-y-16 sm:mt-16 sm:space-y-20">
        {items.map((item) => (
          <div key={item.en} className="text-center">
            <h3 className="text-2xl font-medium tracking-wide text-foreground sm:text-3xl">
              {item.ja}
            </h3>
            <p className="mt-3 text-xs tracking-[0.28em] text-muted-foreground">
              {item.en}
            </p>

            <div className="mt-6 flex justify-center">{item.icon}</div>

            <p className="mx-auto mt-8 max-w-2xl text-left text-sm leading-8 text-muted-foreground sm:text-base sm:leading-9">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
