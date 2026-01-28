/* components/ui/CursorStalker.tsx */
"use client";

import { useEffect, useRef } from "react";

function canRun() {
  if (typeof window === "undefined") return false;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fine && !reduce;
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;

  // 「ホバー時強調」対象（必要なら data-cursor="interactive" を追加して拡張OK）
  return Boolean(
    target.closest(
      [
        "a",
        "button",
        "[role='button']",
        "input",
        "select",
        "textarea",
        "[data-cursor='interactive']",
      ].join(",")
    )
  );
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

    // scale もJSで持って、transform に合成（CSS側でtransform触らない）
    let targetScale = 1;
    let currentScale = 1;

    let raf = 0;
    let active = false;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.14);
      currentY = lerp(currentY, targetY, 0.14);
      currentScale = lerp(currentScale, targetScale, 0.18);

      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale})`;

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
      targetScale = 1;
      el.classList.remove("kns-cursor--hover");
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      el.classList.remove("kns-cursor--click");
      // reflow
      void el.offsetWidth;
      el.classList.add("kns-cursor--click");
    };

    // ✅ 2) Hover 時強調（capture で取りこぼしを減らす）
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      if (isInteractiveTarget(e.target)) {
        el.classList.add("kns-cursor--hover");
        targetScale = 1.35; // 上品に（好みで 1.25〜1.5）
      }
    };

    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      // interactive から抜けたら戻す（relatedTarget も見て “移動中” を考慮）
      const next = (e as unknown as { relatedTarget?: EventTarget | null }).relatedTarget ?? null;
      if (isInteractiveTarget(next)) return;

      el.classList.remove("kns-cursor--hover");
      targetScale = 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);

    window.addEventListener("pointerover", onOver, true);
    window.addEventListener("pointerout", onOut, true);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);

      window.removeEventListener("pointerover", onOver, true);
      window.removeEventListener("pointerout", onOut, true);
    };
  }, []);

  return <div ref={ref} className="kns-cursor-stalker" aria-hidden="true" />;
}
