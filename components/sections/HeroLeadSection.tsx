/* components/sections/HeroLeadSection.tsx */
import Link from "next/link";

export default function HeroLeadSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="grid gap-6 sm:grid-cols-[1.2fr_0.8fr] sm:items-start">
          {/* Copy */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              静かなデザインに、強い実装。
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              デザイン意図を崩さず、コーディングでサイトの完成度を引き上げます。
              WordPress / LP / HP の制作から、既存サイトの改修・バグフィクスまで幅広く対応します。
            </p>

            <ul className="mt-5 space-y-2 text-sm text-foreground/75">
              <li className="flex gap-2">
                <span
                  className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-border"
                  aria-hidden="true"
                />
                <span>
                  デザインデータを忠実にコーディング
                </span>
              </li>

              <li className="flex gap-2">
                <span
                  className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-border"
                  aria-hidden="true"
                />
                <span>WordPress改修（テーマ調整 / 表示崩れ / 軽微改善）</span>
              </li>

              <li className="flex gap-2">
                <span
                  className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-border"
                  aria-hidden="true"
                />
                <span>既存サイトの改修・バグ対応・運用しやすい形に整備</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="sm:pt-1">
            <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
              <p className="text-sm text-foreground/70">
                まずは制作物を見て、雰囲気や実装の方向性が合うか確認してください。
              </p>

              <div className="mt-4">
                <Link
                  href="/works"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm tracking-[0.08em] text-foreground/85 hover:text-foreground hover:opacity-90"
                >
                  Worksを見る
                </Link>
              </div>

              <p className="mt-3 text-xs text-foreground/55">
                ※ 相談導線（Contact）は、次の段階で追加できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
