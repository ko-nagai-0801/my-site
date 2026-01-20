/* components/SiteHeader.tsx */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const pathname = usePathname();

  const [isMobileHidden, setIsMobileHidden] = useState(false);

  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);

  // 「同一方向にどれだけ進んだか」を測るための起点
  const dirRef = useRef<"up" | "down" | null>(null);
  const dirStartYRef = useRef(0);

  // アニメ中（max-height 遷移中）は判定を止める
  const cooldownUntilRef = useRef(0);

  const tickingRef = useRef(false);

  const applyHidden = (next: boolean) => {
    hiddenRef.current = next;
    setIsMobileHidden(next);
  };

  // ルート遷移したらメニューは表示に戻す（同期setStateを避ける）
  useEffect(() => {
    if (typeof window === "undefined") return;

    const y = window.scrollY || 0;
    lastYRef.current = y;
    dirRef.current = null;
    dirStartYRef.current = y;

    if (!hiddenRef.current) return;

    const id = requestAnimationFrame(() => {
      if (hiddenRef.current) applyHidden(false);
    });

    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nowY = window.scrollY || 0;
    lastYRef.current = nowY;
    dirStartYRef.current = nowY;

    // ---- 調整ポイント（ここだけ触れば体感調整できます）----
    const TOP_THRESHOLD = 12; // ここ未満は常に表示
    const HIDE_DISTANCE = 36; // 下方向にこの距離以上で隠す
    const SHOW_DISTANCE = 24; // 上方向にこの距離以上で出す
    const MICRO_DELTA = 2; // これ未満のdyは無視（細かい揺れ）
    const COOLDOWN_MS = 300; // CSS遷移中は判定しない（max-heightの時間に合わせる）
    // ---------------------------------------------------

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const lastY = lastYRef.current;
        const dy = y - lastY;

        // TOP付近は必ず表示
        if (y <= TOP_THRESHOLD) {
          if (hiddenRef.current) applyHidden(false);
          lastYRef.current = y;
          dirRef.current = null;
          dirStartYRef.current = y;
          tickingRef.current = false;
          return;
        }

        // 微小なdyは無視（タッチ/慣性/レイアウト変化の揺れ対策）
        if (Math.abs(dy) < MICRO_DELTA) {
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        // 遷移中はトグルしない（レイアウト変化でscrollYが戻るのを無視）
        const t = performance.now();
        if (t < cooldownUntilRef.current) {
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        const direction: "up" | "down" = dy > 0 ? "down" : "up";

        // 方向が変わったら起点を更新
        if (dirRef.current !== direction) {
          dirRef.current = direction;
          dirStartYRef.current = y;
        }

        const dist = Math.abs(y - dirStartYRef.current);

        // 下に一定距離進んだら隠す
        if (!hiddenRef.current && direction === "down" && dist >= HIDE_DISTANCE) {
          applyHidden(true);
          cooldownUntilRef.current = t + COOLDOWN_MS;
          dirStartYRef.current = y;
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        // 上に一定距離戻ったら出す
        if (hiddenRef.current && direction === "up" && dist >= SHOW_DISTANCE) {
          applyHidden(false);
          cooldownUntilRef.current = t + COOLDOWN_MS;
          dirStartYRef.current = y;
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hairline sticky top-0 z-50 bg-background/90 sm:bg-background/80 sm:backdrop-blur">
      {/* top bar */}
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.28em] uppercase text-foreground/90 hover:text-foreground"
        >
          MY SITE
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8" aria-label="Primary">
          <Link className="nav-link" href="/">
            Home
          </Link>
          <Link className="nav-link" href="/blog">
            Blog
          </Link>
          <Link className="nav-link" href="/about">
            About
          </Link>
          <Link className="nav-link" href="/works">
            Works
          </Link>
        </nav>
      </div>

      {/* Mobile grid nav（2×2） */}
      <nav
        className={`mobile-nav sm:hidden border-t border-border ${
          isMobileHidden ? "is-hidden" : ""
        }`}
        aria-label="Primary mobile"
      >
        <ul className="grid grid-cols-2">
          <li className="border-b border-r border-border">
            <Link
              href="/about"
              className="block py-4 text-center text-sm tracking-[0.12em] text-muted hover:text-foreground"
            >
              About
            </Link>
          </li>

          <li className="border-b border-border">
            <Link
              href="/"
              className="block py-4 text-center text-sm tracking-[0.12em] text-muted hover:text-foreground"
            >
              Home
            </Link>
          </li>

          <li className="border-r border-border">
            <Link
              href="/blog"
              className="block py-4 text-center text-sm tracking-[0.12em] text-muted hover:text-foreground"
            >
              Blog
            </Link>
          </li>

          <li>
            <Link
              href="/works"
              className="block py-4 text-center text-sm tracking-[0.12em] text-muted hover:text-foreground"
            >
              Works
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
