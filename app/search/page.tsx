/* app/search/page.tsx */
import type { Metadata } from "next";
import { getAllPostLikes } from "@/lib/posts";
import { getAllWorks } from "@/lib/works";
import SearchClient from "./SearchClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Search",
  description: "Blog / Works を横断して検索します（簡易：クライアント側）",
};

type PostLite = {
  slug: string;
  meta: {
    title: string;
    date: string;
    description?: string;
    tags?: string[];
  };
};

type WorkLite = {
  slug: string;
  meta: {
    title: string;
    summary: string;
    href?: string;
    tags?: string[];
  };
};

type PageProps = {
  searchParams?: { q?: string };
};

export default async function SearchPage({ searchParams }: PageProps) {
  const [postsAll, worksAll] = await Promise.all([getAllPostLikes(), getAllWorks()]);

  // ✅ client へ渡す用に「必要最小限でシリアライズ可能」な形に整形
  const posts: PostLite[] = postsAll.map((p) => ({
    slug: p.slug,
    meta: {
      title: p.meta.title,
      date: p.meta.date,
      description: p.meta.description ?? "",
      tags: p.meta.tags ?? [],
    },
  }));

  const works: WorkLite[] = worksAll.map((w) => ({
    slug: w.slug,
    meta: {
      title: w.meta.title,
      summary: w.meta.summary,
      href: w.meta.href,
      tags: w.meta.tags ?? [],
    },
  }));

  const initialQuery = (searchParams?.q ?? "").toString();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="mt-2 text-sm opacity-80">
          Blog / Works を横断して検索します（まずはクライアント側の簡易検索）。
        </p>
      </header>

      <SearchClient posts={posts} works={works} initialQuery={initialQuery} />
    </main>
  );
}
