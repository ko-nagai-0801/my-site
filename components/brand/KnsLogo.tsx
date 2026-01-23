/* components/brand/KnsLogo.tsx */
import { KnsMark } from "@/components/brand/KnsMark";

type Props = {
  className?: string;
};

export function KnsLogo({ className }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <KnsMark className="h-7 w-7 shrink-0" aria-hidden="true" />
      <div className="leading-none">
        <div className="text-[12px] sm:text-sm font-semibold tracking-[0.18em] text-foreground/90">
          Kou Nagai Studio
        </div>
        <div className="mt-1 text-[10px] tracking-[0.28em] text-muted-foreground">
          K N S
        </div>
      </div>
    </div>
  );
}
