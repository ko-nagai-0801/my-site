import Link from "next/link";
import { getLatestPosts } from "@/lib/posts";


export default async function Home() {
  const latest = await getLatestPosts(3);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {/* 既存の内容があるならここに残す */}

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold">最新記事</h2>
          <Link href="/blog" className="text-sm underline opacity-80">
            すべて見る
          </Link>
        </div>

        <ul className="mt-6 space-y-4">
          {latest.map((p) => (
            <li key={p.slug} className="rounded-lg border border-white/10 p-4">
              <Link className="text-lg underline" href={`/blog/${p.slug}`}>
                {p.meta.title}
              </Link>
              <div className="mt-1 text-sm opacity-70">{p.meta.date}</div>
              {p.meta.description && <p className="mt-2">{p.meta.description}</p>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
