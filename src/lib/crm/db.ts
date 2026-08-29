import Dexie, { type Table } from "dexie";
import type {
  AppSettings,
  BackupPayload,
  CallOutcome,
  CallRecord,
  DashboardStats,
  ImportRecord,
  ListProspectsParams,
  LogCallInput,
  Priority,
  Prospect,
  ProspectFilter,
  ProspectInput,
  Requirement,
  RequirementInput,
  RequirementListItem,
  RequirementStatus,
  SortField,
  Status,
} from "./types";
import { DEFAULT_SETTINGS, TERMINAL_STATUSES } from "./types";
import {
  inferConditionFromExtra,
  mergeText,
  normalizeName,
  normalizePhone,
  parseCondition,
  parsePriority,
  parseStatus,
  preferFilled,
} from "./normalize";
import {
  endOfTodayIso,
  endOfTomorrowIso,
  nowIso,
  startOfTodayIso,
  startOfTomorrowIso,
} from "./dates";

export class CrmDB extends Dexie {
  prospects!: Table<Prospect, string>;
  calls!: Table<CallRecord, string>;
  imports!: Table<ImportRecord, string>;
  settings!: Table<AppSettings, string>;
  requirements!: Table<Requirement, string>;

  constructor() {
    super("calldesk-crm");
    this.version(1).stores({
      prospects:
        "id, phoneNormalized, nameNormalized, status, priority, nextCallbackAt, lastCalledAt, createdAt, updatedAt, city, source, [nameNormalized+city]",
      calls: "id, prospectId, calledAt, createdAt, outcome",
      imports: "id, createdAt",
      settings: "id",
    });
    this.version(2).stores({
      prospects:
        "id, phoneNormalized, nameNormalized, status, priority, nextCallbackAt, lastCalledAt, createdAt, updatedAt, city, source, [nameNormalized+city]",
      calls: "id, prospectId, calledAt, createdAt, outcome",
      imports: "id, createdAt",
      settings: "id",
      requirements: "id, prospectId, partNumber, brand, condition, status, createdAt, updatedAt",
    });
  }
}

let _db: CrmDB | null = null;

export function getDb(): CrmDB {
  if (typeof indexedDB === "undefined") {
    throw new Error("CallDesk needs a browser with IndexedDB.");
  }
  if (!_db) _db = new CrmDB();
  return _db;
}

function newId(): string {
  return crypto.randomUUID();
}

export function emptyProspect(): ProspectInput {
  return {
    businessName: "",
    phone: "",
    alternatePhone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    contactName: "",
    contactTitle: "",
    leadType: "",
    status: "New",
    priority: "Warm",
    source: "",
    remarks: "",
    nextAction: "",
    extra: {},
  };
}

