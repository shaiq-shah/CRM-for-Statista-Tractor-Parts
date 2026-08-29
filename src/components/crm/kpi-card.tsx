import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "default" | "warn" | "ok" | "hot";
}) {
  return (
    <div className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">{label}</p>
      <p
        className={cn(
          "mt-2 font-mono text-3xl leading-none font-medium tabular-nums",
          tone === "warn" && "text-warm",
          tone === "ok" && "text-ok",
          tone === "hot" && "text-hot",
        )}
      >
        {formatNumber(value)}
      </p>
    </div>
  );
}
