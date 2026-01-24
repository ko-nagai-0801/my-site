/* app/not-found.tsx */
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-20">
      <p className="text-xs tracking-[0.22em] uppercase text-muted">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Not Found</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        ページが見つかりませんでした。URLが変更されたか、削除された可能性があります。
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/"
          className="rounded-xl border border-border bg-panel px-4 py-2 text-sm hover:bg-foreground/5"
        >
          Homeへ戻る
        </Link>
        <Link
          href="/works"
          className="rounded-xl border border-border bg-panel px-4 py-2 text-sm hover:bg-foreground/5"
        >
          Worksを見る
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-border bg-panel px-4 py-2 text-sm hover:bg-foreground/5"
        >
          Blogを見る
        </Link>
      </div>
    </main>
  );
}
