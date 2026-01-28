/* components/sections/HeroSection.tsx */
import Image from "next/image";

export function HeroSection() {
  return (
    <section>
      <div className="overflow-hidden rounded-2xl border border-border bg-panel shadow-2xl shadow-black/30 sm:rounded-3xl">
        <div className="relative aspect-[4/3] sm:aspect-[21/9]">
          <Image
            src="/images/hero.webp"
            alt="Kou Nagai Studio hero visual"
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover saturate-[0.9] contrast-[1.05] brightness-[0.92]"
          />

          {/* 下部だけ薄い帯（グラデ） */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-border" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <div className="flex flex-col items-start gap-2 sm:gap-3">
              <p className="text-sm font-medium leading-relaxed text-foreground sm:text-base sm:max-w-[44rem]">
                デザインの意図を、コードで「気持ち良い体験」へ。
              </p>

              <p className="text-xs tracking-[0.18em] text-foreground/75 sm:text-sm sm:max-w-[44rem]">
                Semantic HTML / Spacing &amp; Type / Secure Forms
              </p>
            </div>
          </div>
        </div>
      </div>

      <header className="mt-8 text-center sm:mt-10">
        <p className="kns-section-label">Studio / Portfolio / Blog</p>

        <h1 className="mt-4 text-4xl font-light tracking-[0.08em] text-foreground sm:text-5xl">
          Kou Nagai Studio
        </h1>

        <p className="mx-auto mt-4 max-w-2xl kns-body text-left">
          セマンティックなHTMLと整った余白・タイポで、意図を崩さず実装します。ここでは制作のメモと学びを記録します。
        </p>
      </header>
    </section>
  );
}
