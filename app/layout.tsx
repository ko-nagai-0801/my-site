// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Site",
  description: "Portfolio & Blog",
};

function Header() {
  return (
    <header className="hairline sticky top-0 z-50 bg-background/80 backdrop-blur">
      {/* top bar */}
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.28em] uppercase text-foreground/90 hover:text-foreground"
        >
          MY SITE
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8" aria-label="Primary">
          <Link className="nav-link" href="/">
            Home
          </Link>
          <Link className="nav-link" href="/blog">
            Blog
          </Link>
          <Link className="nav-link" href="/about">
            About
          </Link>
          <Link className="nav-link" href="/works">
            Works
          </Link>
        </nav>
      </div>

      {/* Mobile grid nav（参考サイト風：2×2） */}
      <nav
        className="sm:hidden border-t border-border"
        aria-label="Primary mobile"
      >
        <ul className="grid grid-cols-2">
          <li className="border-b border-r border-border">
            <Link
              href="/about"
              className="block py-4 text-center text-sm tracking-[0.12em] text-muted hover:text-foreground"
            >
              About
            </Link>
          </li>

          <li className="border-b border-border">
            <Link
              href="/"
              className="block py-4 text-center text-sm tracking-[0.12em] text-muted hover:text-foreground"
            >
              Home
            </Link>
          </li>

          <li className="border-r border-border">
            <Link
              href="/blog"
              className="block py-4 text-center text-sm tracking-[0.12em] text-muted hover:text-foreground"
            >
              Blog
            </Link>
          </li>

          {/* 4枠目：将来用（Contact/Worksなど）。無ければ “Works” としてダミーにしてもOK */}
          <li>
            <Link
              href="/"
              className="block py-4 text-center text-sm tracking-[0.12em] text-muted hover:text-foreground"
            >
              Works
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
