import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/lib/crm/types";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const variant = priority === "Hot" ? "hot" : priority === "Warm" ? "warm" : "cold";
  return <Badge variant={variant}>{priority}</Badge>;
}
