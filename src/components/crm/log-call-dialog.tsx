import { useState } from "react";
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
import { useLogCall, useSettings } from "@/lib/crm/hooks";
import {
  LOG_CALL_OUTCOMES,
  PART_CONDITIONS,
  TRACTOR_BRANDS,
  type CallOutcome,
  type PartCondition,
  type Prospect,
} from "@/lib/crm/types";
import { datetimeLocalValue, defaultCallbackIso, fromDatetimeLocal } from "@/lib/crm/dates";

export function LogCallDialog({
  prospect,
  open,
  onOpenChange,
  onSaved,
  onSavedNext,
}: {
  prospect: Prospect | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
  onSavedNext?: () => void;
}) {
  const logCall = useLogCall();
  const settings = useSettings();
  const [outcome, setOutcome] = useState<CallOutcome>("No Answer");
  const [contactName, setContactName] = useState("");
  const [notes, setNotes] = useState("");
  const [callback, setCallback] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [condition, setCondition] = useState<PartCondition>("OEM");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [priceQuoted, setPriceQuoted] = useState("");
  const [quantity, setQuantity] = useState("");

  function reset(p: Prospect | null) {
    setOutcome("No Answer");
    setContactName(p?.contactName ?? "");
    setNotes("");
    setCallback("");
    setNextAction(p?.nextAction ?? "");
    setPartNumber("");
    setCondition("OEM");
    setBrand("");
    setModel("");
    setPriceQuoted("");
    setQuantity("");
  }

  async function save(mode: "save" | "callback" | "next") {
    if (!prospect) return;
    let callbackAt = fromDatetimeLocal(callback);
    if (mode === "callback" && !callbackAt) {
      callbackAt = defaultCallbackIso(settings.data?.defaultCallbackMinutes ?? 60);
    }
    const finalOutcome: CallOutcome =
      mode === "callback" && outcome === "No Answer" ? "Callback Requested" : outcome;
    const hasReq = partNumber.trim() || brand.trim() || model.trim() || priceQuoted.trim();
    try {
      await logCall.mutateAsync({
        prospectId: prospect.id,
        outcome: finalOutcome,
        contactName,
        notes,
        callbackAt,
        nextAction,
        requirement: hasReq
          ? {
              partNumber,
              condition,
              brand,
              model,
              priceQuoted,
              quantity,
              notes: notes.trim() ? `From call: ${notes.trim()}` : "",
              status: "Open",
            }
          : null,
      });
      toast.success(hasReq ? "Call logged with requirement" : "Call logged");
      onOpenChange(false);
      reset(prospect);
      if (mode === "next") onSavedNext?.();
      else onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save call.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (v) reset(prospect);
      }}
    >
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log call</DialogTitle>
          <DialogDescription>
            {prospect ? `${prospect.businessName} · ${prospect.phone || "No phone"}` : "Select a prospect"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Outcome</Label>
            <Select value={outcome} onValueChange={(v) => setOutcome(v as CallOutcome)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOG_CALL_OUTCOMES.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Contact spoken to</Label>
            <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Remarks</Label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What they said, callback notes, anything useful…"
            />
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
              Requirement
            </p>
            <p className="mt-1 mb-3 text-xs text-muted-foreground">
              If they gave you a part number, log it here — OEM, used, or aftermarket, plus brand, model, and the price you quoted.
            </p>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label>Part number</Label>
                <Input
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="RE507541"
                  className="font-mono"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label>Condition</Label>
                  <Select value={condition} onValueChange={(v) => setCondition(v as PartCondition)}>
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
                  <Label>Brand</Label>
                  <Input
                    list="log-call-brands"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="John Deere"
                  />
                  <datalist id="log-call-brands">
                    {TRACTOR_BRANDS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </div>
                <div className="grid gap-1.5">
                  <Label>Model</Label>
                  <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="5075E" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label>Price quoted</Label>
                  <Input
                    value={priceQuoted}
                    onChange={(e) => setPriceQuoted(e.target.value)}
                    placeholder="48.50"
                    className="font-mono"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Qty</Label>
                  <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Callback</Label>
            <Input
              type="datetime-local"
              value={callback}
              onChange={(e) => setCallback(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Next action</Label>
            <Input value={nextAction} onChange={(e) => setNextAction(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" disabled={logCall.isPending} onClick={() => save("save")}>
              Save call
            </Button>
            <Button variant="secondary" disabled={logCall.isPending} onClick={() => save("callback")}>
              Save & callback
            </Button>
            <Button disabled={logCall.isPending} onClick={() => save("next")}>
              Save & next
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function presetCallbackValue(iso: string | null | undefined) {
  return datetimeLocalValue(iso);
}
