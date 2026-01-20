// components/site-header.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const [showMobileNav, setShowMobileNav] = useState(true);

  const lastYRef = useRef(0);
  const lastSwitchYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)"); // sm未満だけ制御

    // 露出/非露出の安定化パラメータ
    const HIDE_AFTER = 24; // 下にこれ以上進んだら隠してOK（小さめ）
    const SHOW_AFTER_UP = 84; // 隠した後、上にこれ以上戻ったら表示（大きめ=ヒステリシス）
    const ALWAYS_SHOW_AT_TOP = 8; // ほぼ最上部は常に表示

    // ここが “安定化” の肝：最後に切替した位置からの差分で判断する
    const update = () => {
      if (!mq.matches) {
        // PC幅は常に表示
        setShowMobileNav(true);
        lastYRef.current = window.scrollY;
        lastSwitchYRef.current = window.scrollY;
        return;
      }

      const y = window.scrollY;

      // 最上部は必ず表示
      if (y <= ALWAYS_SHOW_AT_TOP) {
        if (!showMobileNav) {
          setShowMobileNav(true);
          lastSwitchYRef.current = y;
        }
        lastYRef.current = y;
        return;
      }

      const dy = y - lastYRef.current; // 直近のスクロール方向
      const fromSwitch = y - lastSwitchYRef.current; // 最後の切替地点からどれだけ動いたか

      // 下方向に進み、かつ最後の切替から一定量進んだら隠す
      if (showMobileNav && dy > 0 && fromSwitch > HIDE_AFTER) {
        setShowMobileNav(false);
        lastSwitchYRef.current = y;
        lastYRef.current = y;
        return;
      }

      // 上方向に戻り、かつ最後の切替から一定量戻ったら出す
      // （隠した直後の微小な戻りでは出さない＝ブレ防止）
      if (!showMobileNav && dy < 0 && fromSwitch < -SHOW_AFTER_UP) {
        setShowMobileNav(true);
        lastSwitchYRef.current = y;
        lastYRef.current = y;
        return;
      }

      lastYRef.current = y;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        update();
        tickingRef.current = false;
      });
    };

    // 初期化
    lastYRef.current = window.scrollY;
    lastSwitchYRef.current = window.scrollY;

    window.addEventListener("scroll", onScroll, { passive: true });

    // 幅変更時はリセット
    const onChange = () => {
      lastYRef.current = window.scrollY;
      lastSwitchYRef.current = window.scrollY;
      setShowMobileNav(true);
    };
    mq.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener?.("change", onChange);
    };
    // showMobileNav を依存に入れると再購読が増えるので入れない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMobileNav]);

  return (
    <header className="hairline sticky top-0 z-50 bg-background/80 backdrop-blur">
      {/* top bar（常に表示） */}
      <div className="container flex h-14 items-center justify-between">
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

      {/* Mobile grid nav（下スクロールで隠す） */}
      <nav
        className={[
          "mobile-nav sm:hidden border-t border-border",
          showMobileNav ? "" : "is-hidden",
        ].join(" ")}
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
