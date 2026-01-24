/* app/layout.tsx */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 絶対URL化（OGP画像などで推奨）
  metadataBase: new URL("https://my-site-five-flame.vercel.app"),

  title: {
    default: "Kou Nagai Studio",
    template: "%s | Kou Nagai Studio",
  },
  description: "Portfolio & Blog",

  // canonical（最小構成）
  alternates: {
    canonical: "/",
  },

  // OGP
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
      // 任意：高解像度も登録（対応クローラ向け）
      {
        url: "/og-kou-nagai-studio-2400x1260.png",
        width: 2400,
        height: 1260,
        alt: "Kou Nagai Studio",
      },
    ],
  },

  // X(Twitter)
  twitter: {
    card: "summary_large_image",
    title: "Kou Nagai Studio",
    description: "Portfolio & Blog",
    images: ["/og-kou-nagai-studio-1200x630.png"],
  },

  // 置く予定のファイル（存在しなくてもビルドは通るが、最終的には配置推奨）
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },

  manifest: "/manifest.webmanifest",
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
