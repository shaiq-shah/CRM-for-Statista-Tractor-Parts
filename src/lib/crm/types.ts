export const STATUSES = [
  "New",
  "To Call",
  "Called",
  "Callback",
  "Interested",
  "Follow-up",
  "Qualified",
  "Won",
  "Lost",
  "Not Interested",
  "Do Not Call",
] as const;

export type Status = (typeof STATUSES)[number];

export const TERMINAL_STATUSES: Status[] = ["Won", "Lost", "Do Not Call"];

export const PRIORITIES = ["Hot", "Warm", "Cold"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CALL_OUTCOMES = [
  "No Answer",
  "Voicemail",
  "Spoke With Receptionist",
  "Spoke With Owner",
  "Spoke With Manager",
  "Interested",
  "Very Interested",
  "Send Information",
  "Callback Requested",
  "Not Interested",
  "Wrong Number",
  "Disconnected",
  "Already Has Supplier",
  "Do Not Call",
  "Qualified",
  "Converted / Won",
  "Callback Completed",
  "Callback Rescheduled",
] as const;

export type CallOutcome = (typeof CALL_OUTCOMES)[number];

export const LOG_CALL_OUTCOMES: CallOutcome[] = CALL_OUTCOMES.filter(
  (o) => o !== "Callback Completed" && o !== "Callback Rescheduled",
);

export const PART_CONDITIONS = ["OEM", "Used", "Aftermarket"] as const;
export type PartCondition = (typeof PART_CONDITIONS)[number];

export const REQUIREMENT_STATUSES = ["Open", "Quoted", "Ordered", "Won", "Lost"] as const;
export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number];

export const TRACTOR_BRANDS = [
  "John Deere",
  "Mahindra",
  "Massey Ferguson",
  "Kubota",
  "Case IH",
  "New Holland",
  "Ford",
  "International Harvester",
  "CAT",
  "Yanmar",
  "Kioti",
  "Bobcat",
  "Other",
] as const;

export const CRM_FIELDS = [
  "businessName",
  "phone",
  "alternatePhone",
  "email",
  "website",
  "address",
  "city",
  "state",
  "zip",
  "contactName",
  "contactTitle",
  "leadType",
  "status",
  "priority",
  "source",
  "remarks",
  "nextAction",
  "partNumber",
  "condition",
  "brand",
  "model",
  "priceQuoted",
  "quantity",
] as const;

export type CrmField = (typeof CRM_FIELDS)[number];

export const CRM_FIELD_LABELS: Record<CrmField, string> = {
  businessName: "Business Name",
  phone: "Phone",
  alternatePhone: "Alternate Phone",
  email: "Email",
  website: "Website",
  address: "Address",
  city: "City",
  state: "State",
  zip: "ZIP",
  contactName: "Contact Name",
  contactTitle: "Contact Title",
  leadType: "Lead Type",
  status: "Status",
  priority: "Priority",
  source: "Source",
  remarks: "Remarks",
  nextAction: "Next Action",
  partNumber: "Part Number",
  condition: "Condition (OEM / Used / Aftermarket)",
  brand: "Brand",
  model: "Model",
  priceQuoted: "Price Quoted",
  quantity: "Quantity",
};

export const PROSPECT_FIELDS = [
  "businessName",
  "phone",
  "alternatePhone",
  "email",
  "website",
  "address",
  "city",
  "state",
  "zip",
  "contactName",
  "contactTitle",
  "leadType",
  "status",
  "priority",
  "source",
  "remarks",
  "nextAction",
] as const;

export type ProspectField = (typeof PROSPECT_FIELDS)[number];

export interface Prospect {
  id: string;
  businessName: string;
  phone: string;
  alternatePhone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contactName: string;
  contactTitle: string;
  leadType: string;
  status: Status;
  priority: Priority;
  source: string;
  remarks: string;
  nextAction: string;
  lastCalledAt: string | null;
  nextCallbackAt: string | null;
  callAttempts: number;
  extra: Record<string, string>;
  phoneNormalized: string;
  nameNormalized: string;
  createdAt: string;
  updatedAt: string;
}

export type ProspectInput = Omit<
  Prospect,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "phoneNormalized"
  | "nameNormalized"
  | "callAttempts"
  | "lastCalledAt"
  | "nextCallbackAt"
> & {
  id?: string;
  callAttempts?: number;
  lastCalledAt?: string | null;
  nextCallbackAt?: string | null;
};

