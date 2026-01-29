/* /mdx-components.tsx */
import type { MDXComponents } from "mdx/types";

import { Code } from "@/mdx/code/Code";
import { Figure } from "@/mdx/code/Figure";
import { Pre } from "@/mdx/code/Pre";
import { A } from "@/mdx/components/A";
import { Blockquote } from "@/mdx/components/Blockquote";
import { Hr } from "@/mdx/components/Hr";
import { Img } from "@/mdx/components/Img";
import { Table, Td, Th } from "@/mdx/components/Table";

import { MdxImage } from "@/components/mdx/MdxImage";

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    // ✅ HTMLタグの差し替え（既存どおり）
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

    // ✅ MDX内で <MdxImage /> を使えるように公開
    MdxImage,
  };
}
