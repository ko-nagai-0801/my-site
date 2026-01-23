/* components/brand/KnsMark.tsx */
import type { ComponentProps } from "react";

type Props = ComponentProps<"svg">;

export function KnsMark(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      role="img"
      aria-label="KNS logo mark"
      {...props}
    >
      <circle
        cx="256"
        cy="256"
        r="206"
        stroke="currentColor"
        strokeWidth="12"
        opacity="0.9"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* K */}
      <path
        d="M152 166 V346"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M152 256 L236 166"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M152 256 L242 346"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* N */}
      <path
        d="M256 346 V166"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M256 166 L328 346"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M328 346 V166"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* S */}
      <path
        d="M380 198
           C380 176 360 164 332 164
           C304 164 288 178 288 196
           C288 214 302 224 330 232
           L346 236
           C374 244 392 258 392 284
           C392 322 356 350 312 350
           C274 350 244 330 244 304"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
