import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import * as db from "./db";
import type {
  AppSettings,
  DuplicateAction,
  ListProspectsParams,
  LogCallInput,
  ParsedRow,
  Prospect,
  ProspectInput,
  Requirement,
  RequirementInput,
  RequirementStatus,
} from "./types";
import { normalizeName, normalizePhone } from "./normalize";
import { loadSampleWorkspace } from "./sample";

export const crmKeys = {
  all: ["crm"] as const,
  dashboard: () => [...crmKeys.all, "dashboard"] as const,
  prospects: (params: ListProspectsParams) => [...crmKeys.all, "prospects", params] as const,
  prospect: (id: string) => [...crmKeys.all, "prospect", id] as const,
  calls: (params: object) => [...crmKeys.all, "calls", params] as const,
  prospectCalls: (id: string) => [...crmKeys.all, "prospect-calls", id] as const,
  callbacks: () => [...crmKeys.all, "callbacks"] as const,
  queue: (skip: string[]) => [...crmKeys.all, "queue", skip] as const,
  settings: () => [...crmKeys.all, "settings"] as const,
  imports: () => [...crmKeys.all, "imports"] as const,
  info: () => [...crmKeys.all, "info"] as const,
  requirements: (params: object) => [...crmKeys.all, "requirements", params] as const,
  prospectRequirements: (id: string) => [...crmKeys.all, "prospect-req", id] as const,
};

const enabled = typeof indexedDB !== "undefined";

export function useInvalidateCrm() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: crmKeys.all });
}

export function useDashboard() {
  return useQuery({
    queryKey: crmKeys.dashboard(),
    queryFn: db.getDashboard,
    enabled,
  });
}

export function useProspects(params: ListProspectsParams) {
  return useQuery({
    queryKey: crmKeys.prospects(params),
    queryFn: () => db.listProspects(params),
    enabled,
  });
}

export function useProspect(id: string | undefined) {
  return useQuery({
    queryKey: crmKeys.prospect(id ?? ""),
    queryFn: () => db.getProspect(id!),
    enabled: enabled && !!id,
  });
}

export function useProspectCalls(id: string | undefined) {
  return useQuery({
    queryKey: crmKeys.prospectCalls(id ?? ""),
    queryFn: () => db.getCallsForProspect(id!),
    enabled: enabled && !!id,
  });
}

export function useProspectRequirements(id: string | undefined) {
  return useQuery({
    queryKey: crmKeys.prospectRequirements(id ?? ""),
    queryFn: () => db.getRequirementsForProspect(id!),
    enabled: enabled && !!id,
  });
}

export function useRequirements(params: {
  q?: string;
  status?: RequirementStatus | "all";
  condition?: Requirement["condition"] | "all";
  page?: number;
}) {
  return useQuery({
    queryKey: crmKeys.requirements(params),
    queryFn: () => db.listRequirements(params),
    enabled,
  });
}

export function useCalls(params: { page?: number; pageSize?: number; q?: string }) {
  return useQuery({
    queryKey: crmKeys.calls(params),
    queryFn: () => db.listCalls(params),
    enabled,
  });
}

export function useCallbacks() {
  return useQuery({
    queryKey: crmKeys.callbacks(),
    queryFn: db.listCallbacks,
    enabled,
  });
}

export const useQueueSession = create<{
  skipIds: string[];
  skip: (id: string) => void;
  reset: () => void;
}>((set) => ({
  skipIds: [],
  skip: (id) => set((s) => ({ skipIds: s.skipIds.includes(id) ? s.skipIds : [...s.skipIds, id] })),
  reset: () => set({ skipIds: [] }),
}));

export function useQueue() {
  const skipIds = useQueueSession((s) => s.skipIds);
  return useQuery({
    queryKey: crmKeys.queue(skipIds),
    queryFn: () => db.getQueue(skipIds),
    enabled,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: crmKeys.settings(),
    queryFn: db.getSettings,
    enabled,
  });
}

export function useImports() {
  return useQuery({
    queryKey: crmKeys.imports(),
    queryFn: db.listImports,
    enabled,
  });
}

export function useDbInfo() {
  return useQuery({
    queryKey: crmKeys.info(),
    queryFn: db.getDbInfo,
    enabled,
  });
}

export function useCreateProspect() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: (input: ProspectInput) => db.createProspect(input),
    onSuccess: invalidate,
  });
}

