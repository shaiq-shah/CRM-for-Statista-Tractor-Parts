import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/crm/empty-state";
import { PhoneLink } from "@/components/crm/phone-link";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalls } from "@/lib/crm/hooks";
import { formatDateTime } from "@/lib/crm/dates";
import { formatNumber } from "@/lib/utils";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCalls({ q, page, pageSize: 50 });
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / 50));

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Activity</p>
        <h1 className="text-2xl font-semibold tracking-tight">Call history</h1>
      </header>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search notes, outcomes, businesses…"
          />
        </div>
      </form>
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : total === 0 ? (
        <EmptyState title="No calls logged" description="Every call is stored permanently and never overwritten." />
      ) : (
        <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Business</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 font-medium">Contact</th>
                  <th className="px-3 py-2 font-medium">Outcome</th>
                  <th className="px-3 py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {data?.rows.map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-2.5 font-mono text-xs whitespace-nowrap">
                      {formatDateTime(c.calledAt)}
                    </td>
                    <td className="px-3 py-2.5 font-medium">
                      <Link to="/prospects/$id" params={{ id: c.prospectId }} className="hover:underline">
                        {c.businessName}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5">
                      <PhoneLink phone={c.phone} />
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.contactName || "—"}</td>
                    <td className="px-3 py-2.5">{c.outcome}</td>
                    <td className="max-w-sm truncate px-3 py-2.5 text-muted-foreground">{c.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-3 py-2 text-sm text-muted-foreground">
            <span>
              {formatNumber(total)} records · page {page} of {pages}
            </span>
            <div className="flex gap-1">
              <Button size="icon-sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button size="icon-sm" variant="ghost" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
