/* components/ui/Reveal.tsx */
"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from "react";

type Props<T extends ElementType> = {
  as?: T;
  children?: ReactNode; // ✅ optional（self-closing でもOK）
  className?: string;
  delay?: number; // ms
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function Reveal<T extends ElementType = "div">({
  as,
  children,
  className = "",
  delay = 0,
  ...props
}: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ✅ reduced-motion は CSS 側で常時表示にしているので state を触らない
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let timeoutId: number | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        timeoutId = window.setTimeout(() => setIsVisible(true), delay);
        io.disconnect();
      },
      { threshold: 0.2 }
    );

    io.observe(el);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      io.disconnect();
    };
  }, [delay]);

  return (
    <Tag
      ref={ref as unknown as Ref<HTMLElement>}
      className={`kns-reveal ${isVisible ? "is-visible" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
