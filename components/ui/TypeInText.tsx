/* components/ui/TypeInText.tsx */
"use client";

import type { CSSProperties, ElementType } from "react";
import { useEffect, useRef } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;   // ms
  stagger?: number; // ms
  caret?: boolean;
  once?: boolean;
};

export function TypeInText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 22,
  caret = true,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const chars = Array.from(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("is-visible");
          if (once) io.unobserve(entry.target);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const style = {
    "--typein-delay": `${delay}ms`,
    "--typein-stagger": `${stagger}ms`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref as unknown as React.Ref<unknown>}
      className={`kns-typein ${caret ? "kns-typein--caret" : ""} ${className}`}
      style={style}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <span
          key={`${c}-${i}`}
          className="kns-typein__char"
          style={{ "--i": i } as CSSProperties}
          aria-hidden="true"
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </Tag>
  );
}
