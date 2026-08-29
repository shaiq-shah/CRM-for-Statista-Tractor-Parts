import type { ColumnMapping, CrmField, ImportPreview, ParsedRow, Prospect } from "./types";
import { CRM_FIELDS, CRM_FIELD_LABELS } from "./types";
import { findDuplicates, isIncomplete } from "./duplicates";
import { cleanCell, mapHeader, normalizeHeader, isBlankRow } from "./normalize";
import { formatDateTime } from "./dates";

function loadXlsx() {
  return import("xlsx");
}

export async function parseWorkbook(
  data: ArrayBuffer,
  filename: string,
): Promise<{
  sheets: string[];
  headersBySheet: Record<string, string[]>;
  rawRows: Array<{ sheet: string; rowNumber: number; raw: Record<string, string> }>;
}> {
  const XLSX = await loadXlsx();
  let workbook: import("xlsx").WorkBook;
  try {
    workbook = XLSX.read(data, { type: "array", cellDates: true, raw: false });
  } catch {
    throw new Error("This file could not be read. Upload a valid .xlsx workbook.");
  }
  if (!workbook.SheetNames.length) {
    throw new Error("This workbook has no worksheets.");
  }

  const rawRows: Array<{ sheet: string; rowNumber: number; raw: Record<string, string> }> = [];
  const headersBySheet: Record<string, string[]> = {};

  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    if (!sheet) continue;
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: false,
      dateNF: "yyyy-mm-dd hh:mm",
    });
    if (!json.length) {
      headersBySheet[name] = [];
      continue;
    }
    const headers = Object.keys(json[0] ?? {});
    headersBySheet[name] = headers;
    json.forEach((row, i) => {
      if (isBlankRow(row)) return;
      const raw: Record<string, string> = {};
      for (const h of headers) {
        raw[h] = cleanCell(row[h]);
      }
      rawRows.push({ sheet: name, rowNumber: i + 2, raw });
    });
  }

  if (!rawRows.length) {
    throw new Error("No data rows were found in this workbook.");
  }

  return { sheets: workbook.SheetNames, headersBySheet, rawRows };
}

export function buildDefaultMapping(headers: string[]): ColumnMapping[] {
  const used = new Set<string>();
  return headers.map((excelColumn) => {
    let field = mapHeader(excelColumn);
    if (field !== "ignore" && field !== "contactFirst" && field !== "contactLast") {
      if (used.has(field)) field = "ignore";
      else used.add(field);
    }
    return { excelColumn, field };
  });
}

export function applyMapping(
  rawRows: Array<{ sheet: string; rowNumber: number; raw: Record<string, string> }>,
  mapping: ColumnMapping[],
): ParsedRow[] {
  const mapByCol = new Map(mapping.map((m) => [m.excelColumn, m.field]));
  return rawRows.map((row) => {
    const values: ParsedRow["values"] = {};
    const extra: Record<string, string> = {};
    let first = "";
    let last = "";
    for (const [col, val] of Object.entries(row.raw)) {
      const field = mapByCol.get(col) ?? "ignore";
      if (!val) continue;
      if (field === "ignore") {
        extra[col] = val;
      } else if (field === "contactFirst") {
        first = val;
      } else if (field === "contactLast") {
        last = val;
      } else if (field === "phone" || field === "alternatePhone") {
        values[field] = val;
      } else {
        values[field] = values[field] ? `${values[field]} ${val}` : val;
      }
    }
    if ((first || last) && !values.contactName) {
      values.contactName = `${first} ${last}`.trim();
    }
    return {
      sheet: row.sheet,
      rowNumber: row.rowNumber,
      values,
      extra,
      raw: row.raw,
    };
  });
}

export function previewImport(
  filename: string,
  sheets: string[],
  rows: ParsedRow[],
  mapping: ColumnMapping[],
  existing: Prospect[],
): ImportPreview {
  const duplicates = findDuplicates(rows, existing);
  const dupSet = new Set(duplicates.map((d) => d.incomingIndex));
  const invalid: Array<{ index: number; reason: string }> = [];
  rows.forEach((row, i) => {
    const reason = isIncomplete(row);
    if (reason) invalid.push({ index: i, reason });
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
    invalid,
  };
}

export function uniqueHeaders(
  headersBySheet: Record<string, string[]>,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const headers of Object.values(headersBySheet)) {
    for (const h of headers) {
      const key = normalizeHeader(h);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(h);
    }
  }
  return out;
}

