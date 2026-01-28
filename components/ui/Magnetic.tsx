/* components/ui/Magnetic.tsx */
"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number; // 6〜14 くらいが上品
};

function isEnabled() {
  if (typeof window === "undefined") return false;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fine && !reduce;
}

export function Magnetic({ children, className = "", strength = 10 }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const reset = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = "translate3d(0,0,0)";
    inner.style.transition = "transform 200ms ease";
  };

  const onMove = (e: React.PointerEvent) => {
    if (!isEnabled()) return;

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    if (e.pointerType !== "mouse") return;

    const r = wrap.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);

    const mx = (dx / r.width) * strength;
    const my = (dy / r.height) * strength;

    inner.style.transition = "transform 0ms";
    inner.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
  };

  return (
    <div
      ref={wrapRef}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
