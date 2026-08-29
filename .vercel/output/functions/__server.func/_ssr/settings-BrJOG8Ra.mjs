import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { J as useSaveSettings, P as useDbInfo, R as useInvalidateCrm, Y as useSettings, _ as listCalls, c as exportBackup, h as getDashboard, k as useClearAll, m as getAllProspects, v as listRequirements, w as restoreBackup, z as useLoadSample } from "./hooks-CZT9t7MV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as exportWorkbook } from "./excel-BcGc6GkZ.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Label } from "./select-CC1Gkl1M.mjs";
import { d as STATUSES, l as PRIORITIES, n as Button } from "./router-D34oBxf9.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DuWyDD65.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BrJOG8Ra.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var UnconfiguredProvider = class {
	isConfigured() {
		return false;
	}
	async search(_query) {
		return [];
	}
};
var provider = new UnconfiguredProvider();
function isVendorSearchConfigured() {
	return provider.isConfigured();
}
function SettingsPage() {
	const { data: settings } = useSettings();
	const { data: info } = useDbInfo();
	const save = useSaveSettings();
	const sample = useLoadSample();
	const clear = useClearAll();
	const invalidate = useInvalidateCrm();
	const [wipeOpen, setWipeOpen] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	if (!settings) return null;
	async function backupJson() {
		const payload = await exportBackup();
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `CallDesk-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
	async function backupXlsx() {
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
				Requirements: dash.stats.requirements,
				Interested: dash.stats.interested,
				Won: prospects.filter((p) => p.status === "Won").length,
				Lost: prospects.filter((p) => p.status === "Lost").length
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
				children: "Workspace"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Settings"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Defaults"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Imported status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: settings.defaultStatus,
								onValueChange: (v) => save.mutate({ defaultStatus: v }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Default priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: settings.defaultPriority,
								onValueChange: (v) => save.mutate({ defaultPriority: v }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRIORITIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Callback duration" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(settings.defaultCallbackMinutes),
								onValueChange: (v) => save.mutate({ defaultCallbackMinutes: Number(v) }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
									15,
									30,
									60,
									120,
									1440
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: String(n),
									children: n >= 1440 ? "1 day" : `${n} minutes`
								}, n)) })]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Database"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							info?.prospects ?? 0,
							" prospects · ",
							info?.calls ?? 0,
							" calls · ",
							info?.requirements ?? 0,
							" ",
							"requirements · ",
							info?.imports ?? 0,
							" imports. Data stays on this device."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: backupJson,
								children: "Backup database"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: backupXlsx,
								children: "Export Excel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => fileRef.current?.click(),
								children: "Restore backup"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "application/json",
								className: "hidden",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									try {
										const json = JSON.parse(await file.text());
										await restoreBackup(json);
										await invalidate();
										toast.success("Backup restored");
									} catch {
										toast.error("That backup file could not be read.");
									}
									e.target.value = "";
								}
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Sample data"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Optional demo workspace. It is clearly sourced as “Sample” and can be wiped anytime."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: async () => {
								const n = await sample.mutateAsync();
								toast.success(`Loaded ${n} sample prospects`);
							},
							disabled: sample.isPending,
							children: "Load sample workspace"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							onClick: () => setWipeOpen(true),
							children: "Clear all data"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Vendor search"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: isVendorSearchConfigured() ? "An external provider is configured." : "Not configured. CallDesk works fully offline. A vendor-search module can be added later without changing the CRM core."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Application"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "CallDesk Statista Tractor Parts · local-first CRM. Data never leaves this browser unless you export it."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: wipeOpen,
				onOpenChange: setWipeOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Clear the entire database?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Prospects, call history, and import logs will be deleted from this browser. Export a backup first if you need it." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground",
					onClick: async () => {
						await clear.mutateAsync();
						toast.success("Database cleared");
						setWipeOpen(false);
					},
					children: "Clear everything"
				})] })] })
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
