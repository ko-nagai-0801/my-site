// components/SiteFooter.tsx
import Link from "next/link";

const socialLinks = [
  { href: "https://x.com/k_n_8141", label: "X" },
  { href: "https://github.com/ko-nagai-0801", label: "GitHub" },
  { href: "https://note.com/gapsmilegeek", label: "note" },
  { href: "https://qiita.com/ko_nagai_0801", label: "Qiita" },
] as const;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-background/40">
      {/* 上段：常に縦並び */}
      <div className="container py-12 sm:py-14">
        <div className="flex flex-col gap-10">
          {/* Brand */}
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-[0.28em] uppercase text-foreground/90">
              Kou Nagai Studio
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              セマンティックなHTMLと整った余白・タイポで、意図を崩さず実装します。
            </p>
          </div>

          {/* Contact / Links */}
          <div className="min-w-0">
            <p className="text-xs tracking-[0.22em] uppercase text-muted">
              Contact
            </p>
            <p className="mt-3 text-sm text-muted">
              まずは{" "}
              <Link href="/about" className="underline underline-offset-4">
                About
              </Link>{" "}
              からご確認ください。
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              {socialLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 区切り線：画面幅いっぱい */}
      <div className="h-px w-full bg-border" />

      {/* 下段：コピーライト中央寄せ */}
      <div className="container py-6">
        <p className="text-center text-xs tracking-[0.18em] text-muted">
          © {year} Kou Nagai Studio
        </p>
      </div>
    </footer>
  );
}

