/* components/ui/Reveal.tsx */
"use client";

import type { ElementType, ReactNode, ComponentPropsWithoutRef } from "react";
import { useEffect, useRef } from "react";

type RevealProps<E extends ElementType> = {
  as?: E;
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  once?: boolean;
} & Omit<ComponentPropsWithoutRef<E>, "as" | "children" | "className">;

export function Reveal<E extends ElementType = "div">({
  as,
  children,
  className = "",
  delay = 0,
  once = true,
  ...rest
}: RevealProps<E>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("is-visible");
      return;
    }

    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("is-visible");
          if (once) io.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay, once]);

  return (
    <Tag
      ref={ref as unknown as React.Ref<unknown>}
      className={`kns-reveal ${className}`}
      {...(rest as object)}
    >
      {children}
    </Tag>
  );
}