export function hydrateProspect(
  input: ProspectInput,
  settings?: AppSettings,
  existing?: Prospect,
): Prospect {
  const now = nowIso();
  const phone = input.phone?.trim() ?? "";
  const businessName = input.businessName?.trim() ?? "";
  return {
    id: input.id ?? existing?.id ?? newId(),
    businessName,
    phone,
    alternatePhone: input.alternatePhone?.trim() ?? "",
    email: input.email?.trim() ?? "",
    website: input.website?.trim() ?? "",
    address: input.address?.trim() ?? "",
    city: input.city?.trim() ?? "",
    state: input.state?.trim() ?? "",
    zip: input.zip?.trim() ?? "",
    contactName: input.contactName?.trim() ?? "",
    contactTitle: input.contactTitle?.trim() ?? "",
    leadType: input.leadType?.trim() ?? "",
    status: input.status ?? settings?.defaultStatus ?? "New",
    priority: input.priority ?? settings?.defaultPriority ?? "Warm",
    source: input.source?.trim() ?? "",
    remarks: input.remarks ?? "",
    nextAction: input.nextAction ?? "",
    lastCalledAt: input.lastCalledAt ?? existing?.lastCalledAt ?? null,
    nextCallbackAt: input.nextCallbackAt ?? existing?.nextCallbackAt ?? null,
    callAttempts: input.callAttempts ?? existing?.callAttempts ?? 0,
    extra: input.extra ?? existing?.extra ?? {},
    phoneNormalized: normalizePhone(phone),
    nameNormalized: normalizeName(businessName),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function mergeProspects(primary: Prospect, incoming: ProspectInput): Prospect {
  const extra = { ...incoming.extra, ...primary.extra };
  return hydrateProspect(
    {
      ...primary,
      businessName: preferFilled(primary.businessName, incoming.businessName),
      phone: preferFilled(primary.phone, incoming.phone),
      alternatePhone: preferFilled(primary.alternatePhone, incoming.alternatePhone ?? ""),
      email: preferFilled(primary.email, incoming.email ?? ""),
      website: preferFilled(primary.website, incoming.website ?? ""),
      address: preferFilled(primary.address, incoming.address ?? ""),
      city: preferFilled(primary.city, incoming.city ?? ""),
      state: preferFilled(primary.state, incoming.state ?? ""),
      zip: preferFilled(primary.zip, incoming.zip ?? ""),
      contactName: preferFilled(primary.contactName, incoming.contactName ?? ""),
      contactTitle: preferFilled(primary.contactTitle, incoming.contactTitle ?? ""),
      leadType: preferFilled(primary.leadType, incoming.leadType ?? ""),
      source: preferFilled(primary.source, incoming.source ?? ""),
      remarks: mergeText(primary.remarks, incoming.remarks ?? ""),
      nextAction: preferFilled(primary.nextAction, incoming.nextAction ?? ""),
      extra,
      status: primary.status,
      priority: primary.priority,
    },
    undefined,
    primary,
  );
}

function matchesSearch(p: Prospect, q: string, requirementHits?: Set<string>): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  if (requirementHits?.has(p.id)) return true;
  const phoneQ = needle.replace(/\D+/g, "");
  const hay = [
    p.businessName,
    p.phone,
    p.alternatePhone,
    p.email,
    p.contactName,
    p.city,
    p.state,
    p.zip,
    p.remarks,
    p.nextAction,
    p.source,
    p.website,
    ...Object.values(p.extra),
  ]
    .join(" ")
    .toLowerCase();
  if (hay.includes(needle)) return true;
  if (phoneQ && (p.phoneNormalized.includes(phoneQ) || p.alternatePhone.replace(/\D+/g, "").includes(phoneQ))) {
    return true;
  }
  return false;
}

function inFilter(p: Prospect, filter: ProspectFilter, now: string): boolean {
  const start = startOfTodayIso();
  const end = endOfTodayIso();
  switch (filter) {
    case "all":
      return true;
    case "new":
      return p.status === "New";
    case "to-call":
      return p.status === "To Call" || p.status === "New";
    case "never-called":
      return p.callAttempts === 0 && !p.lastCalledAt;
    case "called-today":
      return !!p.lastCalledAt && p.lastCalledAt >= start && p.lastCalledAt <= end;
    case "callbacks-today":
      return !!p.nextCallbackAt && p.nextCallbackAt >= start && p.nextCallbackAt <= end;
    case "overdue":
      return (
        !!p.nextCallbackAt &&
        p.nextCallbackAt < now &&
        !TERMINAL_STATUSES.includes(p.status)
      );
    case "requirements":
      return true;
    case "interested":
      return p.status === "Interested";
    case "hot":
      return p.priority === "Hot";
    case "warm":
      return p.priority === "Warm";
    case "cold":
      return p.priority === "Cold";
    case "follow-up":
      return p.status === "Follow-up";
    case "won":
      return p.status === "Won";
    case "lost":
      return p.status === "Lost";
    case "do-not-call":
      return p.status === "Do Not Call";
    default:
      return true;
  }
}

function compareProspects(a: Prospect, b: Prospect, sort: SortField, dir: "asc" | "desc"): number {
  const mul = dir === "asc" ? 1 : -1;
  const av = a[sort];
  const bv = b[sort];
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  if (typeof av === "number" && typeof bv === "number") return (av - bv) * mul;
  return String(av).localeCompare(String(bv), undefined, { sensitivity: "base" }) * mul;
}

export async function getSettings(): Promise<AppSettings> {
  const db = getDb();
  const row = await db.settings.get("default");
  return row ?? { ...DEFAULT_SETTINGS, updatedAt: nowIso() };
}

export async function saveSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const db = getDb();
  const current = await getSettings();
  const next: AppSettings = { ...current, ...patch, id: "default", updatedAt: nowIso() };
  await db.settings.put(next);
  return next;
}

