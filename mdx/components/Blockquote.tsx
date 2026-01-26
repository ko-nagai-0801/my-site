/* /mdx/components/Blockquote.tsx */
import type { ComponentProps } from "react";

type BlockquoteProps = ComponentProps<"blockquote">;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Blockquote({ className, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className={cx(
        "my-6 border-l-2 border-white/20 pl-4 italic opacity-90",
        className
      )}
      {...props}
    />
  );
}
