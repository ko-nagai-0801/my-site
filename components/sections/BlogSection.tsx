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

        <Reveal as="div" className="mt-6 flex justify-center" delay={120}>
          <Link href="/blog" className="nav-link">
            View all
          </Link>
        </Reveal>
      </header>

      {/* ✅ children optional になったので self-closing OK */}
      <Reveal as="div" className="mt-10 hairline" delay={160} />

      <div className="mt-6">
        <PostsList posts={posts} variant="latest" linkMode="title" />
      </div>
    </section>
  );
}
