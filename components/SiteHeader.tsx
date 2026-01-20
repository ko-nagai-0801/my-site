/* components/SiteHeader.tsx */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const pathname = usePathname();

  const [isMobileHidden, setIsMobileHidden] = useState(false);

  // refs（イベント内で最新値を参照）
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  // stateとrefを同時に揃える（ズレ防止）
  const applyHidden = (next: boolean) => {
    hiddenRef.current = next;
    setIsMobileHidden(next);
  };

  // ルート遷移したら “メニューは表示” に戻す（※同期setStateを避ける）
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 初回スクロールでの誤判定を減らす
    lastYRef.current = window.scrollY || 0;

    // hidden のときだけ “次フレームで” 表示に戻す
    if (!hiddenRef.current) return;

    const id = requestAnimationFrame(() => {
      // ここでも念のため再チェック
      if (hiddenRef.current) applyHidden(false);
    });

    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastYRef.current = window.scrollY || 0;

    const TOP_THRESHOLD = 8; // ここ未満は常に表示
    const DEAD_ZONE = 10; // これ未満のスクロールは無視（揺れ防止）

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const dy = y - lastYRef.current;
        const ady = Math.abs(dy);

        // TOP付近は常に表示
        if (y < TOP_THRESHOLD) {
          if (hiddenRef.current) applyHidden(false);
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        // 微小スクロールは無視（ゆっくりスクロール時の揺れ防止）
        if (ady < DEAD_ZONE) {
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        // 下スクロールなら隠す / 上スクロールなら出す
        const nextHidden = dy > 0;

        if (hiddenRef.current !== nextHidden) {
          applyHidden(nextHidden);
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