export async function listProspects(params: ListProspectsParams = {}): Promise<{
  rows: Prospect[];
  total: number;
}> {
  const db = getDb();
  const filter = params.filter ?? "all";
  const q = params.q ?? "";
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(200, Math.max(10, params.pageSize ?? 50));
  const sort = params.sort ?? "updatedAt";
  const dir = params.dir ?? "desc";
  const now = nowIso();

  const reqHits = await requirementSearchHits(q);
  const reqOwners = filter === "requirements" ? await prospectIdsWithRequirements() : null;

  let rows = await db.prospects.toArray();
  if (params.ids?.length) {
    const set = new Set(params.ids);
    rows = rows.filter((p) => set.has(p.id));
  }
  rows = rows.filter((p) => {
    if (reqOwners && !reqOwners.has(p.id)) return false;
    return inFilter(p, filter, now) && matchesSearch(p, q, reqHits);
  });
  rows.sort((a, b) => compareProspects(a, b, sort, dir));
  const total = rows.length;
  const start = (page - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), total };
}

export async function getAllProspects(): Promise<Prospect[]> {
  return getDb().prospects.toArray();
}

export async function getProspect(id: string): Promise<Prospect | undefined> {
  return getDb().prospects.get(id);
}

export async function createProspect(input: ProspectInput): Promise<Prospect> {
  const db = getDb();
  const settings = await getSettings();
  const prospect = hydrateProspect(input, settings);
  await db.prospects.add(prospect);
  return prospect;
}

export async function updateProspect(
  id: string,
  patch: Partial<Prospect>,
): Promise<Prospect> {
  const db = getDb();
  const existing = await db.prospects.get(id);
  if (!existing) throw new Error("Prospect not found.");
  const next = hydrateProspect({ ...existing, ...patch, id }, undefined, existing);
  await db.prospects.put(next);
  return next;
}

export async function deleteProspects(ids: string[]): Promise<number> {
  const db = getDb();
  await db.transaction("rw", db.prospects, db.calls, db.requirements, async () => {
    await db.prospects.bulkDelete(ids);
    await db.calls.where("prospectId").anyOf(ids).delete();
    await db.requirements.where("prospectId").anyOf(ids).delete();
  });
  return ids.length;
}

export async function bulkUpdate(
  ids: string[],
  patch: Partial<Pick<Prospect, "status" | "priority" | "source">>,
): Promise<void> {
  const db = getDb();
  const now = nowIso();
  await db.transaction("rw", db.prospects, async () => {
    const rows = await db.prospects.bulkGet(ids);
    const next = rows
      .filter((p): p is Prospect => !!p)
      .map((p) => ({ ...p, ...patch, updatedAt: now }));
    await db.prospects.bulkPut(next);
  });
}

function statusFromOutcome(outcome: CallOutcome, current: Status): Status {
  switch (outcome) {
    case "Interested":
    case "Very Interested":
      return "Interested";
    case "Not Interested":
    case "Already Has Supplier":
      return "Not Interested";
    case "Do Not Call":
      return "Do Not Call";
    case "Converted / Won":
      return "Won";
    case "Qualified":
      return "Qualified";
    case "Callback Requested":
    case "Callback Rescheduled":
      return "Callback";
    case "Send Information":
      return "Follow-up";
    case "Wrong Number":
    case "Disconnected":
      return "Lost";
    case "Callback Completed":
      return current === "Callback" ? "Called" : current;
    default:
      return current === "New" || current === "To Call" ? "Called" : current;
  }
}

