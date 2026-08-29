import { S as normalizePhone, b as normalizeHeader, g as isBlankRow, l as formatDateTime, t as cleanCell, x as normalizeName, y as mapHeader } from "./hooks-CZT9t7MV.mjs";
import { i as CRM_FIELD_LABELS, r as CRM_FIELDS } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/excel-BcGc6GkZ.js
function findDuplicates(rows, existing) {
	const byPhone = /* @__PURE__ */ new Map();
	const byName = /* @__PURE__ */ new Map();
	for (const p of existing) {
		if (p.phoneNormalized) byPhone.set(p.phoneNormalized, p);
		if (p.nameNormalized) {
			const list = byName.get(p.nameNormalized) ?? [];
			list.push(p);
			byName.set(p.nameNormalized, list);
		}
	}
	const seenPhone = /* @__PURE__ */ new Map();
	const seenNameCity = /* @__PURE__ */ new Map();
	const matches = [];
	rows.forEach((row, index) => {
		const phone = normalizePhone(row.values.phone ?? "");
		const name = normalizeName(row.values.businessName ?? "");
		const city = (row.values.city ?? "").trim().toLowerCase();
		const reasons = [];
		let existingHit = null;
		let incomingDuplicateOf = null;
		if (phone && byPhone.has(phone)) {
			existingHit = byPhone.get(phone) ?? null;
			reasons.push("phone");
		}
		if (name) {
			const candidates = byName.get(name) ?? [];
			const cityMatch = candidates.find((c) => city && c.city.trim().toLowerCase() === city);
			const any = cityMatch ?? candidates[0];
			if (any) {
				existingHit = existingHit ?? any;
				reasons.push("business name");
				if (cityMatch) reasons.push("business name + city");
				if (phone && any.phoneNormalized === phone) reasons.push("business name + phone");
			}
		}
		if (phone && seenPhone.has(phone)) {
			incomingDuplicateOf = seenPhone.get(phone) ?? null;
			reasons.push("phone (in file)");
		}
		const nameCityKey = name ? `${name}::${city}` : "";
		if (nameCityKey && seenNameCity.has(nameCityKey)) {
			incomingDuplicateOf = incomingDuplicateOf ?? seenNameCity.get(nameCityKey) ?? null;
			reasons.push("business name (in file)");
		}
		if (phone) seenPhone.set(phone, seenPhone.get(phone) ?? index);
		if (nameCityKey) seenNameCity.set(nameCityKey, seenNameCity.get(nameCityKey) ?? index);
		if (reasons.length > 0) matches.push({
			incomingIndex: index,
			existingId: existingHit?.id ?? null,
			incomingDuplicateOf,
			reasons: Array.from(new Set(reasons)),
			existing: existingHit
		});
	});
	return matches;
}
function isIncomplete(row) {
	const name = (row.values.businessName ?? "").trim();
	const phone = normalizePhone(row.values.phone ?? "");
	if (!name && !phone) return "Missing business name and phone";
	return null;
}
function loadXlsx() {
	return import("../_libs/xlsx.mjs").then((n) => n.t);
}
async function parseWorkbook(data, filename) {
	const XLSX = await loadXlsx();
	let workbook;
	try {
		workbook = XLSX.read(data, {
			type: "array",
			cellDates: true,
			raw: false
		});
	} catch {
		throw new Error("This file could not be read. Upload a valid .xlsx workbook.");
	}
	if (!workbook.SheetNames.length) throw new Error("This workbook has no worksheets.");
	const rawRows = [];
	const headersBySheet = {};
	for (const name of workbook.SheetNames) {
		const sheet = workbook.Sheets[name];
		if (!sheet) continue;
		const json = XLSX.utils.sheet_to_json(sheet, {
			defval: "",
			raw: false,
			dateNF: "yyyy-mm-dd hh:mm"
		});
		if (!json.length) {
			headersBySheet[name] = [];
			continue;
		}
		const headers = Object.keys(json[0] ?? {});
		headersBySheet[name] = headers;
		json.forEach((row, i) => {
			if (isBlankRow(row)) return;
			const raw = {};
			for (const h of headers) raw[h] = cleanCell(row[h]);
			rawRows.push({
				sheet: name,
				rowNumber: i + 2,
				raw
			});
		});
	}
	if (!rawRows.length) throw new Error("No data rows were found in this workbook.");
	return {
		sheets: workbook.SheetNames,
		headersBySheet,
		rawRows
	};
}
function buildDefaultMapping(headers) {
	const used = /* @__PURE__ */ new Set();
	return headers.map((excelColumn) => {
		let field = mapHeader(excelColumn);
		if (field !== "ignore" && field !== "contactFirst" && field !== "contactLast") {
			if (used.has(field)) field = "ignore";
			else used.add(field);
		}
		return {
			excelColumn,
			field
		};
	});
}
function applyMapping(rawRows, mapping) {
	const mapByCol = new Map(mapping.map((m) => [m.excelColumn, m.field]));
	return rawRows.map((row) => {
		const values = {};
		const extra = {};
		let first = "";
		let last = "";
		for (const [col, val] of Object.entries(row.raw)) {
			const field = mapByCol.get(col) ?? "ignore";
			if (!val) continue;
			if (field === "ignore") extra[col] = val;
			else if (field === "contactFirst") first = val;
			else if (field === "contactLast") last = val;
			else if (field === "phone" || field === "alternatePhone") values[field] = val;
			else values[field] = values[field] ? `${values[field]} ${val}` : val;
		}
		if ((first || last) && !values.contactName) values.contactName = `${first} ${last}`.trim();
		return {
			sheet: row.sheet,
			rowNumber: row.rowNumber,
			values,
			extra,
			raw: row.raw
		};
	});
}
function previewImport(filename, sheets, rows, mapping, existing) {
	const duplicates = findDuplicates(rows, existing);
	const dupSet = new Set(duplicates.map((d) => d.incomingIndex));
	const invalid = [];
	rows.forEach((row, i) => {
		const reason = isIncomplete(row);
		if (reason) invalid.push({
			index: i,
			reason
		});
	});
	const invalidSet = new Set(invalid.map((i) => i.index));
	const newCount = rows.filter((_, i) => !dupSet.has(i) && !invalidSet.has(i)).length;
	return {
		filename,
		sheets,
		sheetCount: sheets.length,
		rowsFound: rows.length,
		rows,
		mapping,
		newCount,
		duplicateCount: duplicates.length,
		invalidCount: invalid.length,
		duplicates,
		invalid
	};
}
function uniqueHeaders(headersBySheet) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const headers of Object.values(headersBySheet)) for (const h of headers) {
		const key = normalizeHeader(h);
		if (!key || seen.has(key)) continue;
		seen.add(key);
		out.push(h);
	}
	return out;
}
function downloadBuffer(buffer, filename) {
	const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function autoCols(headers, rows) {
	return headers.map((h, i) => {
		let max = h.length;
		for (const row of rows) {
			const cell = row[i];
			const len = String(cell ?? "").length;
			if (len > max) max = len;
		}
		return { wch: Math.min(42, Math.max(12, max + 2)) };
	});
}
async function exportWorkbook(params) {
	const XLSX = await loadXlsx();
	const wb = XLSX.utils.book_new();
	const prospectHeaders = [
		"Business Name",
		"Phone",
		"Alternate Phone",
		"Email",
		"Website",
		"Contact Name",
		"Contact Title",
		"Address",
		"City",
		"State",
		"ZIP",
		"Lead Type",
		"Status",
		"Priority",
		"Source",
		"Last Called",
		"Next Callback",
		"Call Attempts",
		"Remarks",
		"Next Action",
		"Created At",
		"Updated At"
	];
	const prospectRows = params.prospects.map((p) => [
		p.businessName,
		p.phone,
		p.alternatePhone,
		p.email,
		p.website,
		p.contactName,
		p.contactTitle,
		p.address,
		p.city,
		p.state,
		p.zip,
		p.leadType,
		p.status,
		p.priority,
		p.source,
		formatDateTime(p.lastCalledAt),
		formatDateTime(p.nextCallbackAt),
		p.callAttempts,
		p.remarks,
		p.nextAction,
		formatDateTime(p.createdAt),
		formatDateTime(p.updatedAt)
	]);
	const ws1 = XLSX.utils.aoa_to_sheet([prospectHeaders, ...prospectRows]);
	ws1["!cols"] = autoCols(prospectHeaders, prospectRows);
	ws1["!autofilter"] = { ref: `A1:${XLSX.utils.encode_col(prospectHeaders.length - 1)}${prospectRows.length + 1}` };
	ws1["!views"] = [{
		state: "frozen",
		ySplit: 1,
		topLeftCell: "A2",
		activeCell: "A2"
	}];
	XLSX.utils.book_append_sheet(wb, ws1, "Prospects");
	const callHeaders = [
		"Date",
		"Business",
		"Phone",
		"Contact",
		"Outcome",
		"Notes",
		"Callback",
		"Next Action"
	];
	const callRows = params.calls.map((c) => [
		formatDateTime(c.calledAt),
		c.businessName,
		c.phone,
		c.contactName,
		c.outcome,
		c.notes,
		formatDateTime(c.callbackAt),
		c.nextAction
	]);
	const ws2 = XLSX.utils.aoa_to_sheet([callHeaders, ...callRows]);
	ws2["!cols"] = autoCols(callHeaders, callRows);
	ws2["!autofilter"] = { ref: `A1:${XLSX.utils.encode_col(callHeaders.length - 1)}${Math.max(1, callRows.length) + 1}` };
	ws2["!views"] = [{
		state: "frozen",
		ySplit: 1,
		topLeftCell: "A2",
		activeCell: "A2"
	}];
	XLSX.utils.book_append_sheet(wb, ws2, "Call History");
	const reqHeaders = [
		"Business",
		"Phone",
		"Part Number",
		"Condition",
		"Brand",
		"Model",
		"Price Quoted",
		"Quantity",
		"Status",
		"Notes",
		"Created"
	];
	const reqRows = (params.requirements ?? []).map((r) => [
		r.businessName,
		r.phone,
		r.partNumber,
		r.condition,
		r.brand,
		r.model,
		r.priceQuoted,
		r.quantity,
		r.status,
		r.notes,
		formatDateTime(r.createdAt)
	]);
	const wsR = XLSX.utils.aoa_to_sheet([reqHeaders, ...reqRows]);
	wsR["!cols"] = autoCols(reqHeaders, reqRows);
	wsR["!autofilter"] = { ref: `A1:${XLSX.utils.encode_col(reqHeaders.length - 1)}${Math.max(1, reqRows.length) + 1}` };
	wsR["!views"] = [{
		state: "frozen",
		ySplit: 1,
		topLeftCell: "A2",
		activeCell: "A2"
	}];
	XLSX.utils.book_append_sheet(wb, wsR, "Requirements");
	const summaryRows = Object.entries(params.stats);
	const ws3 = XLSX.utils.aoa_to_sheet([["Metric", "Value"], ...summaryRows]);
	ws3["!cols"] = [{ wch: 24 }, { wch: 16 }];
	ws3["!views"] = [{
		state: "frozen",
		ySplit: 1
	}];
	XLSX.utils.book_append_sheet(wb, ws3, "Summary");
	const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	downloadBuffer(XLSX.write(wb, {
		bookType: "xlsx",
		type: "array"
	}), `CallDesk-Statista-export-${stamp}.xlsx`);
}
async function buildSampleWorkbook() {
	const XLSX = await loadXlsx();
	const wb = XLSX.utils.book_new();
	const ws1 = XLSX.utils.aoa_to_sheet([
		[
			"Company",
			"Phone Number",
			"Contact",
			"City",
			"State",
			"Part Number",
			"Condition",
			"Brand",
			"Model",
			"Price Quoted",
			"Remarks",
			"Priority"
		],
		[
			"ABC Equipment LLC",
			"804-555-1234",
			"John Hale",
			"Virginia Beach",
			"VA",
			"RE507541",
			"OEM",
			"John Deere",
			"5075E",
			"48.50",
			"Needs hydraulic filter this week.",
			"Hot"
		],
		[
			"Smith Tractor",
			"757-555-2211",
			"Dave Smith",
			"Norfolk",
			"VA",
			"T0110-37500",
			"Used",
			"Kubota",
			"L3901",
			"220.00",
			"Ask for Dave. Clutch.",
			"Warm"
		],
		[
			"KTR Equipment",
			"804-555-7788",
			"Karen Reed",
			"Richmond",
			"VA",
			"3715863M1",
			"Aftermarket",
			"Massey Ferguson",
			"4710",
			"89.00",
			"Call after 3 PM.",
			"Hot"
		],
		[
			"Bay Diesel Works",
			"757-555-0199",
			"Al Perez",
			"Hampton",
			"VA",
			"84009757",
			"OEM",
			"Briggs & Stratton",
			"",
			"64.00",
			"",
			"Cold"
		],
		[
			"ABC Equipment LLC",
			"804-555-1234",
			"John Hale",
			"Virginia Beach",
			"VA",
			"RE507541",
			"OEM",
			"John Deere",
			"5075E",
			"48.50",
			"Duplicate row in file.",
			"Hot"
		],
		[
			"",
			"",
			"",
			"Roanoke",
			"VA",
			"",
			"",
			"",
			"",
			"",
			"Missing identity",
			"Warm"
		],
		[
			"Piedmont Implements",
			"434-555-4400",
			"Ray Collins",
			"Lynchburg",
			"VA",
			"R35181",
			"Aftermarket",
			"Case IH",
			"Maxxum 110",
			"32.90",
			"Brake pad quote.",
			"Warm"
		]
	]);
	ws1["!cols"] = [
		{ wch: 24 },
		{ wch: 16 },
		{ wch: 26 },
		{ wch: 16 },
		{ wch: 8 },
		{ wch: 32 },
		{ wch: 10 }
	];
	XLSX.utils.book_append_sheet(wb, ws1, "Dealers");
	XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
		[
			"Business Name",
			"Telephone",
			"Contact",
			"Town",
			"Status"
		],
		[
			"Harbor Forklifts",
			"757-555-8822",
			"Maria Chen",
			"Chesapeake",
			"New"
		],
		[
			"Valley Ag Supply",
			"540-555-3344",
			"John Harper",
			"Staunton",
			"To Call"
		],
		[
			"Tidewater Truck Parts",
			"757-555-6677",
			"Reception",
			"Newport News",
			"Follow-up"
		]
	]), "Leads");
	XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["Unused"]]), "Notes");
	downloadBuffer(XLSX.write(wb, {
		bookType: "xlsx",
		type: "array"
	}), "CallDesk-Statista-sample.xlsx");
}
function mappingDict(mapping) {
	const out = {};
	for (const m of mapping) {
		if (m.field === "ignore") continue;
		if (m.field === "contactFirst" || m.field === "contactLast") out[m.excelColumn] = "Contact Name";
		else out[m.excelColumn] = CRM_FIELD_LABELS[m.field];
	}
	return out;
}
var FIELD_OPTIONS = [
	{
		value: "ignore",
		label: "Ignore"
	},
	...CRM_FIELDS.map((f) => ({
		value: f,
		label: CRM_FIELD_LABELS[f]
	})),
	{
		value: "contactFirst",
		label: "Contact First Name"
	},
	{
		value: "contactLast",
		label: "Contact Last Name"
	}
];
//#endregion
export { exportWorkbook as a, previewImport as c, buildSampleWorkbook as i, uniqueHeaders as l, applyMapping as n, mappingDict as o, buildDefaultMapping as r, parseWorkbook as s, FIELD_OPTIONS as t };
