import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/crm/empty-state";
import { PhoneLink } from "@/components/crm/phone-link";
import { PriorityBadge } from "@/components/crm/priority-badge";
import { StatusBadge } from "@/components/crm/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { completeCallback, rescheduleCallback } from "@/lib/crm/db";
import { useCallbacks, useInvalidateCrm } from "@/lib/crm/hooks";
import { datetimeLocalValue, formatDateTime, formatTime, fromDatetimeLocal } from "@/lib/crm/dates";
import type { Prospect } from "@/lib/crm/types";

export const Route = createFileRoute("/callbacks")({ component: CallbacksPage });

function CallbacksPage() {
  const { data, isLoading } = useCallbacks();
  const invalidate = useInvalidateCrm();
  const [reschedule, setReschedule] = useState<Prospect | null>(null);
  const [when, setWhen] = useState("");

  if (isLoading || !data) return <Skeleton className="h-96 rounded-xl" />;

  const groups: Array<[string, Prospect[]]> = [
    ["Overdue", data.overdue],
    ["Today", data.today],
    ["Tomorrow", data.tomorrow],
    ["Upcoming", data.upcoming],
  ];
  const empty = groups.every(([, rows]) => rows.length === 0);

  async function complete(p: Prospect) {
    await completeCallback(p.id);
    toast.success("Callback completed");
    await invalidate();
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Schedule</p>
        <h1 className="text-2xl font-semibold tracking-tight">Callbacks</h1>
      </header>

      {empty ? (
        <EmptyState title="No callbacks scheduled" description="Log a call and set a callback to fill this list." />
      ) : (
        groups.map(([title, rows]) =>
          rows.length ? (
            <section key={title} className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
              <header className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-sm font-medium">{title}</h2>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{rows.length}</span>
              </header>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th className="px-4 py-2 font-medium">Time</th>
                      <th className="px-3 py-2 font-medium">Business</th>
                      <th className="px-3 py-2 font-medium">Phone</th>
                      <th className="px-3 py-2 font-medium">Contact</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Priority</th>
                      <th className="px-3 py-2 font-medium">Last note</th>
                      <th className="px-3 py-2 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p) => (
                      <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                        <td className="px-4 py-2.5 font-mono text-xs">{title === "Upcoming" ? formatDateTime(p.nextCallbackAt) : formatTime(p.nextCallbackAt)}</td>
                        <td className="px-3 py-2.5 font-medium">{p.businessName}</td>
                        <td className="px-3 py-2.5">
                          <PhoneLink phone={p.phone} />
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{p.contactName || "—"}</td>
                        <td className="px-3 py-2.5">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-3 py-2.5">
                          <PriorityBadge priority={p.priority} />
                        </td>
                        <td className="max-w-48 truncate px-3 py-2.5 text-xs text-muted-foreground">
                          {p.remarks || "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex justify-end gap-1">
                            <Button asChild size="sm" variant="ghost">
                              <a href={p.phone ? `tel:${p.phone}` : undefined}>Call</a>
                            </Button>
                            <Button asChild size="sm" variant="ghost">
                              <Link to="/prospects/$id" params={{ id: p.id }}>
                                Open
                              </Link>
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => complete(p)}>
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setReschedule(p);
                                setWhen(datetimeLocalValue(p.nextCallbackAt));
                              }}
                            >
                              Reschedule
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null,
        )
      )}

      <Dialog open={!!reschedule} onOpenChange={(v) => !v && setReschedule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule callback</DialogTitle>
          </DialogHeader>
          <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReschedule(null)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const iso = fromDatetimeLocal(when);
                if (!iso || !reschedule) {
                  toast.error("Choose a valid date and time.");
                  return;
                }
                await rescheduleCallback(reschedule.id, iso);
                toast.success("Callback rescheduled");
                setReschedule(null);
                await invalidate();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
