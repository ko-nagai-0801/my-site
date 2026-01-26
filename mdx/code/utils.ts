/* /mdx/code/utils.ts */
import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";

/**
 * ✅ React型定義の都合で isValidElement 後の props が unknown になりやすいので
 * 「children を持つ可能性がある props」として安全に扱う
 */
export type AnyProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
};
export type AnyElement = ReactElement<AnyProps>;

export function toAnyElement(el: ReactElement): AnyElement {
  return el as AnyElement;
}

export function getChildren(el: AnyElement): ReactNode {
  return (el.props as AnyProps).children;
}

/** 深さ優先で最初にマッチする要素を探す */
export function findFirstElementDeep(
  node: ReactNode,
  predicate: (el: AnyElement) => boolean
): AnyElement | null {
  const arr = Children.toArray(node);

  for (const n of arr) {
    if (!isValidElement(n)) continue;

    const el = toAnyElement(n as ReactElement);
    if (predicate(el)) return el;

    const found = findFirstElementDeep(getChildren(el), predicate);
    if (found) return found;
  }

  return null;
}

/** 深さ優先で data-* 属性値を探す */
export function findDataAttrDeep(node: ReactNode, key: string): string | null {
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
export function findLanguage(node: ReactNode): string | null {
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
export function extractText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const el = toAnyElement(node as ReactElement);
    return extractText(getChildren(el));
  }
  return "";
}
