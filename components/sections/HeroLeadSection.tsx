/* components/sections/HeroLeadSection.tsx */
import Link from "next/link";

export default function HeroLeadSection() {
  return (
    <section className="mt-14 border-t border-border/60 pt-10 sm:pt-14">
      <div className="flex flex-col items-center gap-6 text-left">
        {/* Copy */}
        <div className="max-w-2xl">
          <p className="kns-section-label">Approach</p>
          <h2 className="mt-3 kns-item-title">静かなデザインに、強い実装。</h2>

          <p className="mt-4 kns-body ">
            デザイン意図を崩さず、コーディングでサイトの完成度を引き上げます。
            WordPress / LP / HP の制作から、既存サイトの改修・バグフィクスまで幅広く対応します。
          </p>

          <ul className="mt-5 w-full space-y-2 kns-body text-left">
            <li className="flex gap-2">
              <span
                className="mt-[0.65rem] h-1 w-1 shrink-0 rounded-full bg-border"
                aria-hidden="true"
              />
              <span>デザインデータを忠実にコーディング</span>
            </li>

            <li className="flex gap-2">
              <span
                className="mt-[0.65rem] h-1 w-1 shrink-0 rounded-full bg-border"
                aria-hidden="true"
              />
              <span>WordPress改修（テーマ調整 / 表示崩れ / 軽微改善）</span>
            </li>

            <li className="flex gap-2">
              <span
                className="mt-[0.65rem] h-1 w-1 shrink-0 rounded-full bg-border"
                aria-hidden="true"
              />
              <span>既存サイトの改修・バグ対応・運用しやすい形に整備</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
            <p className="kns-body">
              まずは制作物を見て、雰囲気や実装の方向性が合うか確認してください。
            </p>

            <div className="mt-4">
              <Link
                href="/works"
                className="inline-flex w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm tracking-[0.08em] text-foreground/85 hover:text-foreground hover:opacity-90"
              >
                View Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
