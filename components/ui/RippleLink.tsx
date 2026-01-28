/* components/ui/RippleLink.tsx */
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRef } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

function enabled() {
  if (typeof window === "undefined") return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reduce;
}

export function RippleLink({ href, className = "", children }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  return (
    <Link
      href={href}
      ref={ref}
      className={`kns-ripple-host ${className}`}
      onPointerDown={(e) => {
        if (!enabled()) return;

        const a = ref.current;
        if (!a) return;

        const rect = a.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        a.style.setProperty("--ripple-x", `${x}px`);
        a.style.setProperty("--ripple-y", `${y}px`);

        a.classList.remove("kns-ripple");
        void a.offsetWidth; // reflow
        a.classList.add("kns-ripple");
      }}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
