import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/crm/types";

const MAP: Record<Status, ComponentProps<typeof Badge>["variant"]> = {
  New: "new",
  "To Call": "call",
  Called: "called",
  Callback: "callback",
  Interested: "interested",
  "Follow-up": "follow",
  Qualified: "qualified",
  Won: "won",
  Lost: "lost",
  "Not Interested": "lost",
  "Do Not Call": "dnc",
};

export function StatusBadge({ status }: { status: Status }) {
  return <Badge variant={MAP[status]}>{status}</Badge>;
}
