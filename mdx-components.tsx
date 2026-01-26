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
