/* components/ui/TiltCard.tsx */
"use client";

import type { ReactNode } from "react";
import Tilt from "react-parallax-tilt";

function isEnabled() {
  if (typeof window === "undefined") return false;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fine && !reduce;
}

export function TiltCard({ children }: { children: ReactNode }) {
  // クリック等のイベントが発生するまでは window が無いので false → そのまま children を返す
  // ただし Tilt は client component なので実際はクライアントで評価されます。
  if (!isEnabled()) return <>{children}</>;

  return (
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      scale={1.01}
      transitionSpeed={700}
      glareEnable={false}
    >
      {children}
    </Tilt>
  );
}
