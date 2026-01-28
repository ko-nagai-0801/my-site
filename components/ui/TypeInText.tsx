/* components/ui/TypeInText.tsx */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ComponentPropsWithoutRef, ElementType, Ref } from "react";

type CSSVars = CSSProperties & Partial<Record<`--${string}`, string | number>>;

type Props<T extends ElementType> = {
  as?: T;
  text: string;
  className?: string;
  delay?: number; // ms（is-visible 付与までの待ち）
  stagger?: number; // ms per char
  caret?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function TypeInText<T extends ElementType = "p">({
  as,
  text,
  className = "",
  delay = 0,
  stagger = 18,
  caret = true,
  ...props
}: Props<T>) {
  const Tag = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const chars = useMemo(() => Array.from(text), [text]);

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

  const styleVars: CSSVars = {
    "--typein-delay": "0ms",
    "--typein-stagger": `${stagger}ms`,
  };

  return (
    <Tag
      ref={ref as unknown as Ref<HTMLElement>}
      className={`kns-typein ${caret ? "kns-typein--caret" : ""} ${
        isVisible ? "is-visible" : ""
      } ${className}`}
      style={styleVars}
      aria-label={text}
      {...props}
    >
      {chars.map((ch, i) => {
        const charVars: CSSVars = { "--i": i };
        return (
          <span
            key={`${ch}-${i}`}
            className="kns-typein__char"
            style={charVars}
            aria-hidden="true"
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </Tag>
  );
}
