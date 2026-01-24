/* app/global-error.tsx */
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body>
        <main style={{ padding: "40px", maxWidth: 960, margin: "0 auto" }}>
          <h1>Global Error</h1>
          <p>予期しないエラーが発生しました。</p>
          <button onClick={reset}>再読み込み</button>
          <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
            {String(error)}
          </pre>
        </main>
      </body>
    </html>
  );
}
