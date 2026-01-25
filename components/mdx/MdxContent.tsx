/* components/mdx/MdxContent.tsx */
import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents, mdxOptions } from "@/lib/mdx";

type Props = {
  source: string;
};

export default function MdxContent({ source }: Props) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions,
      }}
      components={mdxComponents}
    />
  );
}