export async function logCall(input: LogCallInput): Promise<CallRecord> {
  const db = getDb();
  const prospect = await db.prospects.get(input.prospectId);
  if (!prospect) throw new Error("Prospect not found.");
  const calledAt = input.calledAt ?? nowIso();
  const callbackAt = input.callbackAt || null;
  const record: CallRecord = {
    id: newId(),
    prospectId: prospect.id,
    calledAt,
    outcome: input.outcome,
    contactName: (input.contactName ?? prospect.contactName).trim(),
    notes: (input.notes ?? "").trim(),
    callbackAt,
    nextAction: (input.nextAction ?? "").trim(),
    createdAt: nowIso(),
  };

  const nextStatus = statusFromOutcome(input.outcome, prospect.status);
  const next: Prospect = {
    ...prospect,
    lastCalledAt: calledAt,
    callAttempts: prospect.callAttempts + 1,
    status: nextStatus,
    nextCallbackAt: callbackAt ?? (input.outcome === "Callback Completed" ? null : prospect.nextCallbackAt),
    nextAction: record.nextAction || prospect.nextAction,
    contactName: record.contactName || prospect.contactName,
    remarks: record.notes ? mergeText(prospect.remarks, record.notes) : prospect.remarks,
    updatedAt: nowIso(),
  };

  await db.transaction("rw", db.prospects, db.calls, db.requirements, async () => {
    await db.calls.add(record);
    await db.prospects.put(next);
    const req = input.requirement;
    if (req && (req.partNumber?.trim() || req.brand?.trim() || req.model?.trim() || req.priceQuoted?.trim())) {
      await db.requirements.add(
        hydrateRequirement({
          ...req,
          prospectId: prospect.id,
        }),
      );
    }
  });
  return record;
}

export async function listCalls(params: {
  page?: number;
  pageSize?: number;
  q?: string;
  prospectId?: string;
}): Promise<{ rows: Array<CallRecord & { businessName: string; phone: string }>; total: number }> {
  const db = getDb();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(200, Math.max(10, params.pageSize ?? 50));
  let rows = params.prospectId
    ? await db.calls.where("prospectId").equals(params.prospectId).toArray()
    : await db.calls.toArray();
  rows.sort((a, b) => b.calledAt.localeCompare(a.calledAt));
  const prospects = await db.prospects.toArray();
  const byId = new Map(prospects.map((p) => [p.id, p]));
  const q = (params.q ?? "").trim().toLowerCase();
  let joined = rows.map((c) => {
    const p = byId.get(c.prospectId);
    return {
      ...c,
      businessName: p?.businessName ?? "Deleted prospect",
      phone: p?.phone ?? "",
    };
  });
  if (q) {
    joined = joined.filter(
      (c) =>
        c.businessName.toLowerCase().includes(q) ||
        c.outcome.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q),
    );
  }
  const total = joined.length;
  const start = (page - 1) * pageSize;
  return { rows: joined.slice(start, start + pageSize), total };
}

export async function getCallsForProspect(id: string): Promise<CallRecord[]> {
  const rows = await getDb().calls.where("prospectId").equals(id).toArray();
  return rows.sort((a, b) => b.calledAt.localeCompare(a.calledAt));
}

export async function getDashboard(): Promise<{
  stats: DashboardStats;
  todayQueue: Prospect[];
  overdue: Prospect[];
  upcoming: Prospect[];
  activity: Array<CallRecord & { businessName: string }>;
  openRequirements: RequirementListItem[];
}> {
  const db = getDb();
  const now = nowIso();
  const start = startOfTodayIso();
  const end = endOfTodayIso();
  const prospects = await db.prospects.toArray();
  const requirements = await db.requirements.toArray();
  const byId = new Map(prospects.map((p) => [p.id, p]));

  const overdue = prospects
    .filter(
      (p) => p.nextCallbackAt && p.nextCallbackAt < now && !TERMINAL_STATUSES.includes(p.status),
    )
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));

  const todayCallbacks = prospects
    .filter((p) => p.nextCallbackAt && p.nextCallbackAt >= start && p.nextCallbackAt <= end)
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));

  const toCallList = prospects.filter(
    (p) =>
      !TERMINAL_STATUSES.includes(p.status) &&
      (p.status === "New" ||
        p.status === "To Call" ||
        p.status === "Callback" ||
        p.callAttempts === 0),
  );

  const openReqs = requirements.filter((r) => r.status === "Open" || r.status === "Quoted");

  const stats: DashboardStats = {
    total: prospects.length,
    toCall: toCallList.length,
    calledToday: prospects.filter(
      (p) => p.lastCalledAt && p.lastCalledAt >= start && p.lastCalledAt <= end,
    ).length,
    callbacksToday: todayCallbacks.length,
    requirements: openReqs.length,
    interested: prospects.filter((p) => p.status === "Interested").length,
  };

  const todayQueue = [
    ...overdue,
    ...todayCallbacks.filter((p) => !overdue.some((o) => o.id === p.id)),
    ...prospects
      .filter(
        (p) =>
          (p.status === "To Call" || p.status === "New" || p.priority === "Hot") &&
          !TERMINAL_STATUSES.includes(p.status) &&
          !overdue.some((o) => o.id === p.id) &&
          !todayCallbacks.some((o) => o.id === p.id),
      )
      .sort((a, b) => {
        const pr = { Hot: 0, Warm: 1, Cold: 2 };
        return pr[a.priority] - pr[b.priority] || a.callAttempts - b.callAttempts;
      }),
  ].slice(0, 12);

  const upcoming = prospects
    .filter((p) => p.nextCallbackAt && p.nextCallbackAt > end && !TERMINAL_STATUSES.includes(p.status))
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""))
    .slice(0, 8);

  const calls = (await db.calls.orderBy("calledAt").reverse().limit(12).toArray()) as CallRecord[];
  const activity = calls.map((c) => ({
    ...c,
    businessName: byId.get(c.prospectId)?.businessName ?? "Deleted prospect",
  }));

  const openRequirements: RequirementListItem[] = openReqs
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 10)
    .map((r) => {
      const p = byId.get(r.prospectId);
      return {
        ...r,
        businessName: p?.businessName ?? "Deleted prospect",
        phone: p?.phone ?? "",
        contactName: p?.contactName ?? "",
      };
    });

  return { stats, todayQueue, overdue: overdue.slice(0, 8), upcoming, activity, openRequirements };
}

