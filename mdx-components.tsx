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

type PreProps = ComponentProps<"pre">;

/**
 * ✅ React型定義の都合で isValidElement 後の props が unknown になりやすいので
 * 「children を持つ可能性がある props」として安全に扱う
 */
type AnyProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
};
type AnyElement = ReactElement<AnyProps>;

function toAnyElement(el: ReactElement): AnyElement {
  return el as AnyElement;
}

/** 深さ優先で最初にマッチする要素を探す */
function findFirstElementDeep(
  node: ReactNode,
  predicate: (el: AnyElement) => boolean
): AnyElement | null {
  const arr = Children.toArray(node);

  for (const n of arr) {
    if (!isValidElement(n)) continue;

    const el = toAnyElement(n as ReactElement);
    if (predicate(el)) return el;

    const children = (el.props as AnyProps).children;
    const found = findFirstElementDeep(children, predicate);
    if (found) return found;
  }

  return null;
}

/** 深さ優先で data-* 属性値を探す */
function findDataAttrDeep(node: ReactNode, key: string): string | null {
  const el = findFirstElementDeep(node, (e) => {
    const p = e.props as AnyProps;
    return p[key] !== undefined;
  });
  if (!el) return null;

  const props = el.props as AnyProps;
  const val = props[key];
  return typeof val === "string" ? val : val != null ? String(val) : null;
}

/** className から language-xxx を拾う */
function findLanguage(node: ReactNode): string | null {
  const el = findFirstElementDeep(node, (e) => {
    const p = e.props as AnyProps;
    return typeof p.className === "string" && p.className.includes("language-");
  });
  if (!el) return null;

  const props = el.props as AnyProps;
  const className = typeof props.className === "string" ? props.className : "";
  const m = className.match(/language-([a-z0-9+-]+)/i);
  return m?.[1] ?? null;
}

/** 要素ツリーからテキストだけ抽出 */
function extractText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const el = toAnyElement(node as ReactElement);
    const children = (el.props as AnyProps).children;
    return extractText(children);
  }
  return "";
}

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

/**
 * ✅ rehype-pretty-code 用：figure を再構成
 * - 「title（ファイル名）/ 言語 / Copy」を同じバーに統合
 * - “titleノードだけ”を除外して二重化防止
 */
type FigureProps = ComponentProps<"figure">;

function findDataAttrDeepOnElement(el: AnyElement, key: string): string | null {
  const p = el.props as AnyProps;
  const direct = p[key];

  if (direct !== undefined) {
    return typeof direct === "string"
      ? direct
      : direct != null
        ? String(direct)
        : null;
  }

  const children = (p as AnyProps).children;
  return findDataAttrDeep(children, key);
}

/** pre/code 直下 or 深い階層から data-language を拾う */
function findLanguageDataAttr(el: AnyElement, key: string): string | null {
  return findDataAttrDeepOnElement(el, key);
}

function Figure({ children, ...props }: FigureProps) {
  const record = props as Record<string, unknown>;

  const isPretty =
    record["data-rehype-pretty-code-fragment"] !== undefined ||
    record["data-rehype-pretty-code-figure"] !== undefined;

  if (!isPretty) return <figure {...props}>{children}</figure>;

  const nodes = Children.toArray(children);

  // title は “直下” に来る想定
  let titleEl: AnyElement | null = null;

  for (const n of nodes) {
    if (!isValidElement(n)) continue;
    const el = toAnyElement(n as ReactElement);
    const p = el.props as AnyProps;

    if (p["data-rehype-pretty-code-title"] !== undefined) {
      titleEl = el;
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
    ? findFirstElementDeep((preEl.props as AnyProps).children, (el) => {
        const t = el.type;
        const isCodeTag = typeof t === "string" && t === "code";
        const isCodeComp = t === Code;
        return isCodeTag || isCodeComp;
      })
    : null;

  const titleText = titleEl ? extractText(titleEl).trim() : "";

  const lang =
    (preEl ? findLanguageDataAttr(preEl, "data-language") : null) ||
    (codeEl ? findLanguageDataAttr(codeEl, "data-language") : null) ||
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
        <div data-rehype-pretty-code-title="">
          <div className="min-w-0 flex-1">
            {titleText ? (
              <span className="block truncate">{titleText}</span>
            ) : (
              <span className="sr-only">code block</span>
            )}
          </div>

          {lang ? <span data-language={lang}>{lang}</span> : null}

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
