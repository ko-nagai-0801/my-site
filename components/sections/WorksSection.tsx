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
      <header className="text-center">
        <Reveal as="h2" className="kns-section-title" delay={60}>
          Works
        </Reveal>
      </header>

      {/* ✅  区切り線 */}
      <Reveal as="div" className="mt-10 hairline" delay={160} />

      {/* ✅ コンテンツ（カード） */}
      <div className="mt-10">
        <WorksGrid works={works} />
      </div>

      <Reveal as="div" className="mt-6 flex justify-end" delay={220}>
        <Link href="/works" className="kns-btn-ghost">
          <span>View all</span>
          <span aria-hidden="true">→</span>
        </Link>
      </Reveal>

      {/* ✅  区切り線 */}
      <Reveal as="div" className="mt-10 hairline" delay={160} />
    </section>
  );
}
