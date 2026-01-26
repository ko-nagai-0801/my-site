/* components/sections/BlogSection.tsx */
import Link from "next/link";
import { PostsList, type PostLike } from "@/components/blog/PostsList";

type Props = {
  posts: PostLike[];
};

export function BlogSection({ posts }: Props) {
  return (
    <section className="mt-14">
      <header className="text-center">
        <h2 className="kns-section-title">Blog</h2>

        <div className="mt-6 flex justify-center">
          <Link href="/blog" className="nav-link">
            View all
          </Link>
        </div>
      </header>

      <div className="mt-10 hairline" />

      <div className="mt-6">
        <PostsList posts={posts} variant="latest" linkMode="title" />
      </div>
    </section>
  );
}
