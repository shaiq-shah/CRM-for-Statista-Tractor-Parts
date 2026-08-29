import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as useCommitImport, L as useImports, l as formatDateTime, m as getAllProspects } from "./hooks-CZT9t7MV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as previewImport, i as buildSampleWorkbook, l as uniqueHeaders, n as applyMapping, o as mappingDict, r as buildDefaultMapping, s as parseWorkbook, t as FIELD_OPTIONS } from "./excel-BcGc6GkZ.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Label } from "./select-CC1Gkl1M.mjs";
import { g as formatNumber, n as Button } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-IcPyu-2g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImportPage() {
	const { data: history = [] } = useImports();
	const commit = useCommitImport();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [mapping, setMapping] = (0, import_react.useState)([]);
	const [raw, setRaw] = (0, import_react.useState)(null);
	const [actions, setActions] = (0, import_react.useState)({});
	const [dupDefault, setDupDefault] = (0, import_react.useState)("skip");
	async function onFile(file) {
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
	async function remap(nextMap) {
		if (!raw || !preview) return;
		const existing = await getAllProspects();
		const rows = applyMapping(raw.rawRows, nextMap);
		setMapping(nextMap);
		setPreview(previewImport(preview.filename, raw.sheets, rows, nextMap, existing));
	}
	const dupIndexes = (0, import_react.useMemo)(() => new Set(preview?.duplicates.map((d) => d.incomingIndex) ?? []), [preview]);
	const invalidIndexes = (0, import_react.useMemo)(() => new Set(preview?.invalid.map((d) => d.index) ?? []), [preview]);
	async function confirm() {
		if (!preview) return;
		const resolved = {};
		for (const d of preview.duplicates) resolved[d.incomingIndex] = actions[d.incomingIndex] ?? dupDefault;
		try {
			const result = await commit.mutateAsync({
				rows: preview.rows,
				actions: resolved,
				duplicateIndexes: dupIndexes,
				invalidIndexes,
				filename: preview.filename,
				sheetCount: preview.sheetCount,
				mapping: mappingDict(mapping)
			});
			toast.success(`Imported ${result.imported}. ${result.duplicates} duplicates, ${result.skipped} skipped.`);
			setPreview(null);
			setRaw(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Import failed.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.16em] text-primary uppercase",
						children: "Data"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight",
						children: "Import Excel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted-foreground",
						children: "Map company, phone, and part columns. Part number, OEM / used / aftermarket, brand, model, and price quoted become requirements on each prospect."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => buildSampleWorkbook(),
					children: "Download sample workbook"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Workbook (.xlsx)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						className: "mt-2 block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-foreground",
						onChange: (e) => onFile(e.target.files?.[0] ?? null),
						disabled: busy
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Original files are never overwritten. Every sheet is inspected, headers are mapped, and you confirm before anything is saved."
					})
				]
			}),
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 md:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "File",
								value: preview.filename
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Sheets",
								value: formatNumber(preview.sheetCount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Rows found",
								value: formatNumber(preview.rowsFound)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "New prospects",
								value: formatNumber(preview.newCount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Possible duplicates",
								value: formatNumber(preview.duplicateCount)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Invalid / incomplete: ", formatNumber(preview.invalidCount)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
							className: "border-b border-border px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Column mapping"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border",
							children: mapping.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 items-center gap-3 px-4 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-sm",
									children: m.excelColumn
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: m.field,
									onValueChange: (v) => {
										remap(mapping.map((row, idx) => idx === i ? {
											...row,
											field: v
										} : row));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FIELD_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: o.value,
										children: o.label
									}, o.value)) })]
								})]
							}, m.excelColumn))
						})]
					}),
					preview.duplicateCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Duplicates"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2",
								children: [
									"skip",
									"keep",
									"merge"
								].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: dupDefault === a ? "default" : "outline",
									onClick: () => {
										setDupDefault(a);
										setActions((cur) => {
											const next = { ...cur };
											for (const d of preview.duplicates) next[d.incomingIndex] = a;
											return next;
										});
									},
									children: a === "skip" ? "Skip all" : a === "keep" ? "Keep separate" : "Merge all"
								}, a))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "max-h-72 space-y-2 overflow-auto text-sm",
							children: preview.duplicates.slice(0, 40).map((d) => {
								const row = preview.rows[d.incomingIndex];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center justify-between gap-2 rounded-md bg-secondary px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-medium",
											children: row.values.businessName || row.values.phone || "Row " + row.rowNumber
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [d.reasons.join(" · "), d.existing ? ` · existing ${d.existing.businessName}` : ""]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: actions[d.incomingIndex] ?? dupDefault,
										onValueChange: (v) => setActions((cur) => ({
											...cur,
											[d.incomingIndex]: v
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-8 w-36",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "skip",
												children: "Skip"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "keep",
												children: "Keep separate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "merge",
												children: "Merge"
											})
										] })]
									})]
								}, d.incomingIndex);
							})
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setPreview(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: confirm,
							disabled: commit.isPending,
							children: "Confirm import"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "border-b border-border px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Import history"
					})
				}), history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-8 text-sm text-muted-foreground",
					children: "No imports yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 font-medium",
									children: "File"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Sheets"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Rows"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Imported"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Duplicates"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Skipped"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: h.filename
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs",
									children: formatDateTime(h.createdAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 tabular-nums",
									children: h.sheets
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 tabular-nums",
									children: h.rows
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 tabular-nums",
									children: h.imported
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 tabular-nums",
									children: h.duplicates
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 tabular-nums",
									children: h.skipped
								})
							]
						}, h.id)) })]
					})
				})]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 truncate font-mono text-sm",
			children: value
		})]
	});
}
//#endregion
export { ImportPage as component };
