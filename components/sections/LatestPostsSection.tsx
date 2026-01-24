/* components/sections/LatestPostsSection.tsx */
import Link from "next/link";
import { PostsList, type PostLike } from "@/components/blog/PostsList";

export type LatestPost = PostLike;

export function LatestPostsSection({ posts }: { posts: LatestPost[] }) {
  return (
    <section className="mt-14">
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="text-sm tracking-[0.22em] uppercase text-muted">
          Latest Posts
        </h2>
        <Link href="/blog" className="nav-link">
          View all
        </Link>
      </div>

      <div className="mt-4 hairline" />

      <div className="mt-6">
        <PostsList posts={posts} variant="latest" linkMode="title" />
      </div>
    </section>
  );
}
