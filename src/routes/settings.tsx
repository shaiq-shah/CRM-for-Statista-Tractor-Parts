import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { exportBackup, getDashboard, listCalls, listRequirements, restoreBackup } from "@/lib/crm/db";
import { exportWorkbook } from "@/lib/crm/excel";
import { getAllProspects } from "@/lib/crm/db";
import {
  useClearAll,
  useDbInfo,
  useInvalidateCrm,
  useLoadSample,
  useSaveSettings,
  useSettings,
} from "@/lib/crm/hooks";
import { isVendorSearchConfigured } from "@/lib/crm/vendor-search";
import { PRIORITIES, STATUSES, type Priority, type Status } from "@/lib/crm/types";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const { data: settings } = useSettings();
  const { data: info } = useDbInfo();
  const save = useSaveSettings();
  const sample = useLoadSample();
  const clear = useClearAll();
  const invalidate = useInvalidateCrm();
  const [wipeOpen, setWipeOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!settings) return null;

  async function backupJson() {
    const payload = await exportBackup();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CallDesk-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function backupXlsx() {
    const [prospects, calls, dash, reqs] = await Promise.all([
      getAllProspects(),
      listCalls({ page: 1, pageSize: 50000 }),
      getDashboard(),
      listRequirements({ page: 1, pageSize: 50000 }),
    ]);
    await exportWorkbook({
      prospects,
      calls: calls.rows,
      requirements: reqs.rows,
      stats: {
        "Total Prospects": dash.stats.total,
        Requirements: dash.stats.requirements,
        Interested: dash.stats.interested,
        Won: prospects.filter((p) => p.status === "Won").length,
        Lost: prospects.filter((p) => p.status === "Lost").length,
      },
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Workspace
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </header>

      <section className="space-y-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-medium">Defaults</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label>Imported status</Label>
            <Select
              value={settings.defaultStatus}
              onValueChange={(v) => save.mutate({ defaultStatus: v as Status })}
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
            <Label>Default priority</Label>
            <Select
              value={settings.defaultPriority}
              onValueChange={(v) => save.mutate({ defaultPriority: v as Priority })}
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
          <div className="grid gap-1.5">
            <Label>Callback duration</Label>
            <Select
              value={String(settings.defaultCallbackMinutes)}
              onValueChange={(v) => save.mutate({ defaultCallbackMinutes: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[15, 30, 60, 120, 1440].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n >= 1440 ? "1 day" : `${n} minutes`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-medium">Database</h2>
        <p className="text-sm text-muted-foreground">
          {info?.prospects ?? 0} prospects · {info?.calls ?? 0} calls · {info?.requirements ?? 0}{" "}
          requirements · {info?.imports ?? 0} imports. Data stays on this device.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={backupJson}>
            Backup database
          </Button>
          <Button variant="outline" onClick={backupXlsx}>
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            Restore backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const json = JSON.parse(await file.text());
                await restoreBackup(json);
                await invalidate();
                toast.success("Backup restored");
              } catch {
                toast.error("That backup file could not be read.");
              }
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-medium">Sample data</h2>
        <p className="text-sm text-muted-foreground">
          Optional demo workspace. It is clearly sourced as “Sample” and can be wiped anytime.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              const n = await sample.mutateAsync();
              toast.success(`Loaded ${n} sample prospects`);
            }}
            disabled={sample.isPending}
          >
            Load sample workspace
          </Button>
          <Button variant="destructive" onClick={() => setWipeOpen(true)}>
            Clear all data
          </Button>
        </div>
      </section>

      <section className="space-y-2 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-medium">Vendor search</h2>
        <p className="text-sm text-muted-foreground">
          {isVendorSearchConfigured()
            ? "An external provider is configured."
            : "Not configured. CallDesk works fully offline. A vendor-search module can be added later without changing the CRM core."}
        </p>
      </section>

      <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-medium">Application</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          CallDesk Statista Tractor Parts · local-first CRM. Data never leaves this browser unless
          you export it.
        </p>
      </section>

      <AlertDialog open={wipeOpen} onOpenChange={setWipeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear the entire database?</AlertDialogTitle>
            <AlertDialogDescription>
              Prospects, call history, and import logs will be deleted from this browser. Export a
              backup first if you need it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={async () => {
                await clear.mutateAsync();
                toast.success("Database cleared");
                setWipeOpen(false);
              }}
            >
              Clear everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
