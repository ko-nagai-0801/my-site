/* /mdx/components/Hr.tsx */
import type { ComponentProps } from "react";

type HrProps = ComponentProps<"hr">;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Hr({ className, ...props }: HrProps) {
  return <hr className={cx("my-10 border-white/10", className)} {...props} />;
}
