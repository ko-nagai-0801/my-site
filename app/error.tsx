/* app/error.tsx */
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 必要ならここでログ送信など
    console.error(error);
  }, [error]);

  return (
    <main className="container py-20">
      <p className="text-xs tracking-[0.22em] uppercase text-muted">Error</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        予期しないエラーが発生しました
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        もう一度お試しください。改善が必要な場合は後ほど修正します。
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          onClick={reset}
          className="rounded-xl border border-border bg-panel px-4 py-2 text-sm hover:bg-foreground/5"
        >
          再読み込み
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border bg-panel px-4 py-2 text-sm hover:bg-foreground/5"
        >
          Homeへ戻る
        </Link>
      </div>
    </main>
  );
}
