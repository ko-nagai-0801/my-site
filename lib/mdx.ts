/* lib/mdx.ts */
import type { CompileOptions } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type CharsElement,
  type LineElement,
} from "rehype-pretty-code";
import type { Text } from "hast";

import { getMDXComponents } from "@/mdx-components";
import { MdxImage } from "@/components/mdx/MdxImage";

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

    /**
     * ✅ Code block UX: 行番号 / ファイル名(title) / ハイライト
     * - Shiki によるシンタックスハイライト
     * - showLineNumbers / title / {1,3-5} などのメタを利用
     */
    [
      rehypePrettyCode,
      {
        theme: {
          dark: "github-dark",
          light: "github-light",
        },
        keepBackground: false,

        // 空行が潰れないように（行番号の見た目も安定）
        onVisitLine(element: LineElement) {
          if (element.children.length === 0) {
            element.children = [{ type: "text", value: " " } as Text];
          }
        },

        // 行ハイライト時に class を付ける（CSSで装飾）
        onVisitHighlightedLine(element: LineElement) {
          element.properties.className = [
            ...(element.properties.className ?? []),
            "line--highlight",
          ];
        },

        // 単語ハイライト時に class を付ける（必要になったらCSS追加）
        // ✅ _id は使わないが、rehype-pretty-code のシグネチャに合わせて受ける
        onVisitHighlightedChars(element: CharsElement, _id?: string) {
          element.properties.className = [
            ...(element.properties.className ?? []),
            "word--highlight",
          ];
        },
      },
    ],
  ],
};

/**
 * ✅ MDX components も単一ソースに
 * - 既存の components は維持
 * - img だけ MdxImage（Next/Image）へ差し替え
 */
const baseComponents = getMDXComponents({});

export const mdxComponents = {
  ...baseComponents,
  img: MdxImage, // ← ここで上書き
};
