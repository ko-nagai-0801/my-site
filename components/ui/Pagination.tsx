/* components/ui/Pagination.tsx */
import Link from "next/link";

type Item = number | "ellipsis";

const buildItems = (current: number, total: number): Item[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: Item[] = [];
  const push = (x: Item) => items.push(x);

  push(1);

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) push("ellipsis");

  for (let p = left; p <= right; p++) push(p);

  if (right < total - 1) push("ellipsis");

  push(total);

  // 連続 ellipsis の整理
  return items.filter((x, i) => !(x === "ellipsis" && items[i - 1] === "ellipsis"));
};

export function Pagination({
  current,
  total,
  hrefForPage,
  className = "",
}: {
  current: number;
  total: number;
  hrefForPage: (page: number) => string;
  className?: string;
}) {
  if (total <= 1) return null;

  const items = buildItems(current, total);

  const prevHref = current > 1 ? hrefForPage(current - 1) : null;
  const nextHref = current < total ? hrefForPage(current + 1) : null;

  return (
    <nav aria-label="Pagination" className={className}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {prevHref ? (
          <Link href={prevHref} className="nav-link" aria-label="Previous page">
            ← Prev
          </Link>
        ) : (
          <span className="text-xs tracking-[0.22em] uppercase text-muted opacity-50">
            ← Prev
          </span>
        )}

        <ul className="flex flex-wrap items-center justify-center gap-2">
          {items.map((it, idx) =>
            it === "ellipsis" ? (
              <li
                key={`e-${idx}`}
                className="px-2 text-sm text-muted opacity-70"
                aria-hidden="true"
              >
                …
              </li>
            ) : (
              <li key={it}>
                {it === current ? (
                  <span
                    aria-current="page"
                    aria-label={`Page ${it}`}
                    className="inline-flex min-w-9 items-center justify-center rounded-md border border-border bg-panel px-3 py-1 text-sm font-semibold"
                  >
                    {it}
                  </span>
                ) : (
                  <Link
                    href={hrefForPage(it)}
                    aria-label={`Page ${it}`}
                    className="inline-flex min-w-9 items-center justify-center rounded-md border border-border bg-panel px-3 py-1 text-sm hover:opacity-80"
                  >
                    {it}
                  </Link>
                )}
              </li>
            )
          )}
        </ul>

        {nextHref ? (
          <Link href={nextHref} className="nav-link" aria-label="Next page">
            Next →
          </Link>
        ) : (
          <span className="text-xs tracking-[0.22em] uppercase text-muted opacity-50">
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}
