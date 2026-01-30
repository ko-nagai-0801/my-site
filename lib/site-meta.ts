/* lib/site-meta.ts */
export const SITE_NAME = "Kou Nagai Studio";
export const SITE_DESCRIPTION = "Studio / Portfolio / Blog";
export const SITE_LOCALE = "ja_JP";

/**
 * ✅ サイト既定のOGP画像（幅/高さ付き：layout の openGraph 用）
 * - ここを単一ソースにして、Blog/Works/OGPフォールバックで共通利用する
 */
export const SITE_OG_IMAGE_SET = [
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

/**
 * ✅ 記事/作品詳細など「OGP images（url/alt）」だけ欲しいケース向け
 */
export const SITE_OG_IMAGES: Array<{ url: string; alt: string }> = SITE_OG_IMAGE_SET.map(
  ({ url, alt }) => ({ url, alt })
);

/**
 * ✅ Twitter用（1枚でOK運用）
 */
export const SITE_TWITTER_IMAGES: string[] = [SITE_OG_IMAGE_SET[0].url];
