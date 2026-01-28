/* components/ui/SpotlightCard.tsx */
"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function SpotlightCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={ref}
      className={`kns-spotlight ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;

        // pointer: fine 以外は無視（スマホ等）
        if (e.pointerType !== "mouse") return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        el.style.setProperty("--spotlight-x", `${x}px`);
        el.style.setProperty("--spotlight-y", `${y}px`);
      }}
    >
      {children}
    </div>
  );
}
