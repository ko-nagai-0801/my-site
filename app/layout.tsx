/* app/layout.tsx */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// 本番URLを優先（Vercelなら NEXT_PUBLIC_SITE_URL を設定しておくのが安定）
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Kou Nagai Studio",
    template: "%s | Kou Nagai Studio",
  },
  description: "Portfolio & Blog",

  alternates: {
    canonical: "/",
  },

  // favicon / icon / manifest（全部 public 直下に置く前提）
  icons: {
    icon: [
      { url: "/favicon.ico" }, // まずはこれだけでもOK
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/icon.png" }],
  },
  manifest: "/manifest.webmanifest",

  openGraph: {
    title: "Kou Nagai Studio",
    description: "Portfolio & Blog",
    url: "/",
    siteName: "Kou Nagai Studio",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/og-kou-nagai-studio-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Kou Nagai Studio",
      },
      // 任意：高解像度も並べておく（無くてもOK）
      {
        url: "/og-kou-nagai-studio-2400x1260.png",
        width: 2400,
        height: 1260,
        alt: "Kou Nagai Studio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kou Nagai Studio",
    description: "Portfolio & Blog",
    images: ["/og-kou-nagai-studio-1200x630.png"],
  },

  // robots.txt を置くなら必須ではないが、メタでも明示しておくと安心
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
