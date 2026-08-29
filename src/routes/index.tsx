import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/crm/empty-state";
import { KpiCard } from "@/components/crm/kpi-card";
import { PhoneLink } from "@/components/crm/phone-link";
import { PriorityBadge } from "@/components/crm/priority-badge";
import { StatusBadge } from "@/components/crm/status-badge";
import { ConditionBadge, RequirementStatusBadge } from "@/components/crm/condition-badge";
import { useDashboard, useLoadSample } from "@/lib/crm/hooks";
import { formatRelativeDay, formatTimeShort } from "@/lib/crm/dates";
import type { Prospect, RequirementListItem } from "@/lib/crm/types";

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const sample = useLoadSample();

  if (isLoading || !data) {
    return (
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const empty = data.stats.total === 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
            CallDesk Statista Tractor Parts
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/import">Import Excel</Link>
          </Button>
          <Button asChild>
            <Link to="/queue">Open call queue</Link>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <KpiCard label="Total prospects" value={data.stats.total} />
        <KpiCard label="To call" value={data.stats.toCall} />
        <KpiCard label="Called today" value={data.stats.calledToday} />
        <KpiCard label="Callbacks today" value={data.stats.callbacksToday} />
        <KpiCard label="Requirements" value={data.stats.requirements} tone="hot" />
        <KpiCard label="Interested" value={data.stats.interested} tone="ok" />
      </section>

      {empty ? (
        <EmptyState
          icon={<Upload className="size-8" />}
          title="No prospects yet"
          description="Import an Excel workbook with dealers and part numbers. Every row becomes a prospect, and part details become requirements you can quote."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link to="/import">Import Excel</Link>
              </Button>
              <Button variant="outline" onClick={() => sample.mutate()} disabled={sample.isPending}>
                Load sample workspace
              </Button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          <Panel title="Today's call queue" className="xl:col-span-2">
            <ProspectMiniTable rows={data.todayQueue} empty="Nothing queued for today." />
          </Panel>
          <Panel title="Recent activity">
            {data.activity.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">No calls logged yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {data.activity.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.businessName}</p>
                      <p className="text-xs text-muted-foreground">{a.outcome}</p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {formatTimeShort(a.calledAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel
            title="Open requirements"
            className="xl:col-span-3"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/requirements">View all</Link>
              </Button>
            }
          >
            <RequirementMiniTable rows={data.openRequirements} />
          </Panel>
          <Panel title="Upcoming callbacks" className="xl:col-span-3">
            <ProspectMiniTable rows={data.upcoming} empty="No upcoming callbacks." />
          </Panel>
        </div>
      )}
    </div>
  );
}

function Panel({
  title,
  children,
  className,
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] ${className ?? ""}`}>
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

function RequirementMiniTable({ rows }: { rows: RequirementListItem[] }) {
  if (!rows.length) {
    return (
      <p className="px-4 py-8 text-sm text-muted-foreground">
        No open requirements. Log a part number from a call, or import a workbook with OEM / used / aftermarket columns.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-[11px] tracking-wide text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-2 font-medium">Part number</th>
            <th className="px-3 py-2 font-medium">Condition</th>
            <th className="px-3 py-2 font-medium">Brand / model</th>
            <th className="px-3 py-2 font-medium">Quoted</th>
            <th className="px-3 py-2 font-medium">Prospect</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-secondary/60">
              <td className="px-4 py-2.5 font-mono text-sm font-medium">{r.partNumber || "—"}</td>
              <td className="px-3 py-2.5">
                <ConditionBadge condition={r.condition} />
              </td>
              <td className="px-3 py-2.5">
                {[r.brand, r.model].filter(Boolean).join(" ") || "—"}
              </td>
              <td className="px-3 py-2.5 font-mono tabular-nums">{r.priceQuoted ? `$${r.priceQuoted}` : "—"}</td>
              <td className="px-3 py-2.5">
                <p className="font-medium">{r.businessName}</p>
                <PhoneLink phone={r.phone} className="text-xs" />
              </td>
              <td className="px-3 py-2.5">
                <RequirementStatusBadge status={r.status} />
              </td>
              <td className="px-3 py-2.5 text-right">
                <Button asChild size="sm" variant="ghost">
                  <Link to="/prospects/$id" params={{ id: r.prospectId }}>
                    Open
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProspectMiniTable({ rows, empty }: { rows: Prospect[]; empty: string }) {
  if (!rows.length) {
    return <p className="px-4 py-8 text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-[11px] tracking-wide text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-2 font-medium">Business</th>
            <th className="px-3 py-2 font-medium">Phone</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Priority</th>
            <th className="px-3 py-2 font-medium">Callback</th>
            <th className="px-3 py-2 font-medium">Attempts</th>
            <th className="px-3 py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t border-border hover:bg-secondary/60">
              <td className="px-4 py-2.5 font-medium">{p.businessName || "Untitled"}</td>
              <td className="px-3 py-2.5">
                <PhoneLink phone={p.phone} />
              </td>
              <td className="px-3 py-2.5">
                <StatusBadge status={p.status} />
              </td>
              <td className="px-3 py-2.5">
                <PriorityBadge priority={p.priority} />
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                {formatRelativeDay(p.nextCallbackAt)}
              </td>
              <td className="px-3 py-2.5 font-mono tabular-nums">{p.callAttempts}</td>
              <td className="px-3 py-2.5 text-right">
                <Button asChild size="sm" variant="ghost">
                  <Link to="/prospects/$id" params={{ id: p.id }}>
                    Open
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/queue">
                    <Phone className="size-3.5" />
                    Call
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
