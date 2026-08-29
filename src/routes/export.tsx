import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAllProspects, getDashboard, listCalls, listRequirements } from "@/lib/crm/db";
import { exportWorkbook } from "@/lib/crm/excel";
import { useDbInfo } from "@/lib/crm/hooks";

export const Route = createFileRoute("/export")({ component: ExportPage });

function ExportPage() {
  const { data } = useDbInfo();
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
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
          "To Call": dash.stats.toCall,
          "Called Today": dash.stats.calledToday,
          Callbacks: dash.stats.callbacksToday,
          Requirements: dash.stats.requirements,
          Interested: dash.stats.interested,
          New: prospects.filter((p) => p.status === "New").length,
          Called: prospects.filter((p) => p.status === "Called").length,
          Won: prospects.filter((p) => p.status === "Won").length,
          Lost: prospects.filter((p) => p.status === "Lost").length,
        },
      });
      toast.success("Workbook downloaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Data
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Export Excel</h1>
      </header>
      <section className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
        <p className="text-sm text-muted-foreground">
          Creates a new workbook with Prospects, Call History, Requirements, and Summary. Your
          original import files are never touched.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <div>
            <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">Prospects</dt>
            <dd className="mt-1 font-mono text-xl tabular-nums">{data?.prospects ?? 0}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">Calls</dt>
            <dd className="mt-1 font-mono text-xl tabular-nums">{data?.calls ?? 0}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">Requirements</dt>
            <dd className="mt-1 font-mono text-xl tabular-nums">{data?.requirements ?? 0}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">Imports</dt>
            <dd className="mt-1 font-mono text-xl tabular-nums">{data?.imports ?? 0}</dd>
          </div>
        </dl>
        <Button className="mt-6 w-full" onClick={run} disabled={busy}>
          {busy ? "Preparing…" : "Download Excel"}
        </Button>
      </section>
    </div>
  );
}
