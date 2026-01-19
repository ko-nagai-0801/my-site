import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Link href="/" className="text-sm underline opacity-80">
          トップへ
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-6 opacity-70">記事がまだありません。</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-xl border border-white/10 p-5 transition hover:border-white/20 hover:bg-white/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold underline decoration-white/20 underline-offset-4 group-hover:decoration-white/50">
                    {p.meta.title}
                  </h2>
                  <span className="shrink-0 text-sm opacity-70">{p.meta.date}</span>
                </div>

                {p.meta.description && <p className="mt-2 opacity-80">{p.meta.description}</p>}

                {p.meta.tags && p.meta.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs opacity-80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 text-sm underline opacity-70">記事を読む →</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
