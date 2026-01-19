import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Site",
  description: "Portfolio & Blog",
};

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur">
      {/* main row */}
      <div className="hairline">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.24em] uppercase"
          >
            My Site
          </Link>

          <nav className="flex items-center gap-6">
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/blog">
              Blog
            </Link>
            <Link className="nav-link" href="/about">
              About
            </Link>
          </nav>
        </div>
      </div>

      {/* subcopy row (JP/EN in one line) */}
      <div className="hairline">
        <div className="container py-2">
          <p className="text-[11px] leading-relaxed tracking-[0.18em] text-foreground/55">
            余白・タイポ・情報設計を整える / Spacing, Typography & Information Design
          </p>
        </div>
      </div>
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
