/* /mdx/components/Img.tsx */
import type { ComponentProps } from "react";

type ImgProps = ComponentProps<"img">;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Img({ className, alt = "", ...props }: ImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cx("my-6 w-full rounded-xl border border-white/10", className)}
      {...props}
    />
  );
}
