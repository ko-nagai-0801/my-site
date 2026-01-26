/* /mdx/code/Figure.tsx */
import type { ComponentProps } from "react";
import { Children, isValidElement } from "react";

import CopyButton from "@/components/mdx/CopyButton";
import { Code } from "@/mdx/code/Code";
import { Pre } from "@/mdx/code/Pre";
import {
  type AnyElement,
  type AnyProps,
  extractText,
  findDataAttrDeep,
  findFirstElementDeep,
  findLanguage,
  getChildren,
  toAnyElement,
} from "@/mdx/code/utils";

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

  return findDataAttrDeep(getChildren(el), key);
}

/** pre/code 直下 or 深い階層から data-language を拾う */
function findLanguageDataAttr(el: AnyElement, key: string): string | null {
  return findDataAttrDeepOnElement(el, key);
}

export function Figure({ children, ...props }: FigureProps) {
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
    const el = toAnyElement(n as AnyElement);
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
    ? findFirstElementDeep(getChildren(preEl), (el) => {
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
