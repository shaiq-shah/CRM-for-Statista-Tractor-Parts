import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import { formatDateTime } from "@/lib/crm/dates";
import { getAllProspects } from "@/lib/crm/db";
import {
  applyMapping,
  buildDefaultMapping,
  buildSampleWorkbook,
  FIELD_OPTIONS,
  mappingDict,
  parseWorkbook,
  previewImport,
  uniqueHeaders,
} from "@/lib/crm/excel";
import { useCommitImport, useImports } from "@/lib/crm/hooks";
import type { ColumnMapping, DuplicateAction, ImportPreview } from "@/lib/crm/types";
import { formatNumber } from "@/lib/utils";

export const Route = createFileRoute("/import")({ component: ImportPage });

function ImportPage() {
  const { data: history = [] } = useImports();
  const commit = useCommitImport();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping[]>([]);
  const [raw, setRaw] = useState<Awaited<ReturnType<typeof parseWorkbook>> | null>(null);
  const [actions, setActions] = useState<Record<number, DuplicateAction>>({});
  const [dupDefault, setDupDefault] = useState<DuplicateAction>("skip");

  async function onFile(file: File | null) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Upload an .xlsx workbook.");
      return;
    }
    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      const parsed = await parseWorkbook(buffer, file.name);
      const headers = uniqueHeaders(parsed.headersBySheet);
      const map = buildDefaultMapping(headers);
      const existing = await getAllProspects();
      const rows = applyMapping(parsed.rawRows, map);
      const next = previewImport(file.name, parsed.sheets, rows, map, existing);
      setRaw(parsed);
      setMapping(map);
      setPreview(next);
      setActions({});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read that workbook.");
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  async function remap(nextMap: ColumnMapping[]) {
    if (!raw || !preview) return;
    const existing = await getAllProspects();
    const rows = applyMapping(raw.rawRows, nextMap);
    setMapping(nextMap);
    setPreview(previewImport(preview.filename, raw.sheets, rows, nextMap, existing));
  }

  const dupIndexes = useMemo(
    () => new Set(preview?.duplicates.map((d) => d.incomingIndex) ?? []),
    [preview],
  );
  const invalidIndexes = useMemo(
    () => new Set(preview?.invalid.map((d) => d.index) ?? []),
    [preview],
  );

  async function confirm() {
    if (!preview) return;
    const resolved: Record<number, DuplicateAction> = {};
    for (const d of preview.duplicates) {
      resolved[d.incomingIndex] = actions[d.incomingIndex] ?? dupDefault;
    }
    try {
      const result = await commit.mutateAsync({
        rows: preview.rows,
        actions: resolved,
        duplicateIndexes: dupIndexes,
        invalidIndexes,
        filename: preview.filename,
        sheetCount: preview.sheetCount,
        mapping: mappingDict(mapping),
      });
      toast.success(
        `Imported ${result.imported}. ${result.duplicates} duplicates, ${result.skipped} skipped.`,
      );
      setPreview(null);
      setRaw(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
            Data
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Import Excel</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Map company, phone, and part columns. Part number, OEM / used / aftermarket, brand, model, and price quoted become requirements on each prospect.
          </p>
        </div>
        <Button variant="outline" onClick={() => buildSampleWorkbook()}>
          Download sample workbook
        </Button>
      </header>

      <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <Label>Workbook (.xlsx)</Label>
        <input
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="mt-2 block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-foreground"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          disabled={busy}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Original files are never overwritten. Every sheet is inspected, headers are mapped, and
          you confirm before anything is saved.
        </p>
      </section>

      {preview ? (
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="File" value={preview.filename} />
            <Stat label="Sheets" value={formatNumber(preview.sheetCount)} />
            <Stat label="Rows found" value={formatNumber(preview.rowsFound)} />
            <Stat label="New prospects" value={formatNumber(preview.newCount)} />
            <Stat label="Possible duplicates" value={formatNumber(preview.duplicateCount)} />
          </div>
          <p className="text-sm text-muted-foreground">
            Invalid / incomplete: {formatNumber(preview.invalidCount)}
          </p>

          <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
            <header className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-medium">Column mapping</h2>
            </header>
            <div className="divide-y divide-border">
              {mapping.map((m, i) => (
                <div key={m.excelColumn} className="grid grid-cols-2 items-center gap-3 px-4 py-2">
                  <span className="truncate text-sm">{m.excelColumn}</span>
                  <Select
                    value={m.field}
                    onValueChange={(v) => {
                      const next = mapping.map((row, idx) =>
                        idx === i ? { ...row, field: v as ColumnMapping["field"] } : row,
                      );
                      void remap(next);
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {preview.duplicateCount > 0 ? (
            <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-medium">Duplicates</h2>
                <div className="flex gap-2">
                  {(["skip", "keep", "merge"] as DuplicateAction[]).map((a) => (
                    <Button
                      key={a}
                      size="sm"
                      variant={dupDefault === a ? "default" : "outline"}
                      onClick={() => {
                        setDupDefault(a);
                        setActions((cur) => {
                          const next = { ...cur };
                          for (const d of preview.duplicates) next[d.incomingIndex] = a;
                          return next;
                        });
                      }}
                    >
                      {a === "skip" ? "Skip all" : a === "keep" ? "Keep separate" : "Merge all"}
                    </Button>
                  ))}
                </div>
              </div>
              <ul className="max-h-72 space-y-2 overflow-auto text-sm">
                {preview.duplicates.slice(0, 40).map((d) => {
                  const row = preview.rows[d.incomingIndex];
                  return (
                    <li
                      key={d.incomingIndex}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-secondary px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {row.values.businessName || row.values.phone || "Row " + row.rowNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {d.reasons.join(" · ")}
                          {d.existing ? ` · existing ${d.existing.businessName}` : ""}
                        </p>
                      </div>
                      <Select
                        value={actions[d.incomingIndex] ?? dupDefault}
                        onValueChange={(v) =>
                          setActions((cur) => ({ ...cur, [d.incomingIndex]: v as DuplicateAction }))
                        }
                      >
                        <SelectTrigger className="h-8 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="skip">Skip</SelectItem>
                          <SelectItem value="keep">Keep separate</SelectItem>
                          <SelectItem value="merge">Merge</SelectItem>
                        </SelectContent>
                      </Select>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPreview(null)}>
              Cancel
            </Button>
            <Button onClick={confirm} disabled={commit.isPending}>
              Confirm import
            </Button>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl bg-card shadow-[var(--shadow-border)]">
        <header className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">Import history</h2>
        </header>
        {history.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted-foreground">No imports yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[11px] tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2 font-medium">File</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Sheets</th>
                  <th className="px-3 py-2 font-medium">Rows</th>
                  <th className="px-3 py-2 font-medium">Imported</th>
                  <th className="px-3 py-2 font-medium">Duplicates</th>
                  <th className="px-3 py-2 font-medium">Skipped</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-t border-border">
                    <td className="px-4 py-2">{h.filename}</td>
                    <td className="px-3 py-2 font-mono text-xs">{formatDateTime(h.createdAt)}</td>
                    <td className="px-3 py-2 tabular-nums">{h.sheets}</td>
                    <td className="px-3 py-2 tabular-nums">{h.rows}</td>
                    <td className="px-3 py-2 tabular-nums">{h.imported}</td>
                    <td className="px-3 py-2 tabular-nums">{h.duplicates}</td>
                    <td className="px-3 py-2 tabular-nums">{h.skipped}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 truncate font-mono text-sm">{value}</p>
    </div>
  );
}
