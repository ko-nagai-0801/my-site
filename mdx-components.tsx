/* /mdx-components.tsx */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Children, isValidElement } from "react";
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

  // 内部リンク：Next の Link
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

/**
 * ✅ children を再帰的に探索して `language-xxx` を拾う
 * - Codeコンポーネントに差し替わっていても拾える
 */
type LangProps = { className?: unknown; children?: ReactNode };

function findLanguage(node: ReactNode): string | null {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue;

    const props = child.props as LangProps;

    const className = props.className;
    if (typeof className === "string") {
      const m = className.match(/language-([a-z0-9-]+)/i);
      if (m?.[1]) return m[1].toLowerCase();
    }

    const nested = props.children;
    if (nested != null) {
      const found = findLanguage(nested);
      if (found) return found;
    }
  }
  return null;
}

type PreProps = ComponentProps<"pre">;

function Pre({ className, children, ...props }: PreProps) {
  const lang = findLanguage(children);

  return (
    <div className="not-prose my-6">
      {/* ✅ 角丸は「外側コンテナ」で一括管理（上だけ/下だけが自然に揃う） */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        {lang && (
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-3 py-2">
            <span className="font-mono text-xs tracking-wider opacity-80">
              {lang}
            </span>
          </div>
        )}

        <pre
          className={cx(
            "m-0 overflow-x-auto p-4 text-sm leading-relaxed",
            className
          )}
          {...props}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}

type CodeProps = ComponentProps<"code">;

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
        isBlock
          ? undefined
          : "rounded bg-foreground/6 px-1.5 py-0.5 font-mono text-[0.95em]",
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

/**
 * ✅ Hookではなく「components生成関数」
 * - Server Component の async 内でも安全に呼べる
 */
export function getMDXComponents(components: MDXComponents): MDXComponents {
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