export async function getQueue(skipIds: string[] = []): Promise<Prospect[]> {
  const db = getDb();
  const now = nowIso();
  const start = startOfTodayIso();
  const end = endOfTodayIso();
  const skip = new Set(skipIds);
  const all = (await db.prospects.toArray()).filter(
    (p) => !skip.has(p.id) && !TERMINAL_STATUSES.includes(p.status),
  );

  const overdue = all
    .filter((p) => p.nextCallbackAt && p.nextCallbackAt < now)
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
  const used = new Set(overdue.map((p) => p.id));

  const today = all
    .filter((p) => !used.has(p.id) && p.nextCallbackAt && p.nextCallbackAt >= start && p.nextCallbackAt <= end)
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
  today.forEach((p) => used.add(p.id));

  const hot = all
    .filter((p) => !used.has(p.id) && p.priority === "Hot")
    .sort((a, b) => a.callAttempts - b.callAttempts);
  hot.forEach((p) => used.add(p.id));

  const neverCalled = all
    .filter((p) => !used.has(p.id) && p.callAttempts === 0)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  neverCalled.forEach((p) => used.add(p.id));

  const followUps = all
    .filter((p) => !used.has(p.id) && (p.status === "Follow-up" || p.status === "Callback" || p.status === "Interested"))
    .sort((a, b) => (a.nextCallbackAt ?? "9").localeCompare(b.nextCallbackAt ?? "9"));
  followUps.forEach((p) => used.add(p.id));

  const rest = all
    .filter((p) => !used.has(p.id) && (p.status === "New" || p.status === "To Call" || p.status === "Called"))
    .sort((a, b) => a.callAttempts - b.callAttempts);

  return [...overdue, ...today, ...hot, ...neverCalled, ...followUps, ...rest];
}

export async function listCallbacks(): Promise<{
  overdue: Prospect[];
  today: Prospect[];
  tomorrow: Prospect[];
  upcoming: Prospect[];
}> {
  const db = getDb();
  const now = nowIso();
  const start = startOfTodayIso();
  const end = endOfTodayIso();
  const tStart = startOfTomorrowIso();
  const tEnd = endOfTomorrowIso();
  const all = (await db.prospects.toArray()).filter(
    (p) => p.nextCallbackAt && !TERMINAL_STATUSES.includes(p.status),
  );
  const overdue = all
    .filter((p) => (p.nextCallbackAt ?? "") < now)
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
  const today = all
    .filter((p) => (p.nextCallbackAt ?? "") >= start && (p.nextCallbackAt ?? "") <= end && (p.nextCallbackAt ?? "") >= now)
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
  const tomorrow = all
    .filter((p) => (p.nextCallbackAt ?? "") >= tStart && (p.nextCallbackAt ?? "") <= tEnd)
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
  const upcoming = all
    .filter((p) => (p.nextCallbackAt ?? "") > tEnd)
    .sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
  return { overdue, today, tomorrow, upcoming };
}

