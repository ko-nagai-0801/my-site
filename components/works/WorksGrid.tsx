/* components/works/WorksGrid.tsx */
import Link from "next/link";
import Image from "next/image";

import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltCard } from "@/components/ui/TiltCard";

export type WorkLike = {
  slug: string;
  meta: {
    title: string;
    summary: string;
    href?: string;
    repo?: string;
    note?: string;
    tags?: string[];
    image?: { src: string; alt: string };
  };
};

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4"
      aria-label={label}
    >
      {label} ↗
    </a>
  );
}

function WorkThumb({ src, alt, slug }: { src: string; alt: string; slug: string }) {
  return (
    <Link href={`/works/${slug}`} aria-label={`${alt} の詳細へ`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-panel">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>
    </Link>
  );
}

export function WorksGrid({ works }: { works: WorkLike[] }) {
  return (
    <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {works.map((w) => {
        const hasFooter = Boolean(w.meta.href || w.meta.repo || w.meta.note);

        return (
          <li key={w.slug} className="flex">
            <div className="h-full w-full">
              <TiltCard>
                <SpotlightCard
                  className={[
                    // ✅ カード高さを揃える（2列になる md 以上で固定）
                    "flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-panel p-5 transition hover:border-foreground/15 sm:p-6",
                    "md:h-[520px]",
                  ].join(" ")}
                >
                  {w.meta.image ? (
                    <WorkThumb src={w.meta.image.src} alt={w.meta.image.alt} slug={w.slug} />
                  ) : null}

                  {/* ✅ メイン領域：伸縮 + はみ出しを抑える */}
                  <div className="mt-5 flex min-h-0 flex-1 flex-col">
                    <h2 className="text-base font-medium tracking-tight">
                      <Link href={`/works/${w.slug}`} className="hover:underline underline-offset-4">
                        {w.meta.title}
                      </Link>
                    </h2>

                    {/* summary：最大3行でクランプ */}
                    <p
                      className={[
                        "mt-3 text-sm leading-relaxed text-muted overflow-hidden",
                        "[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]",
                      ].join(" ")}
                    >
                      {w.meta.summary}
                    </p>

                    {/* tags：最大3段くらいで抑える（高さが暴れないように） */}
                    {w.meta.tags?.length ? (
                      <div className="mt-4 max-h-[5.9rem] overflow-hidden">
                        <div className="flex flex-wrap gap-2">
                          {w.meta.tags.map((tag) => (
                            <Link
                              key={`${w.slug}-${tag}`}
                              href={`/tags/${encodeURIComponent(tag.trim())}`}
                              className="chip"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* ✅ フッター：下に揃える（リンク・補足の有無で高さがブレない） */}
                    <div className="mt-auto pt-5">
                      {w.meta.href || w.meta.repo ? (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-[0.16em] text-muted">
                          {w.meta.href ? <ExternalLink href={w.meta.href} label="Open site" /> : null}
                          {w.meta.repo ? <ExternalLink href={w.meta.repo} label="Repository" /> : null}
                        </div>
                      ) : null}

                      {/* note：最大2行でクランプ（長文で高さが暴れない） */}
                      {w.meta.note ? (
                        <p
                          className={[
                            "mt-2 text-xs leading-relaxed text-muted overflow-hidden",
                            "[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]",
                          ].join(" ")}
                        >
                          {w.meta.note}
                        </p>
                      ) : null}

                      {/* フッターが何も無いカードでも、mt-auto/pt の構造は維持（高さ揃え優先） */}
                      {!hasFooter ? <span className="sr-only"> </span> : null}
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
