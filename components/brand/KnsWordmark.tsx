/* components/brand/KnsWordmark.tsx */
import type { ComponentProps } from "react";
import { KnsMark } from "./KnsMark";

type Props = ComponentProps<"svg">;

export function KnsWordmark(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 300"
      role="img"
      aria-label="KNS logo wordmark"
      {...props}
    >
      {/* 左：マーク */}
      <g transform="translate(60,30)">
        <KnsMark width="240" height="240" />
      </g>

      {/* 右：ワードマーク（textはフォント依存なので、必要ならパス化推奨） */}
      <g transform="translate(360,92)">
        <text
          x="0"
          y="0"
          fontSize="56"
          fontWeight="650"
          fill="currentColor"
          fontFamily='ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Hiragino Sans", "Yu Gothic", sans-serif'
          letterSpacing="0.02em"
        >
          Kou Nagai Studio
        </text>
        <text
          x="2"
          y="60"
          fontSize="14"
          fill="currentColor"
          opacity="0.78"
          fontFamily='ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Hiragino Sans", "Yu Gothic", sans-serif'
          letterSpacing="0.22em"
        >
          K N S
        </text>
      </g>
    </svg>
  );
}
