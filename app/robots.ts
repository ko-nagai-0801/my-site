// app/robots.ts
import type { MetadataRoute } from "next";

function getSiteUrl() {
  const fromPublic = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromPublic) return fromPublic.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

// ✅ 数値リテラルで（式は使わない）
export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
