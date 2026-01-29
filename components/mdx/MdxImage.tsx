/* components/mdx/MdxImage.tsx */
import Image from "next/image";

type Ratio = "16/10" | "16/9" | "1/1" | "auto";
type MaxWidth = "sm" | "md" | "lg" | "xl" | "full";

export type MdxImageProps = {
  src: string;
  alt: string;

  caption?: string;

  /**
   * - "16/10" | "16/9" | "1/1": 固定比率（crop あり / fill）
   * - "auto": 画像の比率をそのまま（width/height を使う / crop なし）
   */
  ratio?: Ratio;

  maxWidth?: MaxWidth;

  priority?: boolean;
  sizes?: string;

  /**
   * ratio="auto" のときのみ使用（未指定なら 1600x1000 で仮の比率を作る）
   * ※ 正確にしたい場合は実画像の比率に合わせる
   */
  width?: number;
  height?: number;
};

const maxWClass: Record<MaxWidth, string> = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-none",
};

const ratioClass: Record<Exclude<Ratio, "auto">, string> = {
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-[16/9]",
  "1/1": "aspect-square",
};

export function MdxImage({
  src,
  alt,
  caption,
  ratio = "16/10",
  maxWidth = "lg",
  priority = false,
  sizes = "(min-width: 1024px) 768px, 100vw",
  width = 1600,
  height = 1000,
}: MdxImageProps) {
  const isAuto = ratio === "auto";

  return (
    <figure className={["mx-auto my-8 w-full", maxWClass[maxWidth]].join(" ")}>
      <div
        className={[
          "overflow-hidden rounded-2xl border border-border bg-panel",
          isAuto ? "" : "relative",
          isAuto ? "" : ratioClass[ratio],
        ].join(" ")}
      >
        {isAuto ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            sizes={sizes}
            className="h-auto w-full"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        )}
      </div>

      {caption ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
