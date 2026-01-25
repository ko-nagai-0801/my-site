/* lib/mdx.ts */
import type { CompileOptions } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { getMDXComponents } from "@/mdx-components";

/**
 * ✅ MDX描画設定の単一ソース
 * - MDXRemote / compileMDX の両方で同じ設定を使う
 *
 * NOTE:
 * - `as const` を付けると配列が readonly 推論され、next-mdx-remote の型（Pluggable[]）に合わなくなる
 * - next-mdx-remote/rsc には SerializeOptions が export されていないため、@mdx-js/mdx の型から作る
 */
export type MdxOptions = Omit<
  CompileOptions,
  "outputFormat" | "providerImportSource"
> & {
  useDynamicImport?: boolean;
};

export const mdxOptions: MdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "append",
        properties: {
          className: ["heading-anchor"],
          "aria-label": "見出しへのリンク",
        },
        content: { type: "text", value: "#" },
      },
    ],
  ],
};

/**
 * ✅ MDX components も単一ソースに
 */
export const mdxComponents = getMDXComponents({});
