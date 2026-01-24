// app/manifest.ts
import type { MetadataRoute } from "next";

// manifest は頻繁に変わらないので静的扱いでもOK
export const revalidate = 86400;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kou Nagai Studio",
    short_name: "Kou Studio",
    description: "Portfolio & blog built with Next.js + MDX.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0b0f",
    theme_color: "#0b0b0f",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
