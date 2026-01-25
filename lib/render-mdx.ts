/* lib/render-mdx.ts */
import "server-only";

import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

import { mdxComponents, mdxOptions } from "@/lib/mdx";

/**
 * ✅ MDX描画呼び出しの単一ソース
 * - Blog / Works / 任意のMDX描画で共通利用
 */
export async function renderMdx(source: string): Promise<ReactNode> {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions,
    },
  });

  return content;
}
