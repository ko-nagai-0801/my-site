/* lib/works.ts */
export type Work = {
  title: string;
  summary: string;
  tags: string[];
  href?: string; // 公開URLなど（外部）
  repo?: string; // GitHubなど（外部）
  note?: string; // 補足（任意）
};

export const works: Work[] = [
  {
    title: "My Site（Next.js + MDX）",
    summary:
      "ダーク基調のUI、MDX記事、ブログ一覧・詳細、タイポグラフィ、モバイルヘッダー挙動を整備。",
    tags: ["Next.js", "App Router", "MDX", "Tailwind", "Typography"],
    repo: "https://github.com/ko-nagai-0801",
    note: "現在も継続改善中。トークン設計で dark/light の雰囲気を統一。",
  },
  {
    title: "静的サイト / LP コーディング（サンプル）",
    summary:
      "セマンティックHTML + 余白とタイポを整えて、意図を崩さず実装するスタイルの雛形。",
    tags: ["HTML", "CSS", "JavaScript", "A11y"],
    href: "https://example.com",
  },
  {
    title: "フォーム実装（セキュリティ重視）",
    summary:
      "CSRF / バリデーション / ハニーポット等を含めた、運用を意識したフォーム構成のテンプレ。",
    tags: ["PHP", "Security", "CSRF", "Validation"],
  },
];
