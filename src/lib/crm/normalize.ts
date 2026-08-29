import type { CrmField, PartCondition, Priority, RequirementStatus, Status } from "./types";
import { PART_CONDITIONS, PRIORITIES, REQUIREMENT_STATUSES, STATUSES } from "./types";

const LEGAL_SUFFIXES = new Set([
  "llc",
  "inc",
  "corp",
  "ltd",
  "co",
  "company",
  "plc",
  "llp",
  "lp",
  "pc",
  "pllc",
  "limited",
  "incorporated",
  "corporation",
]);

export function normalizePhone(value: string | null | undefined): string {
  if (!value) return "";
  const digits = String(value).replace(/\D+/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

export function displayPhone(value: string | null | undefined): string {
  if (!value) return "—";
  const digits = normalizePhone(value);
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value.trim() || "—";
}

export function telHref(value: string | null | undefined): string | null {
  const digits = normalizePhone(value);
  if (!digits) return null;
  return `tel:+1${digits.length === 10 ? digits : digits}`;
}

export function normalizeName(value: string | null | undefined): string {
  if (!value) return "";
  const tokens = value
    .toLowerCase()
    .replace(/[&/_,.]+/g, " ")
    .replace(/['’]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => t !== "the" && !LEGAL_SUFFIXES.has(t));
  return tokens.join(" ").trim();
}

export function normalizeHeader(value: string): string {
  return value
    .toLowerCase()
    .replace(/[#]+/g, "")
    .replace(/[_./\\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const FIELD_ALIASES: Record<CrmField, string[]> = {
  businessName: [
    "business",
    "business name",
    "company",
    "company name",
    "vendor",
    "dealer",
    "account",
    "account name",
    "organization",
    "org",
    "firm",
    "customer",
    "customer name",
    "shop",
    "store",
    "dba",
    "legal name",
  ],
  phone: [
    "phone",
    "phone number",
    "telephone",
    "mobile",
    "contact number",
    "tel",
    "cell",
    "primary phone",
    "main phone",
    "phone 1",
    "phone1",
    "office phone",
    "work phone",
  ],
  alternatePhone: [
    "alternate phone",
    "alt phone",
    "phone 2",
    "phone2",
    "secondary phone",
    "mobile 2",
    "other phone",
    "cell 2",
  ],
  email: ["email", "e mail", "email address", "mail", "e-mail"],
  website: ["website", "web", "url", "site", "homepage", "web site", "www"],
  address: [
    "address",
    "street",
    "street address",
    "address 1",
    "address1",
    "addr",
    "line 1",
  ],
  city: ["city", "town", "locality"],
  state: ["state", "province", "region", "st"],
  zip: ["zip", "zip code", "postal", "postal code", "zipcode", "postcode"],
  contactName: [
    "contact",
    "contact name",
    "person",
    "contact person",
    "full name",
    "owner",
    "owner name",
  ],
  contactTitle: ["title", "contact title", "job title", "position", "role"],
  leadType: ["lead type", "type", "category", "industry", "segment", "vertical"],
  status: ["status", "stage", "lead status", "pipeline"],
  priority: ["priority", "heat", "rank", "temperature"],
  source: ["source", "lead source", "origin", "channel"],
  remarks: ["remarks", "notes", "comments", "comment", "description", "note"],
  nextAction: ["next action", "action", "next step", "follow up", "follow-up"],
  partNumber: [
    "part number",
    "part no",
    "part #",
    "part",
    "pn",
    "p n",
    "sku",
    "oem number",
    "oem no",
    "item number",
    "item no",
    "catalog number",
    "cross number",
    "requirement",
  ],
  condition: [
    "condition",
    "part type",
    "part condition",
    "oem used aftermarket",
    "new used",
    "quality",
  ],
  brand: ["brand", "make", "manufacturer", "mfr", "oem brand", "tractor brand"],
  model: ["model", "machine", "tractor model", "equipment model", "unit"],
  priceQuoted: [
    "price quoted",
    "quoted price",
    "price",
    "quote",
    "quoted",
    "unit price",
    "sell price",
    "amount",
  ],
  quantity: ["qty", "quantity", "qty needed", "units"],
};

const FIRST_NAME_ALIASES = ["first name", "firstname", "first", "given name"];
const LAST_NAME_ALIASES = ["last name", "lastname", "last", "surname", "family name"];

export type MappedField = CrmField | "ignore" | "contactFirst" | "contactLast";

export function mapHeader(header: string): MappedField {
  const n = normalizeHeader(header);
  if (!n) return "ignore";
  if (n === "name" || n === "business") return "businessName";
  if (FIRST_NAME_ALIASES.includes(n)) return "contactFirst";
  if (LAST_NAME_ALIASES.includes(n)) return "contactLast";
  if (n === "oem" || n === "used" || n === "aftermarket" || n === "after market") return "condition";
  for (const [field, aliases] of Object.entries(FIELD_ALIASES) as Array<
    [CrmField, string[]]
  >) {
    if (aliases.includes(n)) return field;
  }
  for (const [field, aliases] of Object.entries(FIELD_ALIASES) as Array<
    [CrmField, string[]]
  >) {
    if (aliases.some((a) => n === a || n.startsWith(`${a} `))) return field;
  }
  return "ignore";
}

export function cleanCell(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return String(value).replace(/\s+/g, " ").trim();
}

export function parseStatus(value: string, fallback: Status): Status {
  const n = value.trim().toLowerCase();
  if (!n) return fallback;
  const found = STATUSES.find((s) => s.toLowerCase() === n);
  if (found) return found;
  if (n === "dnc" || n.includes("do not")) return "Do Not Call";
  if (n.includes("interest") && n.includes("not")) return "Not Interested";
  if (n.includes("interest")) return "Interested";
  if (n.includes("callback") || n.includes("call back")) return "Callback";
  if (n.includes("follow")) return "Follow-up";
  if (n === "hot" || n === "warm") return "To Call";
  if (n.includes("win") || n.includes("won") || n.includes("converted")) return "Won";
  if (n.includes("lost") || n.includes("dead")) return "Lost";
  if (n.includes("qualif")) return "Qualified";
  if (n.includes("new")) return "New";
  if (n.includes("call")) return "To Call";
  return fallback;
}

export function parsePriority(value: string, fallback: Priority): Priority {
  const n = value.trim().toLowerCase();
  if (!n) return fallback;
  if (n === "hot" || n === "high" || n === "1") return "Hot";
  if (n === "cold" || n === "low" || n === "3") return "Cold";
  if (n === "warm" || n === "medium" || n === "2") return "Warm";
  const found = PRIORITIES.find((p) => p.toLowerCase() === n);
  return found ?? fallback;
}

export function parseCondition(value: string, fallback: PartCondition = "OEM"): PartCondition {
  const n = value.trim().toLowerCase();
  if (!n) return fallback;
  if (n === "oem" || n.includes("original") || n.includes("genuine") || n === "new") return "OEM";
  if (n.includes("after") || n === "am" || n.includes("replacement")) return "Aftermarket";
  if (n.includes("used") || n.includes("salvage") || n.includes("takeoff") || n.includes("take off")) {
    return "Used";
  }
  const found = PART_CONDITIONS.find((c) => c.toLowerCase() === n);
  return found ?? fallback;
}

export function parseRequirementStatus(
  value: string,
  fallback: RequirementStatus = "Open",
): RequirementStatus {
  const n = value.trim().toLowerCase();
  if (!n) return fallback;
  const found = REQUIREMENT_STATUSES.find((s) => s.toLowerCase() === n);
  if (found) return found;
  if (n.includes("quote")) return "Quoted";
  if (n.includes("order")) return "Ordered";
  if (n.includes("won") || n.includes("sold")) return "Won";
  if (n.includes("lost") || n.includes("cancel")) return "Lost";
  return fallback;
}

export function truthyCell(value: string | undefined): boolean {
  const n = (value ?? "").trim().toLowerCase();
  if (!n) return false;
  if (["n", "no", "0", "false", "f", "-"].includes(n)) return false;
  return true;
}

export function inferConditionFromExtra(extra: Record<string, string>, mapped?: string): PartCondition | "" {
  if (mapped) return parseCondition(mapped);
  for (const [key, val] of Object.entries(extra)) {
    const n = normalizeHeader(key);
    const t = val.trim();
    if (!t) continue;
    if (n === "oem" || n === "genuine" || n === "original") {
      if (truthyCell(t) || parseCondition(t) === "OEM") return "OEM";
    }
    if (n === "used" || n === "salvage") {
      if (truthyCell(t) || parseCondition(t) === "Used") return "Used";
    }
    if (n.includes("after")) {
      if (truthyCell(t) || parseCondition(t) === "Aftermarket") return "Aftermarket";
    }
  }
  return "";
}

export function mergeText(a: string, b: string): string {
  const left = a.trim();
  const right = b.trim();
  if (!left) return right;
  if (!right) return left;
  if (left.includes(right)) return left;
  if (right.includes(left)) return right;
  return `${left}\n${right}`;
}

export function preferFilled(existing: string, incoming: string): string {
  return existing.trim() ? existing : incoming.trim();
}

export function isBlankRow(values: Record<string, unknown>): boolean {
  return Object.values(values).every((v) => cleanCell(v) === "");
}
