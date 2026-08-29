import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ClipboardList, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/crm/empty-state";
import { PhoneLink } from "@/components/crm/phone-link";
import { ConditionBadge, RequirementStatusBadge } from "@/components/crm/condition-badge";
import { RequirementDialog } from "@/components/crm/requirement-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteRequirement, useRequirements } from "@/lib/crm/hooks";
import { PART_CONDITIONS, REQUIREMENT_STATUSES, type PartCondition, type RequirementListItem, type RequirementStatus } from "@/lib/crm/types";

export const Route = createFileRoute("/requirements")({ component: RequirementsPage });

function RequirementsPage() {
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<RequirementStatus | "all">("all");
  const [condition, setCondition] = useState<PartCondition | "all">("all");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRequirements({ q, status, condition, page });
  const del = useDeleteRequirement();
  const [edit, setEdit] = useState<RequirementListItem | null>(null);

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / 50));

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
            Parts requested
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Requirements</h1>
        </div>
        <p className="font-mono text-sm text-muted-foreground tabular-nums">{total} on file</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <form
          className="flex min-w-[200px] flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQ(draft);
            setPage(1);
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search part number, brand, model, dealer…"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <Select
          value={condition}
          onValueChange={(v) => {
            setCondition(v as PartCondition | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All conditions</SelectItem>
            {PART_CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as RequirementStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {REQUIREMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-8" />}
          title="No requirements yet"
          description="When a prospect gives you a part number, log it on the call or on their record — OEM, used, or aftermarket, with brand, model, and the price you quoted."
          action={
            <Button asChild>
              <Link to="/queue">Open call queue</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Part number</th>
                  <th className="px-3 py-3 font-medium">Condition</th>
                  <th className="px-3 py-3 font-medium">Brand</th>
                  <th className="px-3 py-3 font-medium">Model</th>
                  <th className="px-3 py-3 font-medium">Quoted</th>
                  <th className="px-3 py-3 font-medium">Qty</th>
                  <th className="px-3 py-3 font-medium">Prospect</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-secondary/60">
                    <td className="px-4 py-2.5 font-mono font-medium">{r.partNumber || "—"}</td>
                    <td className="px-3 py-2.5">
                      <ConditionBadge condition={r.condition} />
                    </td>
                    <td className="px-3 py-2.5">{r.brand || "—"}</td>
                    <td className="px-3 py-2.5">{r.model || "—"}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums">{r.priceQuoted ? `$${r.priceQuoted}` : "—"}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums">{r.quantity || "—"}</td>
                    <td className="px-3 py-2.5">
                      <Link to="/prospects/$id" params={{ id: r.prospectId }} className="font-medium hover:underline">
                        {r.businessName}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        <PhoneLink phone={r.phone} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <RequirementStatusBadge status={r.status} />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setEdit(r)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={async () => {
                          await del.mutateAsync(r.id);
                          toast.success("Requirement removed");
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 ? (
            <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="font-mono text-muted-foreground tabular-nums">
                {page} / {pages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {edit ? (
        <RequirementDialog
          open
          onOpenChange={(v) => {
            if (!v) setEdit(null);
          }}
          prospectId={edit.prospectId}
          prospectName={edit.businessName}
          requirement={edit}
        />
      ) : null}
    </div>
  );
}