export async function completeCallback(prospectId: string): Promise<void> {
  await logCall({
    prospectId,
    outcome: "Callback Completed",
    notes: "Callback marked complete.",
    callbackAt: null,
  });
}

export async function rescheduleCallback(prospectId: string, at: string): Promise<void> {
  await logCall({
    prospectId,
    outcome: "Callback Rescheduled",
    notes: "Callback rescheduled.",
    callbackAt: at,
  });
}

export async function recordImport(meta: Omit<ImportRecord, "id" | "createdAt"> & { id?: string }): Promise<ImportRecord> {
  const row: ImportRecord = {
    id: meta.id ?? newId(),
    filename: meta.filename,
    sheets: meta.sheets,
    rows: meta.rows,
    imported: meta.imported,
    duplicates: meta.duplicates,
    skipped: meta.skipped,
    mapping: meta.mapping,
    createdAt: nowIso(),
  };
  await getDb().imports.add(row);
  return row;
}

export async function listImports(): Promise<ImportRecord[]> {
  const rows = await getDb().imports.toArray();
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getDbInfo(): Promise<{
  prospects: number;
  calls: number;
  imports: number;
  requirements: number;
}> {
  const db = getDb();
  return {
    prospects: await db.prospects.count(),
    calls: await db.calls.count(),
    imports: await db.imports.count(),
    requirements: await db.requirements.count(),
  };
}

export function hydrateRequirement(input: RequirementInput, existing?: Requirement): Requirement {
  const now = nowIso();
  return {
    id: input.id ?? existing?.id ?? newId(),
    prospectId: input.prospectId,
    partNumber: (input.partNumber ?? "").trim(),
    condition: input.condition ?? "OEM",
    brand: (input.brand ?? "").trim(),
    model: (input.model ?? "").trim(),
    priceQuoted: (input.priceQuoted ?? "").trim(),
    quantity: (input.quantity ?? "").trim(),
    notes: (input.notes ?? "").trim(),
    status: input.status ?? "Open",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function emptyRequirement(prospectId = ""): RequirementInput {
  return {
    prospectId,
    partNumber: "",
    condition: "OEM",
    brand: "",
    model: "",
    priceQuoted: "",
    quantity: "",
    notes: "",
    status: "Open",
  };
}

export function requirementFromRow(
  values: Partial<Record<string, string>>,
  extra: Record<string, string>,
): Omit<RequirementInput, "prospectId"> | null {
  const partNumber = (values.partNumber ?? "").trim();
  const brand = (values.brand ?? "").trim();
  const model = (values.model ?? "").trim();
  const priceQuoted = (values.priceQuoted ?? "").trim();
  const quantity = (values.quantity ?? "").trim();
  const inferred = inferConditionFromExtra(extra, values.condition);
  const condition = inferred || "OEM";
  if (!partNumber && !brand && !model && !priceQuoted && !values.condition && !inferred) {
    return null;
  }
  return {
    partNumber,
    condition: parseCondition(condition),
    brand,
    model,
    priceQuoted,
    quantity,
    notes: "",
    status: "Open",
  };
}

export async function createRequirement(input: RequirementInput): Promise<Requirement> {
  const row = hydrateRequirement(input);
  await getDb().requirements.add(row);
  return row;
}

export async function updateRequirement(
  id: string,
  patch: Partial<Requirement>,
): Promise<Requirement> {
  const db = getDb();
  const existing = await db.requirements.get(id);
  if (!existing) throw new Error("Requirement not found.");
  const next = hydrateRequirement({ ...existing, ...patch, id }, existing);
  await db.requirements.put(next);
  return next;
}

export async function deleteRequirement(id: string): Promise<void> {
  await getDb().requirements.delete(id);
}

export async function getRequirementsForProspect(prospectId: string): Promise<Requirement[]> {
  const rows = await getDb().requirements.where("prospectId").equals(prospectId).toArray();
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listRequirements(params: {
  q?: string;
  status?: RequirementStatus | "all";
  condition?: Requirement["condition"] | "all";
  page?: number;
  pageSize?: number;
}): Promise<{ rows: RequirementListItem[]; total: number }> {
  const db = getDb();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(200, Math.max(10, params.pageSize ?? 50));
  const q = (params.q ?? "").trim().toLowerCase();
  const [reqs, prospects] = await Promise.all([db.requirements.toArray(), db.prospects.toArray()]);
  const byId = new Map(prospects.map((p) => [p.id, p]));
  let rows: RequirementListItem[] = reqs.map((r) => {
    const p = byId.get(r.prospectId);
    return {
      ...r,
      businessName: p?.businessName ?? "Deleted prospect",
      phone: p?.phone ?? "",
      contactName: p?.contactName ?? "",
    };
  });
  if (params.status && params.status !== "all") {
    rows = rows.filter((r) => r.status === params.status);
  }
  if (params.condition && params.condition !== "all") {
    rows = rows.filter((r) => r.condition === params.condition);
  }
  if (q) {
    rows = rows.filter((r) =>
      [r.partNumber, r.brand, r.model, r.priceQuoted, r.notes, r.businessName, r.phone, r.contactName]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const total = rows.length;
  const start = (page - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), total };
}

async function requirementSearchHits(q: string): Promise<Set<string> | undefined> {
  const needle = q.trim().toLowerCase();
  if (!needle) return undefined;
  const rows = await getDb().requirements.toArray();
  const hits = new Set<string>();
  for (const r of rows) {
    const hay = [r.partNumber, r.brand, r.model, r.priceQuoted, r.notes, r.condition].join(" ").toLowerCase();
    if (hay.includes(needle)) hits.add(r.prospectId);
  }
  return hits;
}

async function prospectIdsWithRequirements(): Promise<Set<string>> {
  const rows = await getDb().requirements.toArray();
  return new Set(rows.map((r) => r.prospectId));
}

export async function exportBackup(): Promise<BackupPayload> {
  const db = getDb();
  return {
    version: 2,
    exportedAt: nowIso(),
    prospects: await db.prospects.toArray(),
    calls: await db.calls.toArray(),
    imports: await db.imports.toArray(),
    settings: await getSettings(),
    requirements: await db.requirements.toArray(),
  };
}

export async function restoreBackup(payload: BackupPayload): Promise<void> {
  if (!payload || (payload.version !== 1 && payload.version !== 2)) {
    throw new Error("Unsupported backup file.");
  }
  const db = getDb();
  await db.transaction("rw", db.prospects, db.calls, db.imports, db.settings, db.requirements, async () => {
    await db.prospects.clear();
    await db.calls.clear();
    await db.imports.clear();
    await db.requirements.clear();
    if (payload.prospects?.length) await db.prospects.bulkAdd(payload.prospects);
    if (payload.calls?.length) await db.calls.bulkAdd(payload.calls);
    if (payload.imports?.length) await db.imports.bulkAdd(payload.imports);
    if (payload.requirements?.length) await db.requirements.bulkAdd(payload.requirements);
    if (payload.settings) await db.settings.put({ ...payload.settings, id: "default" });
  });
}

export async function clearAll(): Promise<void> {
  const db = getDb();
  await db.transaction("rw", db.prospects, db.calls, db.imports, db.requirements, async () => {
    await db.prospects.clear();
    await db.calls.clear();
    await db.imports.clear();
    await db.requirements.clear();
  });
}

export async function importProspects(
  rows: ProspectInput[],
): Promise<{ imported: number; ids: string[] }> {
  const db = getDb();
  const settings = await getSettings();
  const prospects = rows.map((r) => hydrateProspect(r, settings));
  await db.prospects.bulkAdd(prospects);
  return { imported: prospects.length, ids: prospects.map((p) => p.id) };
}

export function coerceProspectInput(
  values: Partial<Record<string, string>>,
  extra: Record<string, string>,
  settings: AppSettings,
  sourceFallback = "Excel",
): ProspectInput {
  return {
    businessName: values.businessName ?? "",
    phone: values.phone ?? "",
    alternatePhone: values.alternatePhone ?? "",
    email: values.email ?? "",
    website: values.website ?? "",
    address: values.address ?? "",
    city: values.city ?? "",
    state: values.state ?? "",
    zip: values.zip ?? "",
    contactName: values.contactName ?? "",
    contactTitle: values.contactTitle ?? "",
    leadType: values.leadType ?? "",
    status: parseStatus(values.status ?? "", settings.defaultStatus),
    priority: parsePriority(values.priority ?? "", settings.defaultPriority),
    source: values.source || sourceFallback,
    remarks: values.remarks ?? "",
    nextAction: values.nextAction ?? "",
    extra,
  };
}
