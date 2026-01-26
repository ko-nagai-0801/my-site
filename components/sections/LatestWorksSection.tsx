/* components/sections/LatestWorksSection.tsx */
import Link from "next/link";
import { WorksGrid, type WorkLike } from "@/components/works/WorksGrid";

export function LatestWorksSection({ works }: { works: WorkLike[] }) {
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-6">
        <h2 className="kns-item-title">Latest Works</h2>

        <Link href="/works" className="nav-link">
          View all
        </Link>
      </div>

      <div className="mt-4 hairline" />

      <div className="mt-8">
        <WorksGrid works={works} />
      </div>
    </section>
  );
}
