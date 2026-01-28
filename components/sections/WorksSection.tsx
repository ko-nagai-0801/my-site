/* components/sections/WorksSection.tsx */
import Link from "next/link";
import { WorksGrid, type WorkLike } from "@/components/works/WorksGrid";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  works: WorkLike[];
};

export function WorksSection({ works }: Props) {
  return (
    <section className="mt-14">
      <header>
        {/* 1段目：タイトルは常に中央 */}
        <div className="text-center">
          <Reveal as="h2" className="kns-section-title" delay={60}>
            Works
          </Reveal>
        </div>

        {/* 2段目：右端にView all（同じ幅の中で右寄せ） */}
        <Reveal as="div" className="mt-6 flex justify-end" delay={120}>
          <Link href="/works" className="kns-btn-ghost">
            <span>View all</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </header>

      {/* ✅ children optional になったので self-closing OK */}
      <Reveal as="div" className="mt-10 hairline" delay={160} />

      <div className="mt-6">
        <WorksGrid works={works} />
      </div>
    </section>
  );
}
