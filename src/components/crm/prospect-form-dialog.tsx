import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { emptyProspect } from "@/lib/crm/db";
import { useCreateProspect, useSettings, useUpdateProspect } from "@/lib/crm/hooks";
import { PRIORITIES, STATUSES, type Priority, type Prospect, type Status } from "@/lib/crm/types";

const FIELDS: Array<{ key: keyof ReturnType<typeof emptyProspect>; label: string; span?: boolean }> = [
  { key: "businessName", label: "Business name" },
  { key: "phone", label: "Phone" },
  { key: "alternatePhone", label: "Alternate phone" },
  { key: "email", label: "Email" },
  { key: "website", label: "Website" },
  { key: "contactName", label: "Contact name" },
  { key: "contactTitle", label: "Contact title" },
  { key: "address", label: "Address", span: true },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "ZIP" },
  { key: "leadType", label: "Lead type" },
  { key: "source", label: "Source" },
];

export function ProspectFormDialog({
  open,
  onOpenChange,
  prospect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prospect?: Prospect | null;
}) {
  const create = useCreateProspect();
  const update = useUpdateProspect();
  const settings = useSettings();
  const [form, setForm] = useState(emptyProspect());

  useEffect(() => {
    if (open) {
      if (prospect) {
        setForm({ ...prospect });
      } else {
        setForm({
          ...emptyProspect(),
          status: settings.data?.defaultStatus ?? "New",
          priority: settings.data?.defaultPriority ?? "Warm",
        });
      }
    }
  }, [open, prospect, settings.data]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    if (!form.businessName.trim() && !form.phone.trim()) {
      toast.error("Enter a business name or phone number.");
      return;
    }
    try {
      if (prospect) {
        await update.mutateAsync({ id: prospect.id, patch: form });
        toast.success("Prospect updated");
      } else {
        await create.mutateAsync(form);
        toast.success("Prospect added");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save prospect.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{prospect ? "Edit prospect" : "Add prospect"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.span ? "grid gap-1.5 sm:col-span-2" : "grid gap-1.5"}>
              <Label>{f.label}</Label>
              <Input
                value={String(form[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value as never)}
              />
            </div>
          ))}
          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as Status)}>
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
            <Select value={form.priority} onValueChange={(v) => set("priority", v as Priority)}>
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
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Remarks</Label>
            <Textarea value={form.remarks} onChange={(e) => set("remarks", e.target.value)} />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Next action</Label>
            <Input value={form.nextAction} onChange={(e) => set("nextAction", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={create.isPending || update.isPending}>
            {prospect ? "Save changes" : "Add prospect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
