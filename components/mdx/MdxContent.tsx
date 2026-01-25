/* components/mdx/MdxContent.tsx */
import { renderMdx } from "@/lib/render-mdx";

type Props = {
  source: string;
};

export default async function MdxContent({ source }: Props) {
  const content = await renderMdx(source);
  return <>{content}</>;
}