function downloadBuffer(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function autoCols(headers: string[], rows: Array<Array<string | number>>): Array<{ wch: number }> {
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

export async function exportWorkbook(params: {
  prospects: Prospect[];
  calls: Array<{
    calledAt: string;
    businessName: string;
    phone: string;
    contactName: string;
    outcome: string;
    notes: string;
    callbackAt: string | null;
    nextAction: string;
  }>;
  requirements?: Array<{
    businessName: string;
    phone: string;
    partNumber: string;
    condition: string;
    brand: string;
    model: string;
    priceQuoted: string;
    quantity: string;
    status: string;
    notes: string;
    createdAt: string;
  }>;
  stats: Record<string, number>;
}): Promise<void> {
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
    "Updated At",
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
    formatDateTime(p.updatedAt),
  ]);
  const ws1 = XLSX.utils.aoa_to_sheet([prospectHeaders, ...prospectRows]);
  ws1["!cols"] = autoCols(prospectHeaders, prospectRows);
  ws1["!autofilter"] = {
    ref: `A1:${XLSX.utils.encode_col(prospectHeaders.length - 1)}${prospectRows.length + 1}`,
  };
  ws1["!views"] = [{ state: "frozen", ySplit: 1, topLeftCell: "A2", activeCell: "A2" }];
  XLSX.utils.book_append_sheet(wb, ws1, "Prospects");

  const callHeaders = ["Date", "Business", "Phone", "Contact", "Outcome", "Notes", "Callback", "Next Action"];
  const callRows = params.calls.map((c) => [
    formatDateTime(c.calledAt),
    c.businessName,
    c.phone,
    c.contactName,
    c.outcome,
    c.notes,
    formatDateTime(c.callbackAt),
    c.nextAction,
  ]);
  const ws2 = XLSX.utils.aoa_to_sheet([callHeaders, ...callRows]);
  ws2["!cols"] = autoCols(callHeaders, callRows);
  ws2["!autofilter"] = {
    ref: `A1:${XLSX.utils.encode_col(callHeaders.length - 1)}${Math.max(1, callRows.length) + 1}`,
  };
  ws2["!views"] = [{ state: "frozen", ySplit: 1, topLeftCell: "A2", activeCell: "A2" }];
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
    "Created",
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
    formatDateTime(r.createdAt),
  ]);
  const wsR = XLSX.utils.aoa_to_sheet([reqHeaders, ...reqRows]);
  wsR["!cols"] = autoCols(reqHeaders, reqRows);
  wsR["!autofilter"] = {
    ref: `A1:${XLSX.utils.encode_col(reqHeaders.length - 1)}${Math.max(1, reqRows.length) + 1}`,
  };
  wsR["!views"] = [{ state: "frozen", ySplit: 1, topLeftCell: "A2", activeCell: "A2" }];
  XLSX.utils.book_append_sheet(wb, wsR, "Requirements");

  const summaryRows: Array<[string, number | string]> = Object.entries(params.stats);
  const ws3 = XLSX.utils.aoa_to_sheet([["Metric", "Value"], ...summaryRows]);
  ws3["!cols"] = [{ wch: 24 }, { wch: 16 }];
  ws3["!views"] = [{ state: "frozen", ySplit: 1 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Summary");

  const stamp = new Date().toISOString().slice(0, 10);
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBuffer(out, `CallDesk-Statista-export-${stamp}.xlsx`);
}

export async function buildSampleWorkbook(): Promise<void> {
  const XLSX = await loadXlsx();
  const wb = XLSX.utils.book_new();

  const dealers = [
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
      "Priority",
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
      "Hot",
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
      "Warm",
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
      "Hot",
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
      "Cold",
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
      "Hot",
    ],
    ["", "", "", "Roanoke", "VA", "", "", "", "", "", "Missing identity", "Warm"],
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
      "Warm",
    ],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(dealers);
  ws1["!cols"] = [{ wch: 24 }, { wch: 16 }, { wch: 26 }, { wch: 16 }, { wch: 8 }, { wch: 32 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Dealers");

  const leads = [
    ["Business Name", "Telephone", "Contact", "Town", "Status"],
    ["Harbor Forklifts", "757-555-8822", "Maria Chen", "Chesapeake", "New"],
    ["Valley Ag Supply", "540-555-3344", "John Harper", "Staunton", "To Call"],
    ["Tidewater Truck Parts", "757-555-6677", "Reception", "Newport News", "Follow-up"],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(leads), "Leads");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["Unused"]]), "Notes");

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBuffer(out, "CallDesk-Statista-sample.xlsx");
}

export function mappingDict(mapping: ColumnMapping[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of mapping) {
    if (m.field === "ignore") continue;
    if (m.field === "contactFirst" || m.field === "contactLast") {
      out[m.excelColumn] = "Contact Name";
    } else {
      out[m.excelColumn] = CRM_FIELD_LABELS[m.field as CrmField];
    }
  }
  return out;
}

export const FIELD_OPTIONS: Array<{ value: ColumnMapping["field"]; label: string }> = [
  { value: "ignore", label: "Ignore" },
  ...CRM_FIELDS.map((f) => ({ value: f, label: CRM_FIELD_LABELS[f] })),
  { value: "contactFirst", label: "Contact First Name" },
  { value: "contactLast", label: "Contact Last Name" },
];
