import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Globe, Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogCallDialog } from "@/components/crm/log-call-dialog";
import { PhoneLink } from "@/components/crm/phone-link";
import { ProspectFormDialog } from "@/components/crm/prospect-form-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import { ConditionBadge, RequirementStatusBadge } from "@/components/crm/condition-badge";
import { RequirementDialog } from "@/components/crm/requirement-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDeleteProspects, useProspect, useProspectCalls, useProspectRequirements, useUpdateProspect } from "@/lib/crm/hooks";
import { formatDateTime, fromDatetimeLocal, datetimeLocalValue } from "@/lib/crm/dates";
import { PRIORITIES, STATUSES, type Priority, type Requirement, type Status } from "@/lib/crm/types";

export const Route = createFileRoute("/prospects/$id")({
  component: ProspectDetailPage,
});

function ProspectDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: prospect, isLoading } = useProspect(id);
  const { data: calls = [] } = useProspectCalls(id);
  const { data: requirements = [] } = useProspectRequirements(id);
  const update = useUpdateProspect();
  const del = useDeleteProspects();
  const [logOpen, setLogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cbOpen, setCbOpen] = useState(false);
  const [cbValue, setCbValue] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [reqOpen, setReqOpen] = useState(false);
  const [editReq, setEditReq] = useState<Requirement | null>(null);

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (!prospect) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Prospect not found</h1>
        <Button asChild variant="outline">
          <Link to="/prospects">Back to prospects</Link>
        </Button>
      </div>
    );
  }

  const location = [prospect.address, prospect.city, prospect.state, prospect.zip]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/prospects" className="text-xs text-muted-foreground hover:text-foreground">
            Prospects
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{prospect.businessName || "Untitled"}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {prospect.phone ? (
            <Button asChild>
              <a href={`tel:${prospect.phone}`}>
                <Phone className="size-4" />
                Call now
              </a>
            </Button>
          ) : null}
          <Button variant="secondary" onClick={() => setLogOpen(true)}>
            Log call
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCbValue(datetimeLocalValue(prospect.nextCallbackAt));
              setCbOpen(true);
            }}
          >
            Schedule callback
          </Button>
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button onClick={() => setReqOpen(true)}>
            <Plus className="size-4" />
            Add requirement
          </Button>
        </div>
      </div>

      <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <div className="grid gap-3 sm:grid-cols-2">
          <Fact icon={<Phone className="size-4" />} label="Phone">
            <PhoneLink phone={prospect.phone} />
            {prospect.alternatePhone ? (
              <span className="block text-xs text-muted-foreground">
                Alt <PhoneLink phone={prospect.alternatePhone} />
              </span>
            ) : null}
          </Fact>
          <Fact icon={<Mail className="size-4" />} label="Email">
            {prospect.email ? (
              <a href={`mailto:${prospect.email}`} className="hover:underline">
                {prospect.email}
              </a>
            ) : (
              "—"
            )}
          </Fact>
          <Fact icon={<Globe className="size-4" />} label="Website">
            {prospect.website ? (
              <a
                href={prospect.website.startsWith("http") ? prospect.website : `https://${prospect.website}`}
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {prospect.website}
              </a>
            ) : (
              "—"
            )}
          </Fact>
          <Fact icon={<MapPin className="size-4" />} label="Location">
            {location || "—"}
          </Fact>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select
              value={prospect.status}
              onValueChange={(v) => update.mutate({ id: prospect.id, patch: { status: v as Status } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Priority</Label>
            <Select
              value={prospect.priority}
              onValueChange={(v) => update.mutate({ id: prospect.id, patch: { priority: v as Priority } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next callback</p>
            <p className="mt-2 font-mono text-sm">{formatDateTime(prospect.nextCallbackAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Call attempts</p>
            <p className="mt-2 font-mono text-sm tabular-nums">{prospect.callAttempts}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Current remarks</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {prospect.remarks || "No remarks yet."}
          </p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Next action</h2>
          <p className="mt-2 text-sm text-muted-foreground">{prospect.nextAction || "—"}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            {prospect.contactName || "No contact"}
            {prospect.contactTitle ? ` · ${prospect.contactTitle}` : ""}
            {prospect.source ? ` · ${prospect.source}` : ""}
          </p>
        </div>
      </section>

      {Object.keys(prospect.extra).length > 0 ? (
        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Other Excel columns</h2>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            {Object.entries(prospect.extra).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">{k}</dt>
                <dd className="text-sm">{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="rounded-xl bg-card shadow-[var(--shadow-border)]">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium">Requirements</h2>
          <Button size="sm" variant="outline" onClick={() => setReqOpen(true)}>
            <Plus className="size-3.5" />
            Add
          </Button>
        </header>
        {requirements.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No part requirements yet. Add the part number they asked for — OEM, used, or aftermarket — with brand, model, and the price you quoted.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {requirements.map((r) => (
              <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-medium">{r.partNumber || "No part number"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[r.brand, r.model].filter(Boolean).join(" ") || "Brand / model not set"}
                    {r.priceQuoted ? ` · $${r.priceQuoted}` : ""}
                    {r.quantity ? ` · qty ${r.quantity}` : ""}
                  </p>
                  {r.notes ? <p className="mt-1 text-xs text-muted-foreground">{r.notes}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <ConditionBadge condition={r.condition} />
                  <RequirementStatusBadge status={r.status} />
                  <Button size="sm" variant="ghost" onClick={() => setEditReq(r)}>
                    Edit
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl bg-card shadow-[var(--shadow-border)]">
        <header className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium">Call history</h2>
        </header>
        {calls.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">No calls logged for this prospect.</p>
        ) : (
          <ol className="divide-y divide-border">
            {calls.map((c) => (
              <li key={c.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs text-muted-foreground">{formatDateTime(c.calledAt)}</p>
                  <StatusChip outcome={c.outcome} />
                </div>
                {c.contactName ? <p className="mt-1 text-sm">{c.contactName}</p> : null}
                {c.notes ? <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{c.notes}</p> : null}
                {c.nextAction ? <p className="mt-1 text-xs text-accent">Next: {c.nextAction}</p> : null}
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="flex justify-end">
        <Button variant="ghost" className="text-destructive" onClick={() => setConfirm(true)}>
          <Trash2 className="size-4" />
          Delete prospect
        </Button>
      </div>

      <LogCallDialog prospect={prospect} open={logOpen} onOpenChange={setLogOpen} />
      <ProspectFormDialog prospect={prospect} open={editOpen} onOpenChange={setEditOpen} />
      <RequirementDialog
        open={reqOpen || !!editReq}
        onOpenChange={(v) => {
          if (!v) {
            setReqOpen(false);
            setEditReq(null);
          }
        }}
        prospectId={prospect.id}
        prospectName={prospect.businessName}
        requirement={editReq}
      />
      <Dialog open={cbOpen} onOpenChange={setCbOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule callback</DialogTitle>
          </DialogHeader>
          <Input type="datetime-local" value={cbValue} onChange={(e) => setCbValue(e.target.value)} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCbOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const iso = fromDatetimeLocal(cbValue);
                if (!iso) {
                  toast.error("Choose a valid date and time.");
                  return;
                }
                await update.mutateAsync({
                  id: prospect.id,
                  patch: { nextCallbackAt: iso, status: "Callback" },
                });
                toast.success("Callback scheduled");
                setCbOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this prospect?</AlertDialogTitle>
            <AlertDialogDescription>Call history will be removed with the record.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={async () => {
                await del.mutateAsync([prospect.id]);
                toast.success("Deleted");
                void navigate({ to: "/prospects" });
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

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

function StatusChip({ outcome }: { outcome: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <StatusBadge status={outcome.includes("Interest") ? "Interested" : "Called"} />
      <span className="text-muted-foreground">{outcome}</span>
    </span>
  );
}
