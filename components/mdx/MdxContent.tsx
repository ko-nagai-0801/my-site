/* components/mdx/MdxContent.tsx */
import { MDXRemote } from "next-mdx-remote/rsc";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { getMDXComponents } from "@/mdx-components";

type Props = {
  source: string;
};

export default function MdxContent({ source }: Props) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
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
        },
      }}
      // ✅ ここが重要：mdx-components を適用する
      components={getMDXComponents({})}
    />
  );
}
