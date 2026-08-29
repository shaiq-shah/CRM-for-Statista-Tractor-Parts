import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PartCondition, RequirementStatus } from "@/lib/crm/types";

const CONDITION: Record<PartCondition, string> = {
  OEM: "bg-oem/12 text-oem",
  Used: "bg-used/15 text-used",
  Aftermarket: "bg-aftermarket/12 text-aftermarket",
};

export function ConditionBadge({ condition }: { condition: PartCondition }) {
  return <span className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", CONDITION[condition])}>{condition}</span>;
}

export function RequirementStatusBadge({ status }: { status: RequirementStatus }) {
  const variant =
    status === "Won"
      ? "won"
      : status === "Lost"
        ? "lost"
        : status === "Quoted"
          ? "callback"
          : status === "Ordered"
            ? "qualified"
            : "new";
  return <Badge variant={variant}>{status}</Badge>;
}
