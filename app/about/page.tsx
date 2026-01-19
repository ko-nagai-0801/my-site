import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | My Site",
  description: "プロフィール・できること・リンク集",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">About</h1>
        <Link href="/" className="text-sm underline opacity-80">
          トップへ
        </Link>
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">プロフィール</h2>
        <p className="opacity-80">
          ここに自己紹介文（例：Web制作 / Next.js / MDXブログ構築 など）を書きます。
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">できること</h2>
        <ul className="list-disc space-y-2 pl-5 opacity-80">
          <li>Next.js + MDX のブログ構築（記事追加・一覧・詳細）</li>
          <li>Tailwind CSS でのUI調整</li>
          <li>静的サイト/LPのコーディング</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">リンク</h2>
        <ul className="space-y-2">
          <li>
            <a
              className="underline opacity-80 hover:opacity-100"
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              X（後で差し替え）
            </a>
          </li>
          <li>
            <a
              className="underline opacity-80 hover:opacity-100"
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub（後で差し替え）
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
