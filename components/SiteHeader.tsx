/* components/SiteHeader.tsx */
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMobileHidden, setIsMobileHidden] = useState(false);
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);

  const dirRef = useRef<"up" | "down" | null>(null);
  const dirStartYRef = useRef(0);

  const cooldownUntilRef = useRef(0);
  const tickingRef = useRef(false);

  // Search（ヘッダー常設）
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const applyHidden = (next: boolean) => {
    if (hiddenRef.current === next) return;
    hiddenRef.current = next;
    setIsMobileHidden(next);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // route遷移時：スクロール管理の初期化 +（必要なら）モバイルnavを出す
  useEffect(() => {
    if (typeof window === "undefined") return;

    const y = window.scrollY || 0;
    lastYRef.current = y;
    dirRef.current = null;
    dirStartYRef.current = y;

    if (hiddenRef.current) {
      const id = window.requestAnimationFrame(() => applyHidden(false));
      return () => window.cancelAnimationFrame(id);
    }
  }, [pathname]);

  // /search?q=... に遷移したとき、ヘッダー入力も追従させる（同期setStateを避けるため rAF）
  useEffect(() => {
    if (typeof window === "undefined") return;

    const next = searchParams.get("q") ?? "";
    const id = window.requestAnimationFrame(() => setQuery(next));
    return () => window.cancelAnimationFrame(id);
  }, [searchParams]);

  // モバイル検索バー：開いたらフォーカス
  useEffect(() => {
    if (!mobileSearchOpen) return;
    const id = window.requestAnimationFrame(() => mobileInputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [mobileSearchOpen]);

  // ESCでモバイル検索バー閉じる
  useEffect(() => {
    if (!mobileSearchOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSearchOpen]);

  // スクロールでモバイルnavを隠す/出す
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

  const goSearch = (raw: string) => {
    const q = raw.trim();
    if (!q) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

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

        {/* Mobile: logo右にSearchアイコン（押すと検索バー展開） */}
        <button
          type="button"
          aria-label="Open search"
          onClick={() => setMobileSearchOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted hover:text-foreground sm:hidden"
        >
          <SearchIcon className="h-5 w-5" />
        </button>

        {/* Desktop nav + Search input */}
        <nav className="hidden items-center gap-8 sm:flex" aria-label="Primary">
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

          {/* Desktop: 常設Search入力（Enterで/search?q=...） */}
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              goSearch(query);
            }}
            className={`flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted hover:text-foreground ${
              isActive("/search") ? "text-foreground" : ""
            }`}
          >
            <SearchIcon className="h-4 w-4" />
            <label htmlFor="site-search" className="sr-only">
              Search
            </label>
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-[12rem] bg-transparent text-xs tracking-[0.12em] text-foreground/90 placeholder:text-muted/70 outline-none lg:w-[16rem]"
            />
          </form>
        </nav>
      </div>

      {/* Mobile: Searchバー（展開式） */}
      {mobileSearchOpen && (
        <div className="sm:hidden border-t border-border bg-background/95">
          <div className="container py-3">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                goSearch(query);
                setMobileSearchOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-3"
            >
              <SearchIcon className="h-5 w-5 text-muted" />
              <label htmlFor="site-search-mobile" className="sr-only">
                Search
              </label>
              <input
                id="site-search-mobile"
                ref={mobileInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm tracking-[0.10em] text-foreground/90 placeholder:text-muted/70 outline-none"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setMobileSearchOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted hover:text-foreground"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile nav：2×2（Home/About , Works/Blog） */}
      <nav
        className={`mobile-nav border-t border-border sm:hidden ${
          isMobileHidden ? "is-hidden" : ""
        }`}
        aria-label="Primary mobile"
      >
        <ul className="grid grid-cols-2">
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
