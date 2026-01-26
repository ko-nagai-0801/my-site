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
    console.error(error);
  }, [error]);

  return (
    <main className="container py-20">
      <p className="kns-page-kicker">Error</p>
      <h1 className="mt-3 kns-page-title">予期しないエラーが発生しました</h1>
      <p className="mt-4 kns-lead">
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
