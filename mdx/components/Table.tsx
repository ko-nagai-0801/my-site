/* /mdx/components/Table.tsx */
import type { ComponentProps } from "react";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TableProps = ComponentProps<"table">;
type ThProps = ComponentProps<"th">;
type TdProps = ComponentProps<"td">;

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table
        className={cx(
          "w-full border-collapse rounded-xl border border-white/10 text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function Th({ className, ...props }: ThProps) {
  return (
    <th
      className={cx(
        "border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold",
        className
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: TdProps) {
  return (
    <td
      className={cx("border border-white/10 px-3 py-2 align-top", className)}
      {...props}
    />
  );
}