export function useUpdateProspect() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Prospect> }) =>
      db.updateProspect(id, patch),
    onSuccess: invalidate,
  });
}

export function useDeleteProspects() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: (ids: string[]) => db.deleteProspects(ids),
    onSuccess: invalidate,
  });
}

export function useBulkUpdate() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: ({
      ids,
      patch,
    }: {
      ids: string[];
      patch: Partial<Pick<Prospect, "status" | "priority" | "source">>;
    }) => db.bulkUpdate(ids, patch),
    onSuccess: invalidate,
  });
}

export function useLogCall() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: (input: LogCallInput) => db.logCall(input),
    onSuccess: invalidate,
  });
}

export function useCreateRequirement() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: (input: RequirementInput) => db.createRequirement(input),
    onSuccess: invalidate,
  });
}

export function useUpdateRequirement() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Requirement> }) =>
      db.updateRequirement(id, patch),
    onSuccess: invalidate,
  });
}

export function useDeleteRequirement() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: (id: string) => db.deleteRequirement(id),
    onSuccess: invalidate,
  });
}

export function useSaveSettings() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: (patch: Partial<AppSettings>) => db.saveSettings(patch),
    onSuccess: invalidate,
  });
}

export function useLoadSample() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: loadSampleWorkspace,
    onSuccess: invalidate,
  });
}

export function useClearAll() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: db.clearAll,
    onSuccess: invalidate,
  });
}

export async function commitImport(params: {
  rows: ParsedRow[];
  actions: Record<number, DuplicateAction>;
  duplicateIndexes: Set<number>;
  invalidIndexes: Set<number>;
  filename: string;
  sheetCount: number;
  mapping: Record<string, string>;
}) {
  const settings = await db.getSettings();
  const existing = await db.getAllProspects();
  let imported = 0;
  let duplicates = 0;
  let skipped = 0;
  const toAdd: ProspectInput[] = [];
  const reqs: RequirementInput[] = [];

  async function attachRequirement(prospectId: string, row: ParsedRow) {
    const draft = db.requirementFromRow(row.values, row.extra);
    if (draft) reqs.push({ ...draft, prospectId });
  }

  for (let i = 0; i < params.rows.length; i++) {
    const row = params.rows[i];
    if (params.invalidIndexes.has(i)) {
      skipped += 1;
      continue;
    }
    const input = db.coerceProspectInput(row.values, row.extra, settings, params.filename);
    if (params.duplicateIndexes.has(i)) {
      const action = params.actions[i] ?? "skip";
      duplicates += 1;
      if (action === "skip") {
        skipped += 1;
        continue;
      }
      if (action === "keep") {
        const created = await db.createProspect(input);
        await attachRequirement(created.id, row);
        imported += 1;
        continue;
      }
      const phone = normalizePhone(input.phone);
      const name = normalizeName(input.businessName);
      const target =
        existing.find((p) => phone && p.phoneNormalized === phone) ??
        existing.find((p) => name && p.nameNormalized === name);
      if (target) {
        const merged = db.mergeProspects(target, input);
        await db.updateProspect(target.id, merged);
        await attachRequirement(target.id, row);
        imported += 1;
      } else {
        const created = await db.createProspect(input);
        await attachRequirement(created.id, row);
        imported += 1;
      }
      continue;
    }
    toAdd.push(input);
    imported += 1;
  }

  if (toAdd.length) {
    const added = await db.importProspects(toAdd);
    const start = params.rows.length - toAdd.length;
    // Pair newly added rows in order of toAdd (same order as non-dup, non-invalid, non-merged)
    let addIdx = 0;
    for (let i = 0; i < params.rows.length; i++) {
      if (params.invalidIndexes.has(i) || params.duplicateIndexes.has(i)) continue;
      const id = added.ids[addIdx++];
      if (id) await attachRequirement(id, params.rows[i]);
    }
    void start;
  }
  if (reqs.length) {
    for (const r of reqs) await db.createRequirement(r);
  }
  await db.recordImport({
    filename: params.filename,
    sheets: params.sheetCount,
    rows: params.rows.length,
    imported,
    duplicates,
    skipped,
    mapping: params.mapping,
  });
  return { imported, duplicates, skipped };
}

export function useCommitImport() {
  const invalidate = useInvalidateCrm();
  return useMutation({
    mutationFn: commitImport,
    onSuccess: invalidate,
  });
}
