/* components/mdx/MdxImage.tsx */
import Image from "next/image";
import type React from "react";

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  // MDX側で <img data-max="xl" data-ratio="1/1" data-fit="cover" /> みたいに渡せる
  "data-max"?: "md" | "lg" | "xl" | "full";
  "data-ratio"?: string; // 例: "16/10", "1/1", "4/3"
  "data-fit"?: "contain" | "cover";
};

const MAX_CLASS: Record<NonNullable<ImgProps["data-max"]>, string> = {
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-none",
};

export function MdxImage(props: ImgProps) {
  const {
    src,
    alt = "",
    title,
    className,
    width,
    height,
    "data-max": dataMax,
    "data-ratio": dataRatio,
    "data-fit": dataFit,
    ...rest
  } = props;

  const s = typeof src === "string" ? src : "";
  if (!s) return null;

  const caption = typeof title === "string" && title.trim() ? title.trim() : "";
  const maxClass = MAX_CLASS[dataMax ?? "lg"];
  const ratio = (dataRatio ?? "16/10").trim();
  const fit = dataFit === "cover" ? "object-cover" : "object-contain";

  // next/image は remote domain 制限があるので、http(s)/data は安全側で <img> fallback
  const isRemote = /^https?:\/\//.test(s) || /^data:/.test(s);

  return (
    <figure className={["my-10", className].filter(Boolean).join(" ")}>
      <div className={["mx-auto w-full", maxClass].join(" ")}>
        <div
          className={[
            "relative w-full overflow-hidden rounded-2xl border border-border bg-panel",
            `aspect-[${ratio}]`,
          ].join(" ")}
        >
          {isRemote ? (
            // fallback（remote許可が未設定でも崩れない）
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s}
              alt={alt}
              className={["h-full w-full", fit].join(" ")}
              loading="lazy"
              {...rest}
            />
          ) : (
            <Image
              src={s}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className={["transition-transform duration-300", fit].join(" ")}
              {...(typeof width === "number" ? { width } : {})}
              {...(typeof height === "number" ? { height } : {})}
              {...rest}
            />
          )}
        </div>

        {caption ? (
          <figcaption className="mt-3 text-xs tracking-[0.18em] text-muted-foreground">
            {caption}
          </figcaption>
        ) : null}
      </div>
    </figure>
  );
}
