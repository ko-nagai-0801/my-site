/* components/sections/HeroSection.tsx */
import Image from "next/image";

export function HeroSection() {
  return (
    <section>
      <div className="overflow-hidden rounded-2xl border border-border bg-panel shadow-2xl shadow-black/30 sm:rounded-3xl">
        <div className="relative aspect-[4/3] sm:aspect-[21/9]">
          <Image
            src="/images/hero.webp"
            alt="Site hero visual"
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover saturate-[0.9] contrast-[1.05] brightness-[0.92]"
          />

          {/* 下部だけ薄い帯（グラデ） */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-border" />

          {/* Copy：日本語だけモバイル縦書き / 横書き時は2行 */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 hero-text">
            <div className="flex items-end gap-4 sm:flex-col sm:items-start sm:gap-2">
              {/* 日本語（モバイル縦書き） */}
              <p className="hero-ja-vertical shrink-0 text-sm font-medium text-foreground sm:text-base sm:max-w-[44rem]">
                デザインの意図を、コードで「気持ち良い体験」へ。
              </p>

              {/* 英文（横書き固定） */}
              <p className="flex-1 text-xs tracking-[0.18em] text-foreground/75 sm:text-sm sm:max-w-[44rem]">
                Semantic HTML / Spacing &amp; Type / Secure Forms
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10">
        <p className="text-xs tracking-[0.22em] uppercase text-muted">
          Portfolio &amp; Blog
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">My Site</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          セマンティックなHTMLと整った余白・タイポで、意図を崩さず実装します。ここでは制作のメモと学びを記録します。
        </p>
      </div>
    </section>
  );
}
