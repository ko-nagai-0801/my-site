// components/works/WorksGrid.tsx
import Link from "next/link";
import Image from "next/image";

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
    <Link
      href={`/works/${slug}`}
      aria-label={`${alt} の詳細へ`}
      className="group block"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-panel">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 720px, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>
    </Link>
  );
}

export function WorksGrid({ works }: { works: WorkLike[] }) {
  return (
    <ul className="space-y-4">
      {works.map((w) => (
        <li
          key={w.slug}
          className="rounded-2xl border border-border bg-panel p-5 transition hover:border-foreground/15 sm:p-6"
        >
          {w.meta.image ? (
            <WorkThumb src={w.meta.image.src} alt={w.meta.image.alt} slug={w.slug} />
          ) : null}

          <h2 className="mt-5 text-base font-medium tracking-tight">
            <Link href={`/works/${w.slug}`} className="hover:underline underline-offset-4">
              {w.meta.title}
            </Link>
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted">{w.meta.summary}</p>

          {w.meta.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
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
          ) : null}

          {(w.meta.href || w.meta.repo || w.meta.note) ? (
            <div className="mt-5 space-y-2">
              {(w.meta.href || w.meta.repo) ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-[0.16em] text-muted">
                  {w.meta.href ? <ExternalLink href={w.meta.href} label="Open site" /> : null}
                  {w.meta.repo ? <ExternalLink href={w.meta.repo} label="Repository" /> : null}
                </div>
              ) : null}

              {w.meta.note ? (
                <p className="text-xs leading-relaxed text-muted">{w.meta.note}</p>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
