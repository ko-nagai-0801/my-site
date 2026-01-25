/* /mdx-components.tsx */
import Link from "next/link";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";
import type { MDXComponents } from "mdx/types";

import CopyButton from "@/components/mdx/CopyButton";

type AnchorProps = ComponentProps<"a">;

function isExternal(href: string) {
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

/**
 * ✅ コード本文を再帰的に抽出（Copy用）
 */
function extractText(node: ReactNode): string {
  let out = "";

  for (const child of Children.toArray(node)) {
    if (typeof child === "string" || typeof child === "number") {
      out += String(child);
      continue;
    }
    if (!isValidElement(child)) continue;

    const props = child.props as { children?: ReactNode };
    if (props.children != null) out += extractText(props.children);
  }

  return out;
}

function getDataString(
  props: Record<string, unknown>,
  key: string
): string | null {
  const v = props[key];
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

/** ✅ ReactNode を潜って最初に見つかった data-* を拾う（pre/codeどっちに付いててもOK） */
function findDataAttrDeep(node: ReactNode, key: string): string | null {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue;

    const props = child.props as Record<string, unknown>;
    const v = getDataString(props, key);
    if (v) return v;

    const nested = props.children as ReactNode | undefined;
    if (nested != null) {
      const found = findDataAttrDeep(nested, key);
      if (found) return found;
    }
  }
  return null;
}

/** ✅ 最初にマッチした要素を深掘りで探す（ReactElementで返す） */
function findFirstElementDeep(
  node: ReactNode,
  predicate: (el: ReactElement) => boolean
): ReactElement | null {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue;

    const el = child as ReactElement;

    if (predicate(el)) return el;

    const nested = (el.props as { children?: ReactNode }).children;
    if (nested != null) {
      const found = findFirstElementDeep(nested, predicate);
      if (found) return found;
    }
  }
  return null;
}

type PreProps = ComponentProps<"pre">;

function Pre({ className, children, ...props }: PreProps) {
  /**
   * ✅ pretty-code の pre は “絶対にラップしない”
   * - data-theme / data-language が pre 側に無い場合もあるので
   *   children 側も探索して判定する
   */
  const record = props as Record<string, unknown>;
  const classNameStr = typeof className === "string" ? className : "";

  const isPretty =
    record["data-theme"] !== undefined ||
    record["data-language"] !== undefined ||
    classNameStr.includes("shiki") ||
    findDataAttrDeep(children, "data-theme") !== null ||
    findDataAttrDeep(children, "data-language") !== null ||
    findDataAttrDeep(children, "data-line-numbers") !== null ||
    findDataAttrDeep(children, "data-line-numbers-max-digits") !== null;

  if (isPretty) {
    return (
      <pre className={className} {...props}>
        {children}
      </pre>
    );
  }

  const lang = findLanguage(children);
  const codeText = extractText(children);
  const canCopy = codeText.trim().length > 0;

  return (
    <div className="not-prose my-6">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        {(lang || canCopy) && (
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-3 py-2">
            {lang ? (
              <span className="font-mono text-xs tracking-wider opacity-80">
                {lang}
              </span>
            ) : (
              <span className="sr-only">code block</span>
            )}

            {canCopy && <CopyButton text={codeText} className="ml-auto" />}
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
  // ✅ pretty-code の code は data-line-numbers 等が付くので inline 装飾を当てない
  const record = props as Record<string, unknown>;
  const isPretty =
    record["data-theme"] !== undefined ||
    record["data-language"] !== undefined ||
    record["data-line-numbers"] !== undefined ||
    record["data-line-numbers-max-digits"] !== undefined ||
    record["data-highlighted-chars"] !== undefined ||
    (typeof className === "string" && className.includes("shiki"));

  if (isPretty) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

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

/**
 * ✅ rehype-pretty-code 用：figure を再構成
 * - 「title（ファイル名）/ 言語 / Copy」を同じバーに統合
 * - “titleノードだけ” 除外して二重表示を防ぐ
 * - Copy は「code要素の中身」だけをコピーする
 */
type FigureProps = ComponentProps<"figure">;

function Figure({ children, ...props }: FigureProps) {
  const record = props as Record<string, unknown>;

  const isPretty =
    record["data-rehype-pretty-code-fragment"] !== undefined ||
    record["data-rehype-pretty-code-figure"] !== undefined;

  if (!isPretty) return <figure {...props}>{children}</figure>;

  const nodes = Children.toArray(children);

  // title は “直下” に来る想定
  let titleEl: ReactElement | null = null;

  for (const n of nodes) {
    if (!isValidElement(n)) continue;
    const p = n.props as Record<string, unknown>;
    if (p["data-rehype-pretty-code-title"] !== undefined) {
      titleEl = n as ReactElement;
      break;
    }
  }

  // ✅ pre は「preタグ or Preコンポーネント」に限定（titleを拾う事故防止）
  const preEl = findFirstElementDeep(children, (el) => {
    const t = el.type;
    const isPreTag = typeof t === "string" && t === "pre";
    const isPreComp = t === Pre;
    return isPreTag || isPreComp;
  });

  // ✅ code も同様に限定して拾う
  const codeEl = preEl
    ? findFirstElementDeep(preEl, (el) => {
        const t = el.type;
        const isCodeTag = typeof t === "string" && t === "code";
        const isCodeComp = t === Code;
        return isCodeTag || isCodeComp;
      })
    : null;

  const titleText = titleEl ? extractText(titleEl).trim() : "";

  const lang =
    (preEl ? findDataAttrDeep(preEl, "data-language") : null) ||
    (codeEl ? findDataAttrDeep(codeEl, "data-language") : null) ||
    (preEl ? findLanguage(preEl) : null) ||
    (codeEl ? findLanguage(codeEl) : null);

  // ✅ Copy は “code要素の中身” を最優先（title混入を防ぐ）
  const codeText = codeEl
    ? extractText(codeEl)
    : preEl
      ? extractText(preEl)
      : "";
  const canCopy = codeText.trim().length > 0;

  const showHeader = Boolean(titleText || lang || canCopy);

  // ✅ titleノードだけ除外して二重化防止
  const contentNodes = titleEl ? nodes.filter((n) => n !== titleEl) : nodes;

  return (
    <figure {...props}>
      {showHeader ? (
        <div
          data-rehype-pretty-code-title=""
          className="flex items-center gap-3"
        >
          <div className="min-w-0 flex-1">
            {titleText ? (
              <span className="block truncate">{titleText}</span>
            ) : (
              <span className="sr-only">code block</span>
            )}
          </div>

          {lang ? (
            <span className="font-mono text-xs tracking-wider opacity-80">
              {lang}
            </span>
          ) : null}

          {canCopy ? <CopyButton text={codeText} className="ml-auto" /> : null}
        </div>
      ) : null}

      {contentNodes}
    </figure>
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

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: A,
    img: Img,
    figure: Figure,
    pre: Pre,
    code: Code,
    blockquote: Blockquote,
    hr: Hr,
    table: Table,
    th: Th,
    td: Td,
  };
}
