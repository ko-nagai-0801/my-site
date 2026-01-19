import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between p-6">
        <Link href="/" className="font-semibold tracking-tight">
          My Site
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link className="underline opacity-80 hover:opacity-100" href="/">
            Home
          </Link>
          <Link className="underline opacity-80 hover:opacity-100" href="/blog">
            Blog
          </Link>
          <Link
            className="underline opacity-80 hover:opacity-100"
            href="/about"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
