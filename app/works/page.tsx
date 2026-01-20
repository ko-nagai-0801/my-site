// app/works/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Works | My Site",
  description: "制作実績 / 作業ログ / サンプルの一覧",
};

type Work = {
  title: string;
  summary: string;
  tags: string[];
  href?: string; // 外部リンク（公開URLなど）
  repo?: string; // GitHubなど
  note?: string; // 補足（任意）
};

const works: Work[] = [
  {
    title: "My Site（Next.js + MDX）",
    summary:
      "ダーク基調のUI、MDX記事、ブログ一覧・詳細、タイポグラフィ、モバイルヘッダー挙動を整備。",
    tags: ["Next.js", "App Router", "MDX", "Tailwind", "Typography"],
    repo: "https://github.com/ko-nagai-0801", // 必要ならリポを指定
    note: "現在も継続改善中。トークン設計で dark/light の雰囲気を統一。",
  },
  {
    title: "静的サイト / LP コーディング（サンプル）",
    summary:
      "セマンティックHTML + 余白とタイポを整えて、意図を崩さず実装するスタイルの雛形。",
    tags: ["HTML", "CSS", "JavaScript", "A11y"],
    href: "https://example.com", // 公開URLができたら差し替え
  },
  {
    title: "フォーム実装（セキュリティ重視）",
    summary:
      "CSRF / バリデーション / ハニーポット等を含めた、運用を意識したフォーム構成のテンプレ。",
    tags: ["PHP", "Security", "CSRF", "Validation"],
  },
];

function ExternalLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4"
    >
      {label}
    </a>
  );
}

export default function WorksPage() {
  return (
    <main className="container py-14">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-muted">
            Portfolio
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Works</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            制作物・サンプル・作業ログの一覧です。必要に応じて、公開URL / リポジトリを追加していきます。
          </p>
        </div>

        <Link
          href="/"
          className="text-xs tracking-[0.22em] uppercase text-muted hover:text-foreground"
        >
          Home
        </Link>
      </header>

      <div className="mt-10 hairline" />

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {works.map((w) => (
          <li
            key={w.title}
            className="rounded-2xl border border-border bg-panel p-6 transition hover:border-foreground/15"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-medium tracking-tight">
                {w.title}
              </h2>

              <span className="shrink-0 text-xs tracking-[0.18em] text-muted">
                {/* 将来 日付/種別 を入れるならここ */}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              {w.summary}
            </p>

            {w.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {w.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {(w.href || w.repo || w.note) && (
              <div className="mt-5 space-y-2">
                {(w.href || w.repo) && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-[0.16em] text-muted">
                    {w.href && (
                      <ExternalLink href={w.href} label="Open site →" />
                    )}
                    {w.repo && (
                      <ExternalLink href={w.repo} label="Repository →" />
                    )}
                  </div>
                )}

                {w.note && (
                  <p className="text-xs leading-relaxed text-muted">
                    {w.note}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-10 text-xs leading-relaxed tracking-[0.16em] text-muted">
        ※ 今後「カテゴリ」「年別」「公開URLの有無」などで絞り込みが必要なら、UIを増やしていきます。
      </p>
    </main>
  );
}
