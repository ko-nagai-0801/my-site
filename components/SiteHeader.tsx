/* components/SiteHeader.tsx */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 21l-4.35-4.35" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  const [isMobileHidden, setIsMobileHidden] = useState(false);

  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);

  const dirRef = useRef<"up" | "down" | null>(null);
  const dirStartYRef = useRef(0);

  const cooldownUntilRef = useRef(0);
  const tickingRef = useRef(false);

  const applyHidden = (next: boolean) => {
    if (hiddenRef.current === next) return;
    hiddenRef.current = next;
    setIsMobileHidden(next);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const y = window.scrollY || 0;
    lastYRef.current = y;
    dirRef.current = null;
    dirStartYRef.current = y;

    // ✅ route遷移時は「モバイルnavを出す」
    if (hiddenRef.current) {
      const id = window.requestAnimationFrame(() => applyHidden(false));
      return () => window.cancelAnimationFrame(id);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nowY = window.scrollY || 0;
    lastYRef.current = nowY;
    dirStartYRef.current = nowY;

    const TOP_THRESHOLD = 12;
    const HIDE_DISTANCE = 36;
    const SHOW_DISTANCE = 24;
    const MICRO_DELTA = 2;
    const COOLDOWN_MS = 320;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const lastY = lastYRef.current;
        const dy = y - lastY;

        if (y <= TOP_THRESHOLD) {
          applyHidden(false);
          lastYRef.current = y;
          dirRef.current = null;
          dirStartYRef.current = y;
          tickingRef.current = false;
          return;
        }

        if (Math.abs(dy) < MICRO_DELTA) {
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        const t = performance.now();
        if (t < cooldownUntilRef.current) {
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        const direction: "up" | "down" = dy > 0 ? "down" : "up";

        if (dirRef.current !== direction) {
          dirRef.current = direction;
          dirStartYRef.current = y;
        }

        const dist = Math.abs(y - dirStartYRef.current);

        if (!hiddenRef.current && direction === "down" && dist >= HIDE_DISTANCE) {
          applyHidden(true);
          cooldownUntilRef.current = t + COOLDOWN_MS;
          dirStartYRef.current = y;
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

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
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <img
            src="/images/brand/kns-mark-white.svg"
            width={35}
            height={35}
            alt="KNS logo"
            className="block shrink-0"
          />

          <div className="leading-none">
            <span className="block text-[13px] font-semibold tracking-[0.28em] uppercase text-foreground/90 group-hover:text-foreground sm:text-sm">
              Kou Nagai Studio
            </span>
            <span className="mt-1 block text-[10px] tracking-[0.35em] text-muted">
              K N S
            </span>
          </div>
        </Link>

        {/* Mobile: logo右にSearchアイコン */}
        <Link
          href="/search"
          aria-label="Search"
          className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted hover:text-foreground sm:hidden"
        >
          <SearchIcon className="h-5 w-5" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 sm:flex" aria-label="Primary">
          {/* 並び：HOME, ABOUT, WORKS, BLOG */}
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/works", label: "Works" },
            { href: "/blog", label: "Blog" },
          ].map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                className={`nav-link ${active ? "text-foreground" : ""}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Desktop Search：アイコン＋テキストボックス風（リンク） */}
          <Link
            href="/search"
            aria-label="Search"
            className={`group flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm ${
              isActive("/search") ? "text-foreground" : "text-muted"
            } hover:text-foreground`}
          >
            <SearchIcon className="h-4 w-4" />
            <span className="text-xs tracking-[0.12em]">Search</span>
            <span className="ml-1 hidden text-xs text-muted/70 group-hover:text-foreground/70 lg:inline">
              keyword...
            </span>
          </Link>
        </nav>
      </div>

      {/* Mobile nav：2×2（Home/About , Works/Blog） */}
      <nav
        className={`mobile-nav border-t border-border sm:hidden ${
          isMobileHidden ? "is-hidden" : ""
        }`}
        aria-label="Primary mobile"
      >
        <ul className="grid grid-cols-2">
          {/* Row1: Home / About */}
          <li className="border-b border-r border-border">
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={`block py-4 text-center text-sm tracking-[0.12em] hover:text-foreground ${
                isActive("/") ? "text-foreground" : "text-muted"
              }`}
            >
              HOME
            </Link>
          </li>

          <li className="border-b border-border">
            <Link
              href="/about"
              aria-current={isActive("/about") ? "page" : undefined}
              className={`block py-4 text-center text-sm tracking-[0.12em] hover:text-foreground ${
                isActive("/about") ? "text-foreground" : "text-muted"
              }`}
            >
              ABOUT
            </Link>
          </li>

          {/* Row2: Works / Blog */}
          <li className="border-r border-border">
            <Link
              href="/works"
              aria-current={isActive("/works") ? "page" : undefined}
              className={`block py-4 text-center text-sm tracking-[0.12em] hover:text-foreground ${
                isActive("/works") ? "text-foreground" : "text-muted"
              }`}
            >
              WORKS
            </Link>
          </li>

          <li>
            <Link
              href="/blog"
              aria-current={isActive("/blog") ? "page" : undefined}
              className={`block py-4 text-center text-sm tracking-[0.12em] hover:text-foreground ${
                isActive("/blog") ? "text-foreground" : "text-muted"
              }`}
            >
              BLOG
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
