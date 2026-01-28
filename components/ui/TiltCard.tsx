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
  const enabled = isEnabled();

  return (
    <Tilt
      tiltEnable={enabled}
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      scale={enabled ? 1.01 : 1}
      transitionSpeed={700}
      glareEnable={false}
    >
      {children}
    </Tilt>
  );
}
