/* app/layout.tsx */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { CursorStalker } from "@/components/ui/CursorStalker";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSiteUrl, isProduction } from "@/lib/site-url";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_OG_IMAGE_SET,
  SITE_TWITTER_IMAGES,
} from "@/lib/site-meta";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = getSiteUrl();
const prod = isProduction();
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: SITE_NAME,
    template: "%s | Kou Nagai Studio",
  },
  description: SITE_DESCRIPTION,

  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
  },
  manifest: "/manifest.webmanifest",

  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: "website",
    images: [...SITE_OG_IMAGE_SET],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [...SITE_TWITTER_IMAGES],
  },

  robots: prod ? { index: true, follow: true } : { index: false, follow: false },
};

function HeaderFallback() {
  return (
    <header className="hairline sticky top-0 z-50 bg-background/90 sm:bg-background/80 sm:backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-[35px] w-[35px] rounded-md bg-border/60" aria-hidden="true" />
          <div className="leading-none">
            <div className="h-4 w-44 rounded bg-border/60" aria-hidden="true" />
            <div className="mt-2 h-3 w-16 rounded bg-border/40" aria-hidden="true" />
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="h-9 w-56 rounded-full border border-border opacity-40" aria-hidden="true" />
        </div>

        <div className="sm:hidden h-10 w-10 rounded-md border border-border opacity-40" aria-hidden="true" />
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-clip`}>
        <CursorStalker />

        <Suspense fallback={<HeaderFallback />}>
          <SiteHeader />
        </Suspense>

        {children}

        <SiteFooter />

        {prod && GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
