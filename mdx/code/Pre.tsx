/* /mdx/code/Pre.tsx */
import type { ComponentProps } from "react";

import CopyButton from "@/components/mdx/CopyButton";
import { extractText, findDataAttrDeep, findLanguage } from "@/mdx/code/utils";

type PreProps = ComponentProps<"pre">;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Pre({ className, children, ...props }: PreProps) {
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
