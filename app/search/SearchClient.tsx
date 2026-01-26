/* app/search/SearchClient.tsx */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

type Props = {
  posts: PostLite[];
  works: WorkLite[];
  initialQuery: string;
};

type Mode = "all" | "blog" | "works";

const formatDateYMD = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

const normalize = (s: string) => s.trim().toLowerCase();

const includesQuery = (haystack: string, q: string) => normalize(haystack).includes(q);

export default function SearchClient({ posts, works, initialQuery }: Props) {
  const router = useRouter();

  const [q, setQ] = useState(initialQuery ?? "");
  const [mode, setMode] = useState<Mode>("all");

  const query = normalize(q);

  // ✅ /search?q= を直叩き or 戻る/進む等でURLが変わった時、入力に追従
  // （setState同期警告回避のため rAF）
  useEffect(() => {
    const next = initialQuery ?? "";
    const id = window.requestAnimationFrame(() => setQ(next));
    return () => window.cancelAnimationFrame(id);
  }, [initialQuery]);

  const goSearch = (raw: string) => {
    const next = raw.trim();
    if (!next) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(next)}`);
  };

  // IME確定前Enter対策（any禁止に対応）
  const isImeComposing = (e: React.SyntheticEvent) => {
    const ne = e.nativeEvent;
    // ReactのSyntheticEventはnativeEvent型が広いので、必要なプロパティだけ安全に参照
    const composing = "isComposing" in ne ? Boolean((ne as Event & { isComposing?: boolean }).isComposing) : false;
    const keyCode =
      "keyCode" in ne ? Number((ne as Event & { keyCode?: number }).keyCode ?? 0) : 0;
    return composing || keyCode === 229;
  };

  const filtered = useMemo(() => {
    const matchPost = (p: PostLite) => {
      if (!query) return true;
      const blob = [
        p.meta.title,
        p.meta.description ?? "",
        (p.meta.tags ?? []).join(" "),
        formatDateYMD(p.meta.date),
      ].join(" ");
      return includesQuery(blob, query);
    };

    const matchWork = (w: WorkLite) => {
      if (!query) return true;
      const blob = [w.meta.title, w.meta.summary, (w.meta.tags ?? []).join(" ")].join(" ");
      return includesQuery(blob, query);
    };

    const postsHit = posts.filter(matchPost);
    const worksHit = works.filter(matchWork);

    return { postsHit, worksHit };
  }, [posts, works, query]);

  const showPosts = mode === "all" || mode === "blog";
  const showWorks = mode === "all" || mode === "works";

  const total =
    (showPosts ? filtered.postsHit.length : 0) + (showWorks ? filtered.worksHit.length : 0);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("all")}
              className={`rounded-full border px-3 py-1 text-sm hover:opacity-80 ${
                mode === "all" ? "font-semibold" : "opacity-80"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setMode("blog")}
              className={`rounded-full border px-3 py-1 text-sm hover:opacity-80 ${
                mode === "blog" ? "font-semibold" : "opacity-80"
              }`}
            >
              Blog
            </button>
            <button
              type="button"
              onClick={() => setMode("works")}
              className={`rounded-full border px-3 py-1 text-sm hover:opacity-80 ${
                mode === "works" ? "font-semibold" : "opacity-80"
              }`}
            >
              Works
            </button>
          </div>

          <p className="text-sm opacity-80">
            {q ? (
              <>
                <span className="font-semibold">{total}</span> 件ヒット
              </>
            ) : (
              <>検索ワードを入力してください</>
            )}
          </p>
        </div>

        {/* ✅ EnterでURL更新（/search?q=...）。空欄Enterは/searchへ */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (isImeComposing(e)) return;
            goSearch(q);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (isImeComposing(e)) e.preventDefault();
            }}
            placeholder="例）mdx / bootstrap / lunchette ..."
            className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-0"
          />
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                router.push("/search");
              }}
              className="rounded-lg border px-3 py-2 text-sm hover:opacity-80"
            >
              Clear
            </button>
          ) : null}
        </form>

        <p className="text-xs opacity-70">
          ※ これは簡易検索（クライアント側）です。将来的にサーバー検索へ拡張できます。
        </p>
      </section>

      {showPosts ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Blog</h2>

          {filtered.postsHit.length === 0 ? (
            <p className="text-sm opacity-80">該当するブログ記事はありません。</p>
          ) : (
            <ul className="space-y-4">
              {filtered.postsHit.map((p) => (
                <li key={p.slug} className="rounded-lg border p-4">
                  <p className="text-xs opacity-70">{formatDateYMD(p.meta.date)}</p>

                  <Link
                    href={`/blog/${p.slug}`}
                    className="mt-1 block text-lg font-semibold hover:underline underline-offset-4"
                  >
                    {p.meta.title}
                  </Link>

                  {p.meta.description ? (
                    <p className="mt-2 text-sm opacity-80">{p.meta.description}</p>
                  ) : null}

                  {(p.meta.tags ?? []).length ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {(p.meta.tags ?? []).map((t) => (
                        <li key={`${p.slug}-${t}`}>
                          <Link
                            href={`/tags/${encodeURIComponent(t.trim())}`}
                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs hover:opacity-80"
                          >
                            {t}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {showWorks ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Works</h2>

          {filtered.worksHit.length === 0 ? (
            <p className="text-sm opacity-80">該当する作品はありません。</p>
          ) : (
            <ul className="space-y-4">
              {filtered.worksHit.map((w) => (
                <li key={w.slug} className="rounded-lg border p-4">
                  <Link
                    href={`/works/${w.slug}`}
                    className="block text-lg font-semibold hover:underline underline-offset-4"
                  >
                    {w.meta.title}
                  </Link>

                  <p className="mt-2 text-sm opacity-80">{w.meta.summary}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/works/${w.slug}`}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-xs hover:opacity-80"
                    >
                      View
                    </Link>

                    {w.meta.href ? (
                      <a
                        href={w.meta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs hover:opacity-80"
                      >
                        Demo
                      </a>
                    ) : null}
                  </div>

                  {(w.meta.tags ?? []).length ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {(w.meta.tags ?? []).map((t) => (
                        <li key={`${w.slug}-${t}`}>
                          <Link
                            href={`/tags/${encodeURIComponent(t.trim())}`}
                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs hover:opacity-80"
                          >
                            {t}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
