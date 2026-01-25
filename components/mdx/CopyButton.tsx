/* components/mdx/CopyButton.tsx */
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  className?: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "0";
  ta.style.left = "0";
  ta.style.width = "1px";
  ta.style.height = "1px";
  ta.style.opacity = "0";
  ta.style.pointerEvents = "none";

  document.body.appendChild(ta);
  ta.select();

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(ta);
  }
  return ok;
}

export default function CopyButton({ text, className }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    if (!text) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ok = fallbackCopy(text);
        if (!ok) throw new Error("fallback copy failed");
      }

      setState("copied");
    } catch {
      setState("error");
    }

    timerRef.current = window.setTimeout(() => {
      setState("idle");
    }, 1400);
  }

  const label =
    state === "copied" ? "Copied" : state === "error" ? "Error" : "Copy";

  const liveMessage =
    state === "copied"
      ? "Copied to clipboard"
      : state === "error"
        ? "Copy failed"
        : "";

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      aria-label="コードをコピー"
      title="Copy code"
      className={cx(
        "inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1",
        "font-mono text-xs tracking-wider opacity-90 hover:opacity-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-state={state}
    >
      {label}
      <span className="sr-only" role="status" aria-live="polite">
        {liveMessage}
      </span>
    </button>
  );
}
