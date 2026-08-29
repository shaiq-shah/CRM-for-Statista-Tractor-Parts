import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Phone, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/crm/empty-state";
import { LogCallDialog } from "@/components/crm/log-call-dialog";
import { PhoneLink } from "@/components/crm/phone-link";
import { PriorityBadge } from "@/components/crm/priority-badge";
import { StatusBadge } from "@/components/crm/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueue, useQueueSession, useProspectRequirements } from "@/lib/crm/hooks";
import { displayPhone } from "@/lib/crm/normalize";
import { formatDateTime } from "@/lib/crm/dates";
import { ConditionBadge } from "@/components/crm/condition-badge";

export const Route = createFileRoute("/queue")({ component: QueuePage });

function QueuePage() {
  const { data = [], isLoading } = useQueue();
  const skip = useQueueSession((s) => s.skip);
  const reset = useQueueSession((s) => s.reset);
  const [logOpen, setLogOpen] = useState(false);
  const current = data[0] ?? null;
  const upcoming = data.slice(1, 8);
  const remaining = data.length;
  const { data: reqs = [] } = useProspectRequirements(current?.id);

  const subtitle = useMemo(() => {
    if (!current) return "";
    return [current.city, current.state].filter(Boolean).join(", ");
  }, [current]);

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;

  if (!current) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Call queue</h1>
        <EmptyState
          icon={<Phone className="size-8" />}
          title="Queue is clear"
          description="No more prospects to call right now. Import a list, or reset skipped records."
          action={
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/import">Import Excel</Link>
              </Button>
              <Button variant="outline" onClick={() => reset()}>
                Reset skipped
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Next prospect
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Call queue</h1>
        </div>
        <p className="font-mono text-sm text-muted-foreground tabular-nums">{remaining} remaining</p>
      </header>

      <section className="rounded-xl bg-card px-6 py-8 text-center shadow-[var(--shadow-border)]">
        <p className="text-xs text-muted-foreground">{subtitle || current.leadType || "Prospect"}</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">{current.businessName}</h2>
        <p className="mt-3 font-mono text-2xl tracking-wide">{displayPhone(current.phone)}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <StatusBadge status={current.status} />
          <PriorityBadge priority={current.priority} />
          <span className="text-xs text-muted-foreground">Attempts {current.callAttempts}</span>
        </div>
        {current.contactName ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {current.contactName}
            {current.contactTitle ? ` · ${current.contactTitle}` : ""}
          </p>
        ) : null}
        {current.remarks ? (
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">{current.remarks}</p>
        ) : null}
        {current.nextCallbackAt ? (
          <p className="mt-2 text-xs text-warm">Callback {formatDateTime(current.nextCallbackAt)}</p>
        ) : null}
        {reqs.length > 0 ? (
          <div className="mx-auto mt-5 max-w-lg space-y-2 text-left">
            <p className="text-center text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
              Open requirements
            </p>
            {reqs
              .filter((r) => r.status === "Open" || r.status === "Quoted")
              .slice(0, 4)
              .map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-2 rounded-md bg-secondary px-3 py-2">
                  <div>
                    <p className="font-mono text-sm font-medium">{r.partNumber || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {[r.brand, r.model].filter(Boolean).join(" ")}
                      {r.priceQuoted ? ` · $${r.priceQuoted}` : ""}
                    </p>
                  </div>
                  <ConditionBadge condition={r.condition} />
                </div>
              ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {current.phone ? (
            <Button asChild size="lg">
              <a href={`tel:${current.phone}`}>
                <Phone className="size-4" />
                Call
              </a>
            </Button>
          ) : (
            <Button size="lg" disabled>
              No phone
            </Button>
          )}
          <Button size="lg" variant="secondary" onClick={() => setLogOpen(true)}>
            Log result
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => skip(current.id)}
          >
            <SkipForward className="size-4" />
            Skip
          </Button>
        </div>
        <div className="mt-4">
          <Button asChild variant="link">
            <Link to="/prospects/$id" params={{ id: current.id }}>
              Open full record
            </Link>
          </Button>
        </div>
      </section>

      {upcoming.length > 0 ? (
        <section className="rounded-xl bg-card shadow-[var(--shadow-border)]">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium">Up next</h2>
          </header>
          <ul className="divide-y divide-border">
            {upcoming.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.businessName}</p>
                  <PhoneLink phone={p.phone} className="text-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={p.priority} />
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <LogCallDialog
        prospect={current}
        open={logOpen}
        onOpenChange={setLogOpen}
        onSaved={() => skip(current.id)}
        onSavedNext={() => skip(current.id)}
      />
    </div>
  );
}
