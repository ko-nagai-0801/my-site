/* components/ui/CursorStalker.tsx */
"use client";

import { useEffect, useRef } from "react";

function canRun() {
  if (typeof window === "undefined") return false;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fine && !reduce;
}

export function CursorStalker() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!canRun()) {
      el.style.opacity = "0";
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    let raf = 0;
    let active = false;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      // 追従は少し遅らせる（上品）
      currentX = lerp(currentX, targetX, 0.14);
      currentY = lerp(currentY, targetY, 0.14);

      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      targetX = e.clientX;
      targetY = e.clientY;

      if (!active) {
        active = true;
        el.style.opacity = "1";
      }
    };

    const onLeave = () => {
      active = false;
      el.style.opacity = "0";
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      // クリック時の軽い反応
      el.classList.remove("kns-cursor--click");
      // reflow
      void el.offsetWidth;
      el.classList.add("kns-cursor--click");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="kns-cursor-stalker"
      aria-hidden="true"
    />
  );
}
