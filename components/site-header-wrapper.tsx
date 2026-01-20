// components/site-header-wrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";

export default function SiteHeaderWrapper() {
  const pathname = usePathname();
  // ルートが変わるたびに Header を再マウントして state を初期化（=メニュー表示）
  return <SiteHeader key={pathname} />;
}
