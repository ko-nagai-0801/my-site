/* components/sections/HeroSection.tsx */
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { TypeInText } from "@/components/ui/TypeInText";

export function HeroSection() {
  return (
    <section>
      {/* 画像だけ画面幅いっぱいに“抜く” */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="overflow-hidden border-y border-border bg-panel shadow-2xl shadow-black/30 sm:rounded-none">
          <div className="relative aspect-[4/3] sm:aspect-[21/9]">
            <Image
              src="/images/hero.webp"
              alt="Kou Nagai Studio hero visual"
              fill
              priority
              sizes="100vw"
              className="object-cover saturate-[0.9] contrast-[1.05] brightness-[0.92]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <div className="flex flex-col items-start gap-2 sm:gap-3">
                <Reveal
                  as="p"
                  className="text-sm font-medium leading-relaxed text-foreground sm:text-base sm:max-w-[44rem]"
                  delay={80}
                >
                  デザインの意図を、コードで「気持ち良い体験」へ。
                </Reveal>

                <Reveal
                  as="p"
                  className="text-xs tracking-[0.18em] text-foreground/75 sm:text-sm sm:max-w-[44rem]"
                  delay={140}
                >
                  Semantic HTML / Spacing &amp; Type / Secure Forms
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 見出し・本文は今まで通り container 幅 */}
      <header className="mt-8 text-center sm:mt-10">
        <Reveal as="p" className="kns-section-label" delay={160}>
          Studio / Portfolio / Blog
        </Reveal>

        <TypeInText
          as="h1"
          text="Kou Nagai Studio"
          className="mt-4 text-4xl font-light tracking-[0.08em] text-foreground sm:text-5xl"
          delay={220}
          stagger={28}
          caret={false}
        />

        {/* ✅ 本文も TypeInText に */}
        <TypeInText
          as="p"
          text="セマンティックなHTMLと整った余白・タイポで、意図を崩さず実装します。ここでは制作のメモと学びを記録します。"
          className="mx-auto mt-4 max-w-2xl kns-body text-left"
          delay={420}     // H1 の後に少し間を置く
          stagger={14}    // 長文なので速め（10〜14 推奨）
          caret={false}   // 長文は caret 無しが上品
        />
      </header>
    </section>
  );
}
