// components/SiteFooter.tsx
import Link from "next/link";

// const nav = [
//   { href: "/", label: "Home" },
//   { href: "/blog", label: "Blog" },
//   { href: "/about", label: "About" },
//   { href: "/works", label: "Works" },
// ];

const links = [
  // 必要ならここに追加（例：GitHub, X, Email）
  { href: "https://github.com/xxxx", label: "GitHub", external: true },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-background/40">
      <div className="container py-12 sm:py-14">
        {/* Top row */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
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

            {links.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm">
                {links.map((l) => (
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
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10">
          <div className="hairline" />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs tracking-[0.18em] text-muted">
              © {year} Kou Nagai Studio
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
