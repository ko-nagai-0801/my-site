/* components/sections/HeroLeadSection.tsx */
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export default function HeroLeadSection() {
  return (
    <section className="mt-14">
      <header className="text-center">
        <Reveal as="p" className="kns-section-label" delay={60}>
          Approach
        </Reveal>

        <Reveal as="h2" className="mt-4 kns-item-title kns-underline" delay={120}>
          デザインを、しっかり”カタチ”に
        </Reveal>

        <Reveal as="p" className="mx-auto mt-3 max-w-2xl kns-body text-left" delay={180}>
          余白・視線誘導・読みやすさ。設計の意図を崩さず、コードで体験の精度を上げます。
        </Reveal>
      </header>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-panel p-6 sm:p-8">
        <Reveal as="h3" className="text-sm font-semibold tracking-[0.16em] text-foreground/80" delay={120}>
          What I care about
        </Reveal>

        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/90">
          <Reveal as="li" className="flex gap-2" delay={160}>
            <span className="mt-[0.2em] h-2 w-2 shrink-0 rounded-full bg-foreground/60" />
            <span>読みやすいタイポと、崩れにくい余白設計</span>
          </Reveal>
          <Reveal as="li" className="flex gap-2" delay={200}>
            <span className="mt-[0.2em] h-2 w-2 shrink-0 rounded-full bg-foreground/60" />
            <span>Semantic HTML + a11y を“当たり前”に</span>
          </Reveal>
          <Reveal as="li" className="flex gap-2" delay={240}>
            <span className="mt-[0.2em] h-2 w-2 shrink-0 rounded-full bg-foreground/60" />
            <span>フォームやデータ周りは“安全側”で実装</span>
          </Reveal>
        </ul>

        <Reveal as="div" className="mt-6 flex flex-wrap gap-3" delay={280}>
          <Link href="/works" className="nav-link">
            View works
          </Link>
          <Link href="/blog" className="nav-link">
            Read blog
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
