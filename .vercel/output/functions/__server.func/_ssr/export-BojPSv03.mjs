import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { P as useDbInfo, _ as listCalls, h as getDashboard, m as getAllProspects, v as listRequirements } from "./hooks-CZT9t7MV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as exportWorkbook } from "./excel-BcGc6GkZ.mjs";
import { n as Button } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-BojPSv03.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExportPage() {
	const { data } = useDbInfo();
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function run() {
		setBusy(true);
		try {
			const [prospects, calls, dash, reqs] = await Promise.all([
				getAllProspects(),
				listCalls({
					page: 1,
					pageSize: 5e4
				}),
				getDashboard(),
				listRequirements({
					page: 1,
					pageSize: 5e4
				})
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
					Lost: prospects.filter((p) => p.status === "Lost").length
				}
			});
			toast.success("Workbook downloaded");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Export failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
			children: "Data"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Export Excel"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-card p-6 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Creates a new workbook with Prospects, Call History, Requirements, and Summary. Your original import files are never touched."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: "Prospects"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-mono text-xl tabular-nums",
							children: data?.prospects ?? 0
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: "Calls"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-mono text-xl tabular-nums",
							children: data?.calls ?? 0
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: "Requirements"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-mono text-xl tabular-nums",
							children: data?.requirements ?? 0
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: "Imports"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-mono text-xl tabular-nums",
							children: data?.imports ?? 0
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					onClick: run,
					disabled: busy,
					children: busy ? "Preparing…" : "Download Excel"
				})
			]
		})]
	});
}
//#endregion
export { ExportPage as component };
