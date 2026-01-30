/* lib/site-meta.ts */
export const SITE_NAME = "Kou Nagai Studio";
export const SITE_DESCRIPTION = "Studio / Portfolio / Blog";
export const SITE_LOCALE = "ja_JP";

export const DEFAULT_OG_IMAGES = [
  {
    url: "/og-kns-1200x630.png",
    width: 1200,
    height: 630,
    alt: SITE_NAME,
  },
  {
    url: "/og-kns-2400x1260.png",
    width: 2400,
    height: 1260,
    alt: SITE_NAME,
  },
] as const;

export const DEFAULT_TWITTER_IMAGES = [DEFAULT_OG_IMAGES[0].url] as const;
