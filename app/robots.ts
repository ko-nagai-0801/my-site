// app/robots.ts
import type { MetadataRoute } from "next";
import { getSiteUrl, isProduction } from "@/lib/site-url";

// ✅ 数値リテラルで（式は使わない）
export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = getSiteUrl();

  // Preview/Dev をインデックスさせたくない場合（任意）
  if (!isProduction()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
