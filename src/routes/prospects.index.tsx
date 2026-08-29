import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/crm/empty-state";
import { LogCallDialog } from "@/components/crm/log-call-dialog";
import { PhoneLink } from "@/components/crm/phone-link";
import { PriorityBadge } from "@/components/crm/priority-badge";
import { ProspectFormDialog } from "@/components/crm/prospect-form-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkUpdate, useDeleteProspects, useProspects } from "@/lib/crm/hooks";
import { formatDateTime } from "@/lib/crm/dates";
import { exportWorkbook } from "@/lib/crm/excel";
import { getAllProspects, listCalls } from "@/lib/crm/db";
import {
  FILTER_LABELS,
  PRIORITIES,
  STATUSES,
  type Priority,
  type Prospect,
  type ProspectFilter,
  type SortField,
  type Status,
} from "@/lib/crm/types";
import { formatNumber } from "@/lib/utils";

type Search = {
  q?: string;
  filter?: ProspectFilter;
  page?: number;
  sort?: SortField;
  dir?: "asc" | "desc";
};

export const Route = createFileRoute("/prospects/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    if (typeof s.q === "string") out.q = s.q;
    if (typeof s.filter === "string" && s.filter in FILTER_LABELS) {
      out.filter = s.filter as ProspectFilter;
    }
    if (Number(s.page) > 0) out.page = Number(s.page);
    if (typeof s.sort === "string") out.sort = s.sort as SortField;
    if (s.dir === "asc" || s.dir === "desc") out.dir = s.dir;
    return out;
  },
  component: ProspectsPage,
});

const FILTERS = Object.keys(FILTER_LABELS) as ProspectFilter[];

function ProspectsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const q = search.q ?? "";
  const filter = search.filter ?? "all";
  const page = search.page ?? 1;
  const sort = search.sort ?? "updatedAt";
  const dir = search.dir ?? "desc";
  const { data, isLoading } = useProspects({
    q,
    filter,
    page,
    sort,
    dir,
    pageSize: 50,
  });
  const bulk = useBulkUpdate();
  const del = useDeleteProspects();
  const [selected, setSelected] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [logProspect, setLogProspect] = useState<Prospect | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draftQ, setDraftQ] = useState(q);

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / 50));
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  function setSearch(patch: Partial<Search>) {
    void navigate({
      search: (prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }),
    });
  }

  function toggleSort(field: SortField) {
    if (sort === field) setSearch({ dir: dir === "asc" ? "desc" : "asc", sort: field });
    else setSearch({ sort: field, dir: "asc" });
  }

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  async function applyBulkStatus(status: Status) {
    if (!selected.length) return;
    await bulk.mutateAsync({ ids: selected, patch: { status } });
    toast.success("Status updated");
    setSelected([]);
  }
  async function applyBulkPriority(priority: Priority) {
    if (!selected.length) return;
    await bulk.mutateAsync({ ids: selected, patch: { priority } });
    toast.success("Priority updated");
    setSelected([]);
  }
  async function exportSelected() {
    const all = await getAllProspects();
    const set = new Set(selected);
    const prospects = selected.length ? all.filter((p) => set.has(p.id)) : all;
    const calls = await listCalls({ page: 1, pageSize: 10000 });
    await exportWorkbook({
      prospects,
      calls: calls.rows,
      stats: {
        "Total Prospects": prospects.length,
        Exported: prospects.length,
      },
    });
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Database
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Prospects</h1>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Add prospect
        </Button>
      </header>

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch({ q: draftQ, page: 1 });
        }}
      >
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={draftQ}
            onChange={(e) => setDraftQ(e.target.value)}
            placeholder="Search business, phone, email, city…"
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setSearch({ filter: f, page: 1 })}
            className={`h-8 rounded-md px-2.5 text-xs font-medium ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {selected.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-[var(--shadow-border)]">
          <span className="text-sm text-muted-foreground">{selected.length} selected</span>
          <Select onValueChange={(v) => applyBulkStatus(v as Status)}>
            <SelectTrigger className="h-8 w-40">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => applyBulkPriority(v as Priority)}>
            <SelectTrigger className="h-8 w-36">
              <SelectValue placeholder="Set priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="h-8 w-36"
            placeholder="Set source"
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                const source = (e.target as HTMLInputElement).value.trim();
                if (!source || !selected.length) return;
                await bulk.mutateAsync({ ids: selected, patch: { source } });
                toast.success("Source updated");
                setSelected([]);
              }
            }}
          />
          <Button size="sm" variant="outline" onClick={() => exportSelected()}>
            Export selected
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : total === 0 ? (
        <EmptyState
          title="No matching prospects"
          description="Adjust filters or import an Excel workbook."
          action={
            <Button asChild>
              <Link to="/import">Import Excel</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="w-10 px-3 py-2">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={(v) =>
                        setSelected(v ? rows.map((r) => r.id) : [])
                      }
                    />
                  </th>
                  {[
                    ["businessName", "Business"],
                    ["phone", "Phone"],
                    ["contactName", "Contact"],
                    ["city", "Location"],
                    ["status", "Status"],
                    ["priority", "Priority"],
                    ["lastCalledAt", "Last called"],
                    ["nextCallbackAt", "Callback"],
                    ["callAttempts", "Attempts"],
                  ].map(([field, label]) => (
                    <th key={field} className="px-3 py-2 font-medium">
                      <button type="button" onClick={() => toggleSort(field as SortField)}>
                        {label}
                        {sort === field ? (dir === "asc" ? " ↑" : " ↓") : ""}
                      </button>
                    </th>
                  ))}
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-3 py-2">
                      <Checkbox
                        checked={selectedSet.has(p.id)}
                        onCheckedChange={(v) =>
                          setSelected((cur) =>
                            v ? [...cur, p.id] : cur.filter((id) => id !== p.id),
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-2 font-medium">
                      <Link to="/prospects/$id" params={{ id: p.id }} className="hover:underline">
                        {p.businessName || "Untitled"}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <PhoneLink phone={p.phone} />
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{p.contactName || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {[p.city, p.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-3 py-2">
                      <PriorityBadge priority={p.priority} />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {formatDateTime(p.lastCalledAt)}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {formatDateTime(p.nextCallbackAt)}
                    </td>
                    <td className="px-3 py-2 font-mono tabular-nums">{p.callAttempts}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button asChild size="sm" variant="ghost">
                          <a href={p.phone ? `tel:${p.phone}` : undefined}>Call</a>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setLogProspect(p)}>
                          Log
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/prospects/$id" params={{ id: p.id }}>
                            Open
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-3 py-2 text-sm text-muted-foreground">
            <span>
              {formatNumber(total)} prospects · page {page} of {pages}
            </span>
            <div className="flex gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setSearch({ page: page - 1 })}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={page >= pages}
                onClick={() => setSearch({ page: page + 1 })}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <ProspectFormDialog open={addOpen} onOpenChange={setAddOpen} />
      <LogCallDialog
        prospect={logProspect}
        open={!!logProspect}
        onOpenChange={(v) => !v && setLogProspect(null)}
      />
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.length} prospects?</AlertDialogTitle>
            <AlertDialogDescription>
              Call history for these records will also be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={async () => {
                await del.mutateAsync(selected);
                toast.success("Prospects deleted");
                setSelected([]);
                setConfirmDelete(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
