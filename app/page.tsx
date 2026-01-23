/* app/page.tsx */
import { getLatestPosts } from "@/lib/posts";
import { ServiceSection } from "@/components/sections/ServiceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { LatestPostsSection } from "@/components/sections/LatestPostsSection";

export default async function Home() {
  const latest = await getLatestPosts(3);

  return (
    <main className="container py-14">
      <HeroSection />

      <ServiceSection />

      <LatestPostsSection posts={latest} />
    </main>
  );
}