export interface Requirement {
  id: string;
  prospectId: string;
  partNumber: string;
  condition: PartCondition;
  brand: string;
  model: string;
  priceQuoted: string;
  quantity: string;
  notes: string;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
}

export type RequirementInput = Omit<Requirement, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export interface CallRecord {
  id: string;
  prospectId: string;
  calledAt: string;
  outcome: CallOutcome;
  contactName: string;
  notes: string;
  callbackAt: string | null;
  nextAction: string;
  createdAt: string;
}

export interface ImportRecord {
  id: string;
  filename: string;
  createdAt: string;
  sheets: number;
  rows: number;
  imported: number;
  duplicates: number;
  skipped: number;
  mapping: Record<string, string>;
}

export interface AppSettings {
  id: "default";
  defaultStatus: Status;
  defaultPriority: Priority;
  defaultCallbackMinutes: number;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: "default",
  defaultStatus: "New",
  defaultPriority: "Warm",
  defaultCallbackMinutes: 60,
  updatedAt: new Date(0).toISOString(),
};

export interface LogCallInput {
  prospectId: string;
  outcome: CallOutcome;
  contactName?: string;
  notes?: string;
  callbackAt?: string | null;
  nextAction?: string;
  calledAt?: string;
  requirement?: Omit<RequirementInput, "prospectId"> | null;
}

export type ProspectFilter =
  | "all"
  | "new"
  | "to-call"
  | "never-called"
  | "called-today"
  | "callbacks-today"
  | "overdue"
  | "requirements"
  | "interested"
  | "hot"
  | "warm"
  | "cold"
  | "follow-up"
  | "won"
  | "lost"
  | "do-not-call";

export const FILTER_LABELS: Record<ProspectFilter, string> = {
  all: "All",
  new: "New",
  "to-call": "To Call",
  "never-called": "Never Called",
  "called-today": "Called Today",
  "callbacks-today": "Callbacks Today",
  overdue: "Overdue callbacks",
  requirements: "Has requirement",
  interested: "Interested",
  hot: "Hot",
  warm: "Warm",
  cold: "Cold",
  "follow-up": "Follow-up",
  won: "Won",
  lost: "Lost",
  "do-not-call": "Do Not Call",
};

export type SortField =
  | "businessName"
  | "phone"
  | "contactName"
  | "city"
  | "status"
  | "priority"
  | "lastCalledAt"
  | "nextCallbackAt"
  | "callAttempts"
  | "updatedAt"
  | "createdAt";

export interface ListProspectsParams {
  q?: string;
  filter?: ProspectFilter;
  page?: number;
  pageSize?: number;
  sort?: SortField;
  dir?: "asc" | "desc";
  ids?: string[];
}

export interface DashboardStats {
  total: number;
  toCall: number;
  calledToday: number;
  callbacksToday: number;
  requirements: number;
  interested: number;
}

export interface ActivityItem {
  id: string;
  calledAt: string;
  outcome: CallOutcome;
  businessName: string;
  prospectId: string;
}

export type DuplicateAction = "merge" | "keep" | "skip";

export interface DuplicateMatch {
  incomingIndex: number;
  existingId: string | null;
  incomingDuplicateOf: number | null;
  reasons: string[];
  existing: Prospect | null;
}

export interface ParsedRow {
  sheet: string;
  rowNumber: number;
  values: Partial<Record<CrmField, string>>;
  extra: Record<string, string>;
  raw: Record<string, string>;
}

export interface ColumnMapping {
  excelColumn: string;
  field: CrmField | "ignore" | "contactFirst" | "contactLast";
}

export interface ImportPreview {
  filename: string;
  sheets: string[];
  sheetCount: number;
  rowsFound: number;
  rows: ParsedRow[];
  mapping: ColumnMapping[];
  newCount: number;
  duplicateCount: number;
  invalidCount: number;
  duplicates: DuplicateMatch[];
  invalid: Array<{ index: number; reason: string }>;
}

export interface BackupPayload {
  version: 1 | 2;
  exportedAt: string;
  prospects: Prospect[];
  calls: CallRecord[];
  imports: ImportRecord[];
  settings: AppSettings;
  requirements?: Requirement[];
}

export interface RequirementListItem extends Requirement {
  businessName: string;
  phone: string;
  contactName: string;
}
