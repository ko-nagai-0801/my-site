// components/SiteFooter.tsx
import type { ElementType } from "react";
import { SiGithub, SiQiita, SiX } from "@icons-pack/react-simple-icons";

const NoteMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" role="img" aria-label="Note" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <path
      d="M8 16V8h1.6l4.8 6V8H16v8h-1.6l-4.8-6v6H8z"
      fill="currentColor"
    />
  </svg>
);

const socialLinks = [
  { href: "https://x.com/k_n_8141", label: "X", Icon: SiX },
  { href: "https://github.com/ko-nagai-0801", label: "GitHub", Icon: SiGithub },
  { href: "https://note.com/gapsmilegeek", label: "Note", Icon: NoteMark },
  { href: "https://qiita.com/ko_nagai_0801", label: "Qiita", Icon: SiQiita },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  Icon: ElementType;
}>;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-background/40">
      <div className="container py-12 sm:py-14">
        <div className="flex flex-col gap-10">
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-[0.28em] uppercase text-foreground/90">
              Kou Nagai Studio
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.22em] uppercase text-muted">
              Contact
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              {socialLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link inline-flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-base hover:bg-panel/60"
                  >
                    <l.Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="leading-none">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* 余白が欲しければここに注記なども置けます */}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      <div className="container py-6">
        <p className="text-center text-xs tracking-[0.18em] text-muted">
          © {year} Kou Nagai Studio
        </p>
      </div>
    </footer>
  );
}
