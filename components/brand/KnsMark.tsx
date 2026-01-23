/* components/brand/KnsMark.tsx */
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"svg">;

export function KnsMark(props: Props) {
  const { className, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      role="img"
      aria-label="KNS logo mark"
      className={className}
      {...rest}
    >
      <g
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 外枠（好みで消してOK） */}
        <circle cx="256" cy="256" r="206" strokeWidth="12" opacity="0.9" />

        {/* K */}
        <path strokeWidth="20" d="M152 166 V346" />
        <path strokeWidth="20" d="M152 256 L236 166" />
        <path strokeWidth="20" d="M152 256 L242 346" />

        {/* N */}
        <path strokeWidth="20" d="M256 346 V166" />
        <path strokeWidth="20" d="M256 166 L328 346" />
        <path strokeWidth="20" d="M328 346 V166" />

        {/* S */}
        <path
          strokeWidth="20"
          d="M380 198
             C380 176 360 164 332 164
             C304 164 288 178 288 196
             C288 214 302 224 330 232
             L346 236
             C374 244 392 258 392 284
             C392 322 356 350 312 350
             C274 350 244 330 244 304"
        />
      </g>
    </svg>
  );
}
