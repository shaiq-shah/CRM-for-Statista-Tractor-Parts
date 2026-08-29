import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Dexie } from "../_libs/dexie.mjs";
import { a as format, c as addMinutes, d as addDays, i as isToday, l as startOfDay, n as parseISO, o as endOfDay, r as isTomorrow, s as isValid, t as subHours, u as addHours } from "../_libs/date-fns.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as DEFAULT_SETTINGS, c as PART_CONDITIONS, d as STATUSES, f as TERMINAL_STATUSES, l as PRIORITIES } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-CZT9t7MV.js
var LEGAL_SUFFIXES = /* @__PURE__ */ new Set([
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
	"corporation"
]);
function normalizePhone(value) {
	if (!value) return "";
	const digits = String(value).replace(/\D+/g, "");
	if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
	if (digits.length > 10) return digits.slice(-10);
	return digits;
}
function displayPhone(value) {
	if (!value) return "—";
	const digits = normalizePhone(value);
	if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
	return value.trim() || "—";
}
function telHref(value) {
	const digits = normalizePhone(value);
	if (!digits) return null;
	return `tel:+1${digits.length === 10 ? digits : digits}`;
}
function normalizeName(value) {
	if (!value) return "";
	return value.toLowerCase().replace(/[&/_,.]+/g, " ").replace(/['’]/g, "").split(/\s+/).filter(Boolean).filter((t) => t !== "the" && !LEGAL_SUFFIXES.has(t)).join(" ").trim();
}
function normalizeHeader(value) {
	return value.toLowerCase().replace(/[#]+/g, "").replace(/[_./\\-]+/g, " ").replace(/\s+/g, " ").trim();
}
var FIELD_ALIASES = {
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
		"legal name"
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
		"work phone"
	],
	alternatePhone: [
		"alternate phone",
		"alt phone",
		"phone 2",
		"phone2",
		"secondary phone",
		"mobile 2",
		"other phone",
		"cell 2"
	],
	email: [
		"email",
		"e mail",
		"email address",
		"mail",
		"e-mail"
	],
	website: [
		"website",
		"web",
		"url",
		"site",
		"homepage",
		"web site",
		"www"
	],
	address: [
		"address",
		"street",
		"street address",
		"address 1",
		"address1",
		"addr",
		"line 1"
	],
	city: [
		"city",
		"town",
		"locality"
	],
	state: [
		"state",
		"province",
		"region",
		"st"
	],
	zip: [
		"zip",
		"zip code",
		"postal",
		"postal code",
		"zipcode",
		"postcode"
	],
	contactName: [
		"contact",
		"contact name",
		"person",
		"contact person",
		"full name",
		"owner",
		"owner name"
	],
	contactTitle: [
		"title",
		"contact title",
		"job title",
		"position",
		"role"
	],
	leadType: [
		"lead type",
		"type",
		"category",
		"industry",
		"segment",
		"vertical"
	],
	status: [
		"status",
		"stage",
		"lead status",
		"pipeline"
	],
	priority: [
		"priority",
		"heat",
		"rank",
		"temperature"
	],
	source: [
		"source",
		"lead source",
		"origin",
		"channel"
	],
	remarks: [
		"remarks",
		"notes",
		"comments",
		"comment",
		"description",
		"note"
	],
	nextAction: [
		"next action",
		"action",
		"next step",
		"follow up",
		"follow-up"
	],
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
		"requirement"
	],
	condition: [
		"condition",
		"part type",
		"part condition",
		"oem used aftermarket",
		"new used",
		"quality"
	],
	brand: [
		"brand",
		"make",
		"manufacturer",
		"mfr",
		"oem brand",
		"tractor brand"
	],
	model: [
		"model",
		"machine",
		"tractor model",
		"equipment model",
		"unit"
	],
	priceQuoted: [
		"price quoted",
		"quoted price",
		"price",
		"quote",
		"quoted",
		"unit price",
		"sell price",
		"amount"
	],
	quantity: [
		"qty",
		"quantity",
		"qty needed",
		"units"
	]
};
var FIRST_NAME_ALIASES = [
	"first name",
	"firstname",
	"first",
	"given name"
];
var LAST_NAME_ALIASES = [
	"last name",
	"lastname",
	"last",
	"surname",
	"family name"
];
function mapHeader(header) {
	const n = normalizeHeader(header);
	if (!n) return "ignore";
	if (n === "name" || n === "business") return "businessName";
	if (FIRST_NAME_ALIASES.includes(n)) return "contactFirst";
	if (LAST_NAME_ALIASES.includes(n)) return "contactLast";
	if (n === "oem" || n === "used" || n === "aftermarket" || n === "after market") return "condition";
	for (const [field, aliases] of Object.entries(FIELD_ALIASES)) if (aliases.includes(n)) return field;
	for (const [field, aliases] of Object.entries(FIELD_ALIASES)) if (aliases.some((a) => n === a || n.startsWith(`${a} `))) return field;
	return "ignore";
}
function cleanCell(value) {
	if (value == null) return "";
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return String(value).replace(/\s+/g, " ").trim();
}
function parseStatus(value, fallback) {
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
function parsePriority(value, fallback) {
	const n = value.trim().toLowerCase();
	if (!n) return fallback;
	if (n === "hot" || n === "high" || n === "1") return "Hot";
	if (n === "cold" || n === "low" || n === "3") return "Cold";
	if (n === "warm" || n === "medium" || n === "2") return "Warm";
	return PRIORITIES.find((p) => p.toLowerCase() === n) ?? fallback;
}
function parseCondition(value, fallback = "OEM") {
	const n = value.trim().toLowerCase();
	if (!n) return fallback;
	if (n === "oem" || n.includes("original") || n.includes("genuine") || n === "new") return "OEM";
	if (n.includes("after") || n === "am" || n.includes("replacement")) return "Aftermarket";
	if (n.includes("used") || n.includes("salvage") || n.includes("takeoff") || n.includes("take off")) return "Used";
	return PART_CONDITIONS.find((c) => c.toLowerCase() === n) ?? fallback;
}
function truthyCell(value) {
	const n = (value ?? "").trim().toLowerCase();
	if (!n) return false;
	if ([
		"n",
		"no",
		"0",
		"false",
		"f",
		"-"
	].includes(n)) return false;
	return true;
}
function inferConditionFromExtra(extra, mapped) {
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
function mergeText(a, b) {
	const left = a.trim();
	const right = b.trim();
	if (!left) return right;
	if (!right) return left;
	if (left.includes(right)) return left;
	if (right.includes(left)) return right;
	return `${left}\n${right}`;
}
function preferFilled(existing, incoming) {
	return existing.trim() ? existing : incoming.trim();
}
function isBlankRow(values) {
	return Object.values(values).every((v) => cleanCell(v) === "");
}
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function startOfTodayIso() {
	return startOfDay(/* @__PURE__ */ new Date()).toISOString();
}
function endOfTodayIso() {
	return endOfDay(/* @__PURE__ */ new Date()).toISOString();
}
function startOfTomorrowIso() {
	return startOfDay(addDays(/* @__PURE__ */ new Date(), 1)).toISOString();
}
function endOfTomorrowIso() {
	return endOfDay(addDays(/* @__PURE__ */ new Date(), 1)).toISOString();
}
function parseMaybeDate(value) {
	if (value == null || value === "") return null;
	if (value instanceof Date) return isValid(value) ? value : null;
	if (typeof value === "number") {
		const d = new Date(value);
		return isValid(d) ? d : null;
	}
	const raw = String(value).trim();
	if (!raw) return null;
	const iso = parseISO(raw);
	if (isValid(iso)) return iso;
	const d = new Date(raw);
	return isValid(d) ? d : null;
}
function formatDateTime(iso) {
	if (!iso) return "—";
	const d = parseMaybeDate(iso);
	if (!d) return "—";
	return format(d, "d MMM yyyy — h:mm a");
}
function formatTime(iso) {
	if (!iso) return "—";
	const d = parseMaybeDate(iso);
	if (!d) return "—";
	return format(d, "h:mm a");
}
function formatTimeShort(iso) {
	if (!iso) return "—";
	const d = parseMaybeDate(iso);
	if (!d) return "—";
	return format(d, "h:mm a");
}
function formatRelativeDay(iso) {
	if (!iso) return "—";
	const d = parseMaybeDate(iso);
	if (!d) return "—";
	if (isToday(d)) return `Today · ${format(d, "h:mm a")}`;
	if (isTomorrow(d)) return `Tomorrow · ${format(d, "h:mm a")}`;
	return format(d, "d MMM yyyy — h:mm a");
}
function datetimeLocalValue(iso) {
	if (!iso) return "";
	const d = parseMaybeDate(iso);
	if (!d) return "";
	return format(d, "yyyy-MM-dd'T'HH:mm");
}
function fromDatetimeLocal(value) {
	if (!value) return null;
	const d = new Date(value);
	return isValid(d) ? d.toISOString() : null;
}
function defaultCallbackIso(minutes) {
	return addMinutes(/* @__PURE__ */ new Date(), minutes).toISOString();
}
var CrmDB = class extends Dexie {
	prospects;
	calls;
	imports;
	settings;
	requirements;
	constructor() {
		super("calldesk-crm");
		this.version(1).stores({
			prospects: "id, phoneNormalized, nameNormalized, status, priority, nextCallbackAt, lastCalledAt, createdAt, updatedAt, city, source, [nameNormalized+city]",
			calls: "id, prospectId, calledAt, createdAt, outcome",
			imports: "id, createdAt",
			settings: "id"
		});
		this.version(2).stores({
			prospects: "id, phoneNormalized, nameNormalized, status, priority, nextCallbackAt, lastCalledAt, createdAt, updatedAt, city, source, [nameNormalized+city]",
			calls: "id, prospectId, calledAt, createdAt, outcome",
			imports: "id, createdAt",
			settings: "id",
			requirements: "id, prospectId, partNumber, brand, condition, status, createdAt, updatedAt"
		});
	}
};
var _db = null;
function getDb() {
	if (typeof indexedDB === "undefined") throw new Error("CallDesk needs a browser with IndexedDB.");
	if (!_db) _db = new CrmDB();
	return _db;
}
function newId() {
	return crypto.randomUUID();
}
function emptyProspect() {
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
		extra: {}
	};
}
function hydrateProspect(input, settings, existing) {
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
		updatedAt: now
	};
}
function mergeProspects(primary, incoming) {
	const extra = {
		...incoming.extra,
		...primary.extra
	};
	return hydrateProspect({
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
		priority: primary.priority
	}, void 0, primary);
}
function matchesSearch(p, q, requirementHits) {
	const needle = q.trim().toLowerCase();
	if (!needle) return true;
	if (requirementHits?.has(p.id)) return true;
	const phoneQ = needle.replace(/\D+/g, "");
	if ([
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
		...Object.values(p.extra)
	].join(" ").toLowerCase().includes(needle)) return true;
	if (phoneQ && (p.phoneNormalized.includes(phoneQ) || p.alternatePhone.replace(/\D+/g, "").includes(phoneQ))) return true;
	return false;
}
function inFilter(p, filter, now) {
	const start = startOfTodayIso();
	const end = endOfTodayIso();
	switch (filter) {
		case "all": return true;
		case "new": return p.status === "New";
		case "to-call": return p.status === "To Call" || p.status === "New";
		case "never-called": return p.callAttempts === 0 && !p.lastCalledAt;
		case "called-today": return !!p.lastCalledAt && p.lastCalledAt >= start && p.lastCalledAt <= end;
		case "callbacks-today": return !!p.nextCallbackAt && p.nextCallbackAt >= start && p.nextCallbackAt <= end;
		case "overdue": return !!p.nextCallbackAt && p.nextCallbackAt < now && !TERMINAL_STATUSES.includes(p.status);
		case "requirements": return true;
		case "interested": return p.status === "Interested";
		case "hot": return p.priority === "Hot";
		case "warm": return p.priority === "Warm";
		case "cold": return p.priority === "Cold";
		case "follow-up": return p.status === "Follow-up";
		case "won": return p.status === "Won";
		case "lost": return p.status === "Lost";
		case "do-not-call": return p.status === "Do Not Call";
		default: return true;
	}
}
function compareProspects(a, b, sort, dir) {
	const mul = dir === "asc" ? 1 : -1;
	const av = a[sort];
	const bv = b[sort];
	if (av == null && bv == null) return 0;
	if (av == null) return 1;
	if (bv == null) return -1;
	if (typeof av === "number" && typeof bv === "number") return (av - bv) * mul;
	return String(av).localeCompare(String(bv), void 0, { sensitivity: "base" }) * mul;
}
async function getSettings() {
	return await getDb().settings.get("default") ?? {
		...DEFAULT_SETTINGS,
		updatedAt: nowIso()
	};
}
async function saveSettings(patch) {
	const db = getDb();
	const next = {
		...await getSettings(),
		...patch,
		id: "default",
		updatedAt: nowIso()
	};
	await db.settings.put(next);
	return next;
}
async function listProspects(params = {}) {
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
	return {
		rows: rows.slice(start, start + pageSize),
		total
	};
}
async function getAllProspects() {
	return getDb().prospects.toArray();
}
async function getProspect(id) {
	return getDb().prospects.get(id);
}
async function createProspect(input) {
	const db = getDb();
	const prospect = hydrateProspect(input, await getSettings());
	await db.prospects.add(prospect);
	return prospect;
}
async function updateProspect(id, patch) {
	const db = getDb();
	const existing = await db.prospects.get(id);
	if (!existing) throw new Error("Prospect not found.");
	const next = hydrateProspect({
		...existing,
		...patch,
		id
	}, void 0, existing);
	await db.prospects.put(next);
	return next;
}
async function deleteProspects(ids) {
	const db = getDb();
	await db.transaction("rw", db.prospects, db.calls, db.requirements, async () => {
		await db.prospects.bulkDelete(ids);
		await db.calls.where("prospectId").anyOf(ids).delete();
		await db.requirements.where("prospectId").anyOf(ids).delete();
	});
	return ids.length;
}
async function bulkUpdate(ids, patch) {
	const db = getDb();
	const now = nowIso();
	await db.transaction("rw", db.prospects, async () => {
		const next = (await db.prospects.bulkGet(ids)).filter((p) => !!p).map((p) => ({
			...p,
			...patch,
			updatedAt: now
		}));
		await db.prospects.bulkPut(next);
	});
}
function statusFromOutcome(outcome, current) {
	switch (outcome) {
		case "Interested":
		case "Very Interested": return "Interested";
		case "Not Interested":
		case "Already Has Supplier": return "Not Interested";
		case "Do Not Call": return "Do Not Call";
		case "Converted / Won": return "Won";
		case "Qualified": return "Qualified";
		case "Callback Requested":
		case "Callback Rescheduled": return "Callback";
		case "Send Information": return "Follow-up";
		case "Wrong Number":
		case "Disconnected": return "Lost";
		case "Callback Completed": return current === "Callback" ? "Called" : current;
		default: return current === "New" || current === "To Call" ? "Called" : current;
	}
}
async function logCall(input) {
	const db = getDb();
	const prospect = await db.prospects.get(input.prospectId);
	if (!prospect) throw new Error("Prospect not found.");
	const calledAt = input.calledAt ?? nowIso();
	const callbackAt = input.callbackAt || null;
	const record = {
		id: newId(),
		prospectId: prospect.id,
		calledAt,
		outcome: input.outcome,
		contactName: (input.contactName ?? prospect.contactName).trim(),
		notes: (input.notes ?? "").trim(),
		callbackAt,
		nextAction: (input.nextAction ?? "").trim(),
		createdAt: nowIso()
	};
	const nextStatus = statusFromOutcome(input.outcome, prospect.status);
	const next = {
		...prospect,
		lastCalledAt: calledAt,
		callAttempts: prospect.callAttempts + 1,
		status: nextStatus,
		nextCallbackAt: callbackAt ?? (input.outcome === "Callback Completed" ? null : prospect.nextCallbackAt),
		nextAction: record.nextAction || prospect.nextAction,
		contactName: record.contactName || prospect.contactName,
		remarks: record.notes ? mergeText(prospect.remarks, record.notes) : prospect.remarks,
		updatedAt: nowIso()
	};
	await db.transaction("rw", db.prospects, db.calls, db.requirements, async () => {
		await db.calls.add(record);
		await db.prospects.put(next);
		const req = input.requirement;
		if (req && (req.partNumber?.trim() || req.brand?.trim() || req.model?.trim() || req.priceQuoted?.trim())) await db.requirements.add(hydrateRequirement({
			...req,
			prospectId: prospect.id
		}));
	});
	return record;
}
async function listCalls(params) {
	const db = getDb();
	const page = Math.max(1, params.page ?? 1);
	const pageSize = Math.min(200, Math.max(10, params.pageSize ?? 50));
	let rows = params.prospectId ? await db.calls.where("prospectId").equals(params.prospectId).toArray() : await db.calls.toArray();
	rows.sort((a, b) => b.calledAt.localeCompare(a.calledAt));
	const prospects = await db.prospects.toArray();
	const byId = new Map(prospects.map((p) => [p.id, p]));
	const q = (params.q ?? "").trim().toLowerCase();
	let joined = rows.map((c) => {
		const p = byId.get(c.prospectId);
		return {
			...c,
			businessName: p?.businessName ?? "Deleted prospect",
			phone: p?.phone ?? ""
		};
	});
	if (q) joined = joined.filter((c) => c.businessName.toLowerCase().includes(q) || c.outcome.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q));
	const total = joined.length;
	const start = (page - 1) * pageSize;
	return {
		rows: joined.slice(start, start + pageSize),
		total
	};
}
async function getCallsForProspect(id) {
	return (await getDb().calls.where("prospectId").equals(id).toArray()).sort((a, b) => b.calledAt.localeCompare(a.calledAt));
}
async function getDashboard() {
	const db = getDb();
	const now = nowIso();
	const start = startOfTodayIso();
	const end = endOfTodayIso();
	const prospects = await db.prospects.toArray();
	const requirements = await db.requirements.toArray();
	const byId = new Map(prospects.map((p) => [p.id, p]));
	const overdue = prospects.filter((p) => p.nextCallbackAt && p.nextCallbackAt < now && !TERMINAL_STATUSES.includes(p.status)).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
	const todayCallbacks = prospects.filter((p) => p.nextCallbackAt && p.nextCallbackAt >= start && p.nextCallbackAt <= end).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
	const toCallList = prospects.filter((p) => !TERMINAL_STATUSES.includes(p.status) && (p.status === "New" || p.status === "To Call" || p.status === "Callback" || p.callAttempts === 0));
	const openReqs = requirements.filter((r) => r.status === "Open" || r.status === "Quoted");
	const stats = {
		total: prospects.length,
		toCall: toCallList.length,
		calledToday: prospects.filter((p) => p.lastCalledAt && p.lastCalledAt >= start && p.lastCalledAt <= end).length,
		callbacksToday: todayCallbacks.length,
		requirements: openReqs.length,
		interested: prospects.filter((p) => p.status === "Interested").length
	};
	const todayQueue = [
		...overdue,
		...todayCallbacks.filter((p) => !overdue.some((o) => o.id === p.id)),
		...prospects.filter((p) => (p.status === "To Call" || p.status === "New" || p.priority === "Hot") && !TERMINAL_STATUSES.includes(p.status) && !overdue.some((o) => o.id === p.id) && !todayCallbacks.some((o) => o.id === p.id)).sort((a, b) => {
			const pr = {
				Hot: 0,
				Warm: 1,
				Cold: 2
			};
			return pr[a.priority] - pr[b.priority] || a.callAttempts - b.callAttempts;
		})
	].slice(0, 12);
	const upcoming = prospects.filter((p) => p.nextCallbackAt && p.nextCallbackAt > end && !TERMINAL_STATUSES.includes(p.status)).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? "")).slice(0, 8);
	const activity = (await db.calls.orderBy("calledAt").reverse().limit(12).toArray()).map((c) => ({
		...c,
		businessName: byId.get(c.prospectId)?.businessName ?? "Deleted prospect"
	}));
	const openRequirements = openReqs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 10).map((r) => {
		const p = byId.get(r.prospectId);
		return {
			...r,
			businessName: p?.businessName ?? "Deleted prospect",
			phone: p?.phone ?? "",
			contactName: p?.contactName ?? ""
		};
	});
	return {
		stats,
		todayQueue,
		overdue: overdue.slice(0, 8),
		upcoming,
		activity,
		openRequirements
	};
}
async function getQueue(skipIds = []) {
	const db = getDb();
	const now = nowIso();
	const start = startOfTodayIso();
	const end = endOfTodayIso();
	const skip = new Set(skipIds);
	const all = (await db.prospects.toArray()).filter((p) => !skip.has(p.id) && !TERMINAL_STATUSES.includes(p.status));
	const overdue = all.filter((p) => p.nextCallbackAt && p.nextCallbackAt < now).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
	const used = new Set(overdue.map((p) => p.id));
	const today = all.filter((p) => !used.has(p.id) && p.nextCallbackAt && p.nextCallbackAt >= start && p.nextCallbackAt <= end).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""));
	today.forEach((p) => used.add(p.id));
	const hot = all.filter((p) => !used.has(p.id) && p.priority === "Hot").sort((a, b) => a.callAttempts - b.callAttempts);
	hot.forEach((p) => used.add(p.id));
	const neverCalled = all.filter((p) => !used.has(p.id) && p.callAttempts === 0).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
	neverCalled.forEach((p) => used.add(p.id));
	const followUps = all.filter((p) => !used.has(p.id) && (p.status === "Follow-up" || p.status === "Callback" || p.status === "Interested")).sort((a, b) => (a.nextCallbackAt ?? "9").localeCompare(b.nextCallbackAt ?? "9"));
	followUps.forEach((p) => used.add(p.id));
	const rest = all.filter((p) => !used.has(p.id) && (p.status === "New" || p.status === "To Call" || p.status === "Called")).sort((a, b) => a.callAttempts - b.callAttempts);
	return [
		...overdue,
		...today,
		...hot,
		...neverCalled,
		...followUps,
		...rest
	];
}
async function listCallbacks() {
	const db = getDb();
	const now = nowIso();
	const start = startOfTodayIso();
	const end = endOfTodayIso();
	const tStart = startOfTomorrowIso();
	const tEnd = endOfTomorrowIso();
	const all = (await db.prospects.toArray()).filter((p) => p.nextCallbackAt && !TERMINAL_STATUSES.includes(p.status));
	return {
		overdue: all.filter((p) => (p.nextCallbackAt ?? "") < now).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? "")),
		today: all.filter((p) => (p.nextCallbackAt ?? "") >= start && (p.nextCallbackAt ?? "") <= end && (p.nextCallbackAt ?? "") >= now).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? "")),
		tomorrow: all.filter((p) => (p.nextCallbackAt ?? "") >= tStart && (p.nextCallbackAt ?? "") <= tEnd).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? "")),
		upcoming: all.filter((p) => (p.nextCallbackAt ?? "") > tEnd).sort((a, b) => (a.nextCallbackAt ?? "").localeCompare(b.nextCallbackAt ?? ""))
	};
}
async function completeCallback(prospectId) {
	await logCall({
		prospectId,
		outcome: "Callback Completed",
		notes: "Callback marked complete.",
		callbackAt: null
	});
}
async function rescheduleCallback(prospectId, at) {
	await logCall({
		prospectId,
		outcome: "Callback Rescheduled",
		notes: "Callback rescheduled.",
		callbackAt: at
	});
}
async function recordImport(meta) {
	const row = {
		id: meta.id ?? newId(),
		filename: meta.filename,
		sheets: meta.sheets,
		rows: meta.rows,
		imported: meta.imported,
		duplicates: meta.duplicates,
		skipped: meta.skipped,
		mapping: meta.mapping,
		createdAt: nowIso()
	};
	await getDb().imports.add(row);
	return row;
}
async function listImports() {
	return (await getDb().imports.toArray()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
async function getDbInfo() {
	const db = getDb();
	return {
		prospects: await db.prospects.count(),
		calls: await db.calls.count(),
		imports: await db.imports.count(),
		requirements: await db.requirements.count()
	};
}
function hydrateRequirement(input, existing) {
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
		updatedAt: now
	};
}
function emptyRequirement(prospectId = "") {
	return {
		prospectId,
		partNumber: "",
		condition: "OEM",
		brand: "",
		model: "",
		priceQuoted: "",
		quantity: "",
		notes: "",
		status: "Open"
	};
}
function requirementFromRow(values, extra) {
	const partNumber = (values.partNumber ?? "").trim();
	const brand = (values.brand ?? "").trim();
	const model = (values.model ?? "").trim();
	const priceQuoted = (values.priceQuoted ?? "").trim();
	const quantity = (values.quantity ?? "").trim();
	const inferred = inferConditionFromExtra(extra, values.condition);
	const condition = inferred || "OEM";
	if (!partNumber && !brand && !model && !priceQuoted && !values.condition && !inferred) return null;
	return {
		partNumber,
		condition: parseCondition(condition),
		brand,
		model,
		priceQuoted,
		quantity,
		notes: "",
		status: "Open"
	};
}
async function createRequirement(input) {
	const row = hydrateRequirement(input);
	await getDb().requirements.add(row);
	return row;
}
async function updateRequirement(id, patch) {
	const db = getDb();
	const existing = await db.requirements.get(id);
	if (!existing) throw new Error("Requirement not found.");
	const next = hydrateRequirement({
		...existing,
		...patch,
		id
	}, existing);
	await db.requirements.put(next);
	return next;
}
async function deleteRequirement(id) {
	await getDb().requirements.delete(id);
}
async function getRequirementsForProspect(prospectId) {
	return (await getDb().requirements.where("prospectId").equals(prospectId).toArray()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
async function listRequirements(params) {
	const db = getDb();
	const page = Math.max(1, params.page ?? 1);
	const pageSize = Math.min(200, Math.max(10, params.pageSize ?? 50));
	const q = (params.q ?? "").trim().toLowerCase();
	const [reqs, prospects] = await Promise.all([db.requirements.toArray(), db.prospects.toArray()]);
	const byId = new Map(prospects.map((p) => [p.id, p]));
	let rows = reqs.map((r) => {
		const p = byId.get(r.prospectId);
		return {
			...r,
			businessName: p?.businessName ?? "Deleted prospect",
			phone: p?.phone ?? "",
			contactName: p?.contactName ?? ""
		};
	});
	if (params.status && params.status !== "all") rows = rows.filter((r) => r.status === params.status);
	if (params.condition && params.condition !== "all") rows = rows.filter((r) => r.condition === params.condition);
	if (q) rows = rows.filter((r) => [
		r.partNumber,
		r.brand,
		r.model,
		r.priceQuoted,
		r.notes,
		r.businessName,
		r.phone,
		r.contactName
	].join(" ").toLowerCase().includes(q));
	rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	const total = rows.length;
	const start = (page - 1) * pageSize;
	return {
		rows: rows.slice(start, start + pageSize),
		total
	};
}
async function requirementSearchHits(q) {
	const needle = q.trim().toLowerCase();
	if (!needle) return void 0;
	const rows = await getDb().requirements.toArray();
	const hits = /* @__PURE__ */ new Set();
	for (const r of rows) if ([
		r.partNumber,
		r.brand,
		r.model,
		r.priceQuoted,
		r.notes,
		r.condition
	].join(" ").toLowerCase().includes(needle)) hits.add(r.prospectId);
	return hits;
}
async function prospectIdsWithRequirements() {
	const rows = await getDb().requirements.toArray();
	return new Set(rows.map((r) => r.prospectId));
}
async function exportBackup() {
	const db = getDb();
	return {
		version: 2,
		exportedAt: nowIso(),
		prospects: await db.prospects.toArray(),
		calls: await db.calls.toArray(),
		imports: await db.imports.toArray(),
		settings: await getSettings(),
		requirements: await db.requirements.toArray()
	};
}
async function restoreBackup(payload) {
	if (!payload || payload.version !== 1 && payload.version !== 2) throw new Error("Unsupported backup file.");
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
		if (payload.settings) await db.settings.put({
			...payload.settings,
			id: "default"
		});
	});
}
async function clearAll() {
	const db = getDb();
	await db.transaction("rw", db.prospects, db.calls, db.imports, db.requirements, async () => {
		await db.prospects.clear();
		await db.calls.clear();
		await db.imports.clear();
		await db.requirements.clear();
	});
}
async function importProspects(rows) {
	const db = getDb();
	const settings = await getSettings();
	const prospects = rows.map((r) => hydrateProspect(r, settings));
	await db.prospects.bulkAdd(prospects);
	return {
		imported: prospects.length,
		ids: prospects.map((p) => p.id)
	};
}
function coerceProspectInput(values, extra, settings, sourceFallback = "Excel") {
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
		extra
	};
}
function hoursAgo(h) {
	return subHours(/* @__PURE__ */ new Date(), h).toISOString();
}
function hoursFromNow(h) {
	return addHours(/* @__PURE__ */ new Date(), h).toISOString();
}
function sampleProspects() {
	return [
		{
			businessName: "ABC Equipment LLC",
			phone: "804-555-1234",
			alternatePhone: "804-555-1290",
			email: "abc@email.com",
			website: "abcequipment.com",
			address: "4100 Witchduck Rd",
			city: "Virginia Beach",
			state: "VA",
			zip: "23455",
			contactName: "John Hale",
			contactTitle: "Owner",
			leadType: "Dealer",
			status: "Callback",
			priority: "Hot",
			source: "Sample",
			remarks: "Interested in tractor parts. Asked to call after 3 PM.",
			nextAction: "Call John after 3 PM.",
			extra: {},
			lastCalledAt: hoursAgo(2),
			nextCallbackAt: addMinutes(/* @__PURE__ */ new Date(), 45).toISOString(),
			callAttempts: 4
		},
		{
			businessName: "Smith Tractor",
			phone: "757-555-2211",
			alternatePhone: "",
			email: "sales@smithtractor.com",
			website: "smithtractor.com",
			address: "900 Granby St",
			city: "Norfolk",
			state: "VA",
			zip: "23510",
			contactName: "Dave Smith",
			contactTitle: "Parts Manager",
			leadType: "Dealer",
			status: "Called",
			priority: "Warm",
			source: "Sample",
			remarks: "Left voicemail this morning.",
			nextAction: "Try again this afternoon.",
			extra: {},
			lastCalledAt: hoursAgo(4),
			nextCallbackAt: null,
			callAttempts: 2
		},
		{
			businessName: "KTR Equipment",
			phone: "804-555-7788",
			alternatePhone: "",
			email: "info@ktrequip.com",
			website: "ktrequip.com",
			address: "2211 Midlothian Tpke",
			city: "Richmond",
			state: "VA",
			zip: "23224",
			contactName: "Karen Reed",
			contactTitle: "Office Manager",
			leadType: "Dealer",
			status: "Callback",
			priority: "Hot",
			source: "Sample",
			remarks: "Spoke with receptionist. Call back requested.",
			nextAction: "Ask for Karen.",
			extra: {},
			lastCalledAt: hoursAgo(6),
			nextCallbackAt: hoursAgo(1),
			callAttempts: 3
		},
		{
			businessName: "Harbor Forklifts",
			phone: "757-555-8822",
			alternatePhone: "",
			email: "maria@harborfork.com",
			website: "",
			address: "",
			city: "Chesapeake",
			state: "VA",
			zip: "23320",
			contactName: "Maria Chen",
			contactTitle: "Buyer",
			leadType: "End User",
			status: "New",
			priority: "Hot",
			source: "Sample",
			remarks: "",
			nextAction: "First call.",
			extra: {},
			callAttempts: 0
		},
		{
			businessName: "Valley Ag Supply",
			phone: "540-555-3344",
			alternatePhone: "540-555-3300",
			email: "hello@valleyag.com",
			website: "valleyagsupply.com",
			address: "12 Frontier Dr",
			city: "Staunton",
			state: "VA",
			zip: "24401",
			contactName: "John Harper",
			contactTitle: "Owner",
			leadType: "Dealer",
			status: "To Call",
			priority: "Warm",
			source: "Sample",
			remarks: "Seasonal — busiest in spring.",
			nextAction: "Introduce parts catalog.",
			extra: {},
			callAttempts: 0
		},
		{
			businessName: "Tidewater Truck Parts",
			phone: "757-555-6677",
			alternatePhone: "",
			email: "parts@twtruck.com",
			website: "",
			address: "",
			city: "Newport News",
			state: "VA",
			zip: "23607",
			contactName: "",
			contactTitle: "",
			leadType: "Distributor",
			status: "Follow-up",
			priority: "Warm",
			source: "Sample",
			remarks: "Send pricing sheet.",
			nextAction: "Email quote then call.",
			extra: {},
			lastCalledAt: hoursAgo(26),
			nextCallbackAt: hoursFromNow(20),
			callAttempts: 1
		},
		{
			businessName: "Piedmont Implements",
			phone: "434-555-4400",
			alternatePhone: "",
			email: "hello@piedmontimp.com",
			website: "",
			address: "",
			city: "Lynchburg",
			state: "VA",
			zip: "24501",
			contactName: "Ray Collins",
			contactTitle: "GM",
			leadType: "Dealer",
			status: "Interested",
			priority: "Hot",
			source: "Sample",
			remarks: "Wants bulk hose pricing.",
			nextAction: "Send quote.",
			extra: {},
			lastCalledAt: hoursAgo(30),
			nextCallbackAt: hoursFromNow(4),
			callAttempts: 2
		},
		{
			businessName: "Bay Diesel Works",
			phone: "757-555-0199",
			alternatePhone: "",
			email: "parts@baydiesel.com",
			website: "baydiesel.com",
			address: "",
			city: "Hampton",
			state: "VA",
			zip: "23661",
			contactName: "Al Perez",
			contactTitle: "Service Manager",
			leadType: "Shop",
			status: "New",
			priority: "Cold",
			source: "Sample",
			remarks: "",
			nextAction: "",
			extra: {},
			callAttempts: 0
		},
		{
			businessName: "Blue Ridge Hydraulics",
			phone: "540-555-9012",
			alternatePhone: "",
			email: "info@brhydro.com",
			website: "",
			address: "",
			city: "Roanoke",
			state: "VA",
			zip: "24016",
			contactName: "Nina Walsh",
			contactTitle: "Purchasing",
			leadType: "Distributor",
			status: "Qualified",
			priority: "Hot",
			source: "Sample",
			remarks: "Ready for a trial order.",
			nextAction: "Confirm SKUs.",
			extra: {},
			lastCalledAt: hoursAgo(50),
			nextCallbackAt: hoursFromNow(28),
			callAttempts: 5
		},
		{
			businessName: "Capitol Fleet Service",
			phone: "703-555-6161",
			alternatePhone: "",
			email: "fleet@capfleet.com",
			website: "",
			address: "",
			city: "Alexandria",
			state: "VA",
			zip: "22314",
			contactName: "Tom Nguyen",
			contactTitle: "Fleet Supervisor",
			leadType: "End User",
			status: "Won",
			priority: "Warm",
			source: "Sample",
			remarks: "First PO received.",
			nextAction: "Onboard.",
			extra: {},
			lastCalledAt: hoursAgo(80),
			nextCallbackAt: null,
			callAttempts: 6
		},
		{
			businessName: "Shenandoah Outdoor Power",
			phone: "540-555-2727",
			alternatePhone: "",
			email: "",
			website: "",
			address: "",
			city: "Harrisonburg",
			state: "VA",
			zip: "22801",
			contactName: "",
			contactTitle: "",
			leadType: "Dealer",
			status: "Lost",
			priority: "Cold",
			source: "Sample",
			remarks: "Already has a supplier.",
			nextAction: "",
			extra: {},
			lastCalledAt: hoursAgo(200),
			nextCallbackAt: null,
			callAttempts: 3
		},
		{
			businessName: "Potomac Marine Supply",
			phone: "703-555-4488",
			alternatePhone: "",
			email: "dock@potomacmarine.com",
			website: "",
			address: "",
			city: "Woodbridge",
			state: "VA",
			zip: "22191",
			contactName: "Lisa Grant",
			contactTitle: "Owner",
			leadType: "Marine",
			status: "Do Not Call",
			priority: "Cold",
			source: "Sample",
			remarks: "Asked to be removed.",
			nextAction: "",
			extra: {},
			lastCalledAt: hoursAgo(12),
			nextCallbackAt: null,
			callAttempts: 1
		}
	];
}
async function loadSampleWorkspace() {
	const db = getDb();
	const settings = await getSettings();
	const rows = sampleProspects().map((r) => hydrateProspect(r, settings));
	await db.prospects.bulkAdd(rows);
	const byName = new Map(rows.map((p) => [p.businessName, p]));
	const now = Date.now();
	const calls = [
		{
			id: crypto.randomUUID(),
			prospectId: byName.get("ABC Equipment LLC")?.id ?? rows[0].id,
			calledAt: (/* @__PURE__ */ new Date(now - 72e5)).toISOString(),
			outcome: "Interested",
			contactName: "John Hale",
			notes: "Spoke with John. Asked for pricing on tractor parts.",
			callbackAt: byName.get("ABC Equipment LLC")?.nextCallbackAt ?? null,
			nextAction: "Call John after 3 PM.",
			createdAt: (/* @__PURE__ */ new Date(now - 72e5)).toISOString()
		},
		{
			id: crypto.randomUUID(),
			prospectId: byName.get("Smith Tractor")?.id ?? rows[1].id,
			calledAt: (/* @__PURE__ */ new Date(now - 144e5)).toISOString(),
			outcome: "No Answer",
			contactName: "Dave Smith",
			notes: "Try again later.",
			callbackAt: null,
			nextAction: "Try again this afternoon.",
			createdAt: (/* @__PURE__ */ new Date(now - 144e5)).toISOString()
		},
		{
			id: crypto.randomUUID(),
			prospectId: byName.get("KTR Equipment")?.id ?? rows[2].id,
			calledAt: (/* @__PURE__ */ new Date(now - 216e5)).toISOString(),
			outcome: "Callback Requested",
			contactName: "Reception",
			notes: "Receptionist asked to call back.",
			callbackAt: byName.get("KTR Equipment")?.nextCallbackAt ?? null,
			nextAction: "Ask for Karen.",
			createdAt: (/* @__PURE__ */ new Date(now - 216e5)).toISOString()
		}
	];
	await db.calls.bulkAdd(calls);
	const reqs = [
		{
			prospectId: byName.get("ABC Equipment LLC")?.id ?? rows[0].id,
			partNumber: "RE507541",
			condition: "OEM",
			brand: "John Deere",
			model: "5075E",
			priceQuoted: "48.50",
			quantity: "2",
			notes: "Hydraulic filter. Needs this week.",
			status: "Open"
		},
		{
			prospectId: byName.get("Smith Tractor")?.id ?? rows[1].id,
			partNumber: "T0110-37500",
			condition: "Used",
			brand: "Kubota",
			model: "L3901",
			priceQuoted: "220.00",
			quantity: "1",
			notes: "Clutch assembly. Confirm takeoff condition.",
			status: "Quoted"
		},
		{
			prospectId: byName.get("KTR Equipment")?.id ?? rows[2].id,
			partNumber: "3715863M1",
			condition: "Aftermarket",
			brand: "Massey Ferguson",
			model: "4710",
			priceQuoted: "89.00",
			quantity: "4",
			notes: "Fuel filters. Call after 3 PM.",
			status: "Open"
		},
		{
			prospectId: byName.get("Piedmont Implements")?.id ?? rows[5].id,
			partNumber: "R35181",
			condition: "Aftermarket",
			brand: "Case IH",
			model: "Maxxum 110",
			priceQuoted: "32.90",
			quantity: "6",
			notes: "Brake pads. Bulk hose pricing also requested.",
			status: "Open"
		},
		{
			prospectId: byName.get("Blue Ridge Hydraulics")?.id ?? rows[7].id,
			partNumber: "STB/0307-923",
			condition: "OEM",
			brand: "CAT",
			model: "D3K2",
			priceQuoted: "27.14",
			quantity: "10",
			notes: "Open ball bearing. Trial order.",
			status: "Quoted"
		}
	];
	await db.requirements.bulkAdd(reqs.map((r) => hydrateRequirement(r)));
	return rows.length;
}
var crmKeys = {
	all: ["crm"],
	dashboard: () => [...crmKeys.all, "dashboard"],
	prospects: (params) => [
		...crmKeys.all,
		"prospects",
		params
	],
	prospect: (id) => [
		...crmKeys.all,
		"prospect",
		id
	],
	calls: (params) => [
		...crmKeys.all,
		"calls",
		params
	],
	prospectCalls: (id) => [
		...crmKeys.all,
		"prospect-calls",
		id
	],
	callbacks: () => [...crmKeys.all, "callbacks"],
	queue: (skip) => [
		...crmKeys.all,
		"queue",
		skip
	],
	settings: () => [...crmKeys.all, "settings"],
	imports: () => [...crmKeys.all, "imports"],
	info: () => [...crmKeys.all, "info"],
	requirements: (params) => [
		...crmKeys.all,
		"requirements",
		params
	],
	prospectRequirements: (id) => [
		...crmKeys.all,
		"prospect-req",
		id
	]
};
var enabled = typeof indexedDB !== "undefined";
function useInvalidateCrm() {
	const qc = useQueryClient();
	return () => qc.invalidateQueries({ queryKey: crmKeys.all });
}
function useDashboard() {
	return useQuery({
		queryKey: crmKeys.dashboard(),
		queryFn: getDashboard,
		enabled
	});
}
function useProspects(params) {
	return useQuery({
		queryKey: crmKeys.prospects(params),
		queryFn: () => listProspects(params),
		enabled
	});
}
function useProspect(id) {
	return useQuery({
		queryKey: crmKeys.prospect(id ?? ""),
		queryFn: () => getProspect(id),
		enabled: enabled && !!id
	});
}
function useProspectCalls(id) {
	return useQuery({
		queryKey: crmKeys.prospectCalls(id ?? ""),
		queryFn: () => getCallsForProspect(id),
		enabled: enabled && !!id
	});
}
function useProspectRequirements(id) {
	return useQuery({
		queryKey: crmKeys.prospectRequirements(id ?? ""),
		queryFn: () => getRequirementsForProspect(id),
		enabled: enabled && !!id
	});
}
function useRequirements(params) {
	return useQuery({
		queryKey: crmKeys.requirements(params),
		queryFn: () => listRequirements(params),
		enabled
	});
}
function useCalls(params) {
	return useQuery({
		queryKey: crmKeys.calls(params),
		queryFn: () => listCalls(params),
		enabled
	});
}
function useCallbacks() {
	return useQuery({
		queryKey: crmKeys.callbacks(),
		queryFn: listCallbacks,
		enabled
	});
}
var useQueueSession = create((set) => ({
	skipIds: [],
	skip: (id) => set((s) => ({ skipIds: s.skipIds.includes(id) ? s.skipIds : [...s.skipIds, id] })),
	reset: () => set({ skipIds: [] })
}));
function useQueue() {
	const skipIds = useQueueSession((s) => s.skipIds);
	return useQuery({
		queryKey: crmKeys.queue(skipIds),
		queryFn: () => getQueue(skipIds),
		enabled
	});
}
function useSettings() {
	return useQuery({
		queryKey: crmKeys.settings(),
		queryFn: getSettings,
		enabled
	});
}
function useImports() {
	return useQuery({
		queryKey: crmKeys.imports(),
		queryFn: listImports,
		enabled
	});
}
function useDbInfo() {
	return useQuery({
		queryKey: crmKeys.info(),
		queryFn: getDbInfo,
		enabled
	});
}
function useCreateProspect() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: (input) => createProspect(input),
		onSuccess: invalidate
	});
}
function useUpdateProspect() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: ({ id, patch }) => updateProspect(id, patch),
		onSuccess: invalidate
	});
}
function useDeleteProspects() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: (ids) => deleteProspects(ids),
		onSuccess: invalidate
	});
}
function useBulkUpdate() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: ({ ids, patch }) => bulkUpdate(ids, patch),
		onSuccess: invalidate
	});
}
function useLogCall() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: (input) => logCall(input),
		onSuccess: invalidate
	});
}
function useCreateRequirement() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: (input) => createRequirement(input),
		onSuccess: invalidate
	});
}
function useUpdateRequirement() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: ({ id, patch }) => updateRequirement(id, patch),
		onSuccess: invalidate
	});
}
function useDeleteRequirement() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: (id) => deleteRequirement(id),
		onSuccess: invalidate
	});
}
function useSaveSettings() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: (patch) => saveSettings(patch),
		onSuccess: invalidate
	});
}
function useLoadSample() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: loadSampleWorkspace,
		onSuccess: invalidate
	});
}
function useClearAll() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: clearAll,
		onSuccess: invalidate
	});
}
async function commitImport(params) {
	const settings = await getSettings();
	const existing = await getAllProspects();
	let imported = 0;
	let duplicates = 0;
	let skipped = 0;
	const toAdd = [];
	const reqs = [];
	async function attachRequirement(prospectId, row) {
		const draft = requirementFromRow(row.values, row.extra);
		if (draft) reqs.push({
			...draft,
			prospectId
		});
	}
	for (let i = 0; i < params.rows.length; i++) {
		const row = params.rows[i];
		if (params.invalidIndexes.has(i)) {
			skipped += 1;
			continue;
		}
		const input = coerceProspectInput(row.values, row.extra, settings, params.filename);
		if (params.duplicateIndexes.has(i)) {
			const action = params.actions[i] ?? "skip";
			duplicates += 1;
			if (action === "skip") {
				skipped += 1;
				continue;
			}
			if (action === "keep") {
				await attachRequirement((await createProspect(input)).id, row);
				imported += 1;
				continue;
			}
			const phone = normalizePhone(input.phone);
			const name = normalizeName(input.businessName);
			const target = existing.find((p) => phone && p.phoneNormalized === phone) ?? existing.find((p) => name && p.nameNormalized === name);
			if (target) {
				const merged = mergeProspects(target, input);
				await updateProspect(target.id, merged);
				await attachRequirement(target.id, row);
				imported += 1;
			} else {
				await attachRequirement((await createProspect(input)).id, row);
				imported += 1;
			}
			continue;
		}
		toAdd.push(input);
		imported += 1;
	}
	if (toAdd.length) {
		const added = await importProspects(toAdd);
		params.rows.length - toAdd.length;
		let addIdx = 0;
		for (let i = 0; i < params.rows.length; i++) {
			if (params.invalidIndexes.has(i) || params.duplicateIndexes.has(i)) continue;
			const id = added.ids[addIdx++];
			if (id) await attachRequirement(id, params.rows[i]);
		}
	}
	if (reqs.length) for (const r of reqs) await createRequirement(r);
	await recordImport({
		filename: params.filename,
		sheets: params.sheetCount,
		rows: params.rows.length,
		imported,
		duplicates,
		skipped,
		mapping: params.mapping
	});
	return {
		imported,
		duplicates,
		skipped
	};
}
function useCommitImport() {
	const invalidate = useInvalidateCrm();
	return useMutation({
		mutationFn: commitImport,
		onSuccess: invalidate
	});
}
//#endregion
export { useCommitImport as A, useLogCall as B, rescheduleCallback as C, useCallbacks as D, useBulkUpdate as E, useDeleteProspects as F, useQueue as G, useProspectCalls as H, useDeleteRequirement as I, useSaveSettings as J, useQueueSession as K, useImports as L, useCreateRequirement as M, useDashboard as N, useCalls as O, useDbInfo as P, useInvalidateCrm as R, normalizePhone as S, telHref as T, useProspectRequirements as U, useProspect as V, useProspects as W, useUpdateProspect as X, useSettings as Y, useUpdateRequirement as Z, listCalls as _, displayPhone as a, normalizeHeader as b, exportBackup as c, formatTime as d, formatTimeShort as f, isBlankRow as g, getDashboard as h, defaultCallbackIso as i, useCreateProspect as j, useClearAll as k, formatDateTime as l, getAllProspects as m, completeCallback as n, emptyProspect as o, fromDatetimeLocal as p, useRequirements as q, datetimeLocalValue as r, emptyRequirement as s, cleanCell as t, formatRelativeDay as u, listRequirements as v, restoreBackup as w, normalizeName as x, mapHeader as y, useLoadSample as z };
