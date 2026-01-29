// components/mdx/MdxImage.tsx
import Image from "next/image";

type Ratio = "16/10" | "16/9" | "1/1" | "auto";
type MaxWidth = "sm" | "md" | "lg" | "xl" | "full";

export type MdxImageProps = {
  src: string;
  alt: string;
  caption?: string;
  ratio?: Ratio;
  maxWidth?: MaxWidth;
  priority?: boolean;
  sizes?: string;
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
}: MdxImageProps) {
  return (
    <figure className={["mx-auto my-8 w-full", maxWClass[maxWidth]].join(" ")}>
      <div
        className={[
          "relative overflow-hidden rounded-2xl border border-border bg-panel",
          ratio === "auto" ? "" : ratioClass[ratio],
        ].join(" ")}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>

      {caption ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
