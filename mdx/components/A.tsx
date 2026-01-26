/* /mdx/components/A.tsx */
import Link from "next/link";
import type { ComponentProps } from "react";

type AnchorProps = ComponentProps<"a">;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isExternal(href: string) {
  return (
    /^(https?:)?\/\//.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function A({ href = "", className, children, ...props }: AnchorProps) {
  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        className={cx(
          "underline underline-offset-4 opacity-90 hover:opacity-100",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (isExternal(href)) {
    const isHttp = /^(https?:)?\/\//.test(href);
    return (
      <a
        href={href}
        className={cx(
          "underline underline-offset-4 opacity-90 hover:opacity-100",
          className
        )}
        target={isHttp ? "_blank" : props.target}
        rel={isHttp ? "noopener noreferrer" : props.rel}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cx(
        "underline underline-offset-4 opacity-90 hover:opacity-100",
        className
      )}
    >
      {children}
    </Link>
  );
}
