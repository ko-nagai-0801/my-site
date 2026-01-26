/* components/sections/WorksSection.tsx */
import Link from "next/link";
import { WorksGrid, type WorkLike } from "@/components/works/WorksGrid";

type Props = {
  works: WorkLike[];
};

export function WorksSection({ works }: Props) {
  return (
    <section className="mt-14">
      <header className="text-center">
        <h2 className="kns-section-title">Works</h2>

        <div className="mt-6 flex justify-center">
          <Link href="/works" className="nav-link">
            View all
          </Link>
        </div>
      </header>

      <div className="mt-10 hairline" />

      <div className="mt-8">
        <WorksGrid works={works} />
      </div>
    </section>
  );
}
