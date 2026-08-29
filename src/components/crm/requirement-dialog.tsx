import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { emptyRequirement } from "@/lib/crm/db";
import { useCreateRequirement, useUpdateRequirement } from "@/lib/crm/hooks";
import {
  PART_CONDITIONS,
  REQUIREMENT_STATUSES,
  TRACTOR_BRANDS,
  type PartCondition,
  type Requirement,
  type RequirementStatus,
} from "@/lib/crm/types";

export function RequirementDialog({
  open,
  onOpenChange,
  prospectId,
  prospectName,
  requirement,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prospectId: string;
  prospectName?: string;
  requirement?: Requirement | null;
}) {
  const create = useCreateRequirement();
  const update = useUpdateRequirement();
  const [form, setForm] = useState(emptyRequirement(prospectId));

  useEffect(() => {
    if (!open) return;
    if (requirement) {
      setForm({ ...requirement });
    } else {
      setForm(emptyRequirement(prospectId));
    }
  }, [open, requirement, prospectId]);

  async function submit() {
    if (!form.partNumber.trim() && !form.brand.trim() && !form.model.trim()) {
      toast.error("Enter a part number, brand, or model.");
      return;
    }
    try {
      if (requirement) {
        await update.mutateAsync({ id: requirement.id, patch: form });
        toast.success("Requirement updated");
      } else {
        await create.mutateAsync({ ...form, prospectId });
        toast.success("Requirement saved");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save requirement.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{requirement ? "Edit requirement" : "Add requirement"}</DialogTitle>
          <DialogDescription>
            {prospectName
              ? `Part request from ${prospectName}. OEM, used, or aftermarket.`
              : "Capture the part number, condition, brand, model, and quoted price."}
          </DialogDescription>
        </DialogHeader>
        <RequirementFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={create.isPending || update.isPending}>
            Save requirement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RequirementFields({
  form,
  setForm,
}: {
  form: ReturnType<typeof emptyRequirement>;
  setForm: (next: ReturnType<typeof emptyRequirement>) => void;
}) {
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm({ ...form, [key]: value });
  }
  return (
    <div className="grid gap-3">
      <div className="grid gap-1.5">
        <Label>Part number</Label>
        <Input
          value={form.partNumber}
          onChange={(e) => set("partNumber", e.target.value)}
          placeholder="RE507541"
          className="font-mono"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Condition</Label>
          <Select value={form.condition} onValueChange={(v) => set("condition", v as PartCondition)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PART_CONDITIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v as RequirementStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REQUIREMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Brand</Label>
          <Input
            list="tractor-brands"
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="John Deere"
          />
          <datalist id="tractor-brands">
            {TRACTOR_BRANDS.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>
        <div className="grid gap-1.5">
          <Label>Model</Label>
          <Input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="5075E" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Price quoted</Label>
          <Input
            value={form.priceQuoted}
            onChange={(e) => set("priceQuoted", e.target.value)}
            placeholder="48.50"
            className="font-mono"
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Quantity</Label>
          <Input value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="1" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label>Notes</Label>
        <Textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
    </div>
  );
}
