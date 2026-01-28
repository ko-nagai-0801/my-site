/* components/sections/BlogSection.tsx */
import Link from "next/link";
import { PostsList, type PostLike } from "@/components/blog/PostsList";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  posts: PostLike[];
};

export function BlogSection({ posts }: Props) {
  return (
    <section className="mt-14">
      <header className="text-center">
        <Reveal as="h2" className="kns-section-title" delay={60}>
          Blog
        </Reveal>
      </header>

      {/* ✅  区切り線 */}
      <Reveal as="div" className="mt-10 hairline" delay={160} />

      {/* ✅ コンテンツ（リスト/カード） */}
      <div className="mt-10">
        <PostsList posts={posts} variant="latest" linkMode="title" />
      </div>

      <Reveal as="div" className="mt-6 flex justify-end" delay={220}>
        <Link href="/blog" className="kns-btn-ghost">
          <span>View all</span>
          <span aria-hidden="true">→</span>
        </Link>
      </Reveal>

        {/* ✅  区切り線 */}
        <Reveal as="div" className="mt-10 hairline" delay={160} />
    </section>
  );
}
