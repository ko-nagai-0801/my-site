/* /mdx/code/Code.tsx */
import type { ComponentProps } from "react";

type CodeProps = ComponentProps<"code">;

export function Code({ className, children, ...props }: CodeProps) {
  // ✅ pretty-code の code は data-line-numbers 等が付くので inline 装飾を当てない
  const record = props as Record<string, unknown>;
  const isPretty =
    record["data-theme"] !== undefined ||
    record["data-language"] !== undefined ||
    record["data-line-numbers"] !== undefined ||
    record["data-line-numbers-max-digits"] !== undefined ||
    record["data-highlighted-chars"] !== undefined ||
    (typeof className === "string" && className.includes("shiki"));

  // ✅ 見た目は CSS（typography.css / pretty-code.css）に寄せる
  if (isPretty) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
