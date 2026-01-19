import Link from "next/link";
import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";

type AnchorProps = ComponentProps<"a">;

function isExternal(href: string) {
  // http(s) / protocol-relative / mailto / tel を外部扱い
  return (
    /^(https?:)?\/\//.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function A({ href = "", className, children, ...props }: AnchorProps) {
  // ページ内アンカーはそのまま <a>
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

  // 外部リンク：新規タブ + rel を自動付与
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

  // 内部リンク：Next の Link を使う（/blog など）
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

/* 既存の cx() を流用します */
type ImgProps = ComponentProps<"img">;

function Img({ className, alt = "", ...props }: ImgProps) {
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

type PreProps = ComponentProps<"pre">;
type CodeProps = ComponentProps<"code">;

function Pre({ className, ...props }: PreProps) {
  return (
    <pre
      className={cx(
        "not-prose my-6 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

function Code({ className, children, ...props }: CodeProps) {
  const text =
    typeof children === "string"
      ? children
      : Array.isArray(children)
      ? children.join("")
      : "";

  const isBlock = className?.includes("language-") || text.includes("\n");

  return (
    <code
      className={cx(
        isBlock ? undefined : "rounded bg-white/10 px-1 py-0.5",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

type BlockquoteProps = ComponentProps<"blockquote">;
function Blockquote({ className, ...props }: BlockquoteProps) {
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

type HrProps = ComponentProps<"hr">;
function Hr({ className, ...props }: HrProps) {
  return <hr className={cx("my-10 border-white/10", className)} {...props} />;
}

type TableProps = ComponentProps<"table">;
function Table({ className, ...props }: TableProps) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table
        className={cx(
          "w-full border-collapse rounded-xl border border-white/10 text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

type ThProps = ComponentProps<"th">;
function Th({ className, ...props }: ThProps) {
  return (
    <th
      className={cx(
        "border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold",
        className
      )}
      {...props}
    />
  );
}

type TdProps = ComponentProps<"td">;
function Td({ className, ...props }: TdProps) {
  return (
    <td
      className={cx("border border-white/10 px-3 py-2 align-top", className)}
      {...props}
    />
  );
}


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: A,
    img: Img,
    pre: Pre,
    code: Code,
    blockquote: Blockquote,
    hr: Hr,
    table: Table,
    th: Th,
    td: Td,
  };
}
