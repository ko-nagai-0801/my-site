/* app/page.tsx */
import { getLatestPosts } from "@/lib/posts";
import { getAllWorks } from "@/lib/works";

import { HeroSection } from "@/components/sections/HeroSection";
import HeroLeadSection from "@/components/sections/HeroLeadSection";
import { ServiceSection } from "@/components/sections/ServiceSection";
import { WorksSection } from "@/components/sections/WorksSection";
import { BlogSection } from "@/components/sections/BlogSection";

export default async function Home() {
  const [latest, worksAll] = await Promise.all([getLatestPosts(3), getAllWorks()]);

  // ✅ order がある前提で getAllWorks 側でソートされている想定。
  // 念のため先頭3件だけ。
  const latestWorks = worksAll.slice(0, 3);

  return (
    <main className="container py-14">
      <HeroSection />

      <HeroLeadSection />

      <ServiceSection />

      <WorksSection works={latestWorks} />

      <BlogSection posts={latest} />
    </main>
  );
}
