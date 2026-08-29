import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as Check, b as ChevronLeft, c as Plus, i as Trash2, s as Search, y as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CL9CUhu3.mjs";
import { t as EmptyState } from "./empty-state-CRuOjI0i.mjs";
import { E as useBulkUpdate, F as useDeleteProspects, W as useProspects, _ as listCalls, l as formatDateTime, m as getAllProspects } from "./hooks-CZT9t7MV.mjs";
import { n as Skeleton, t as PhoneLink } from "./skeleton-BGoJabW5.mjs";
import { t as PriorityBadge } from "./priority-badge-DWfVhJDd.mjs";
import { t as StatusBadge } from "./status-badge-BdDwA0hv.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as exportWorkbook } from "./excel-BcGc6GkZ.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent } from "./select-CC1Gkl1M.mjs";
import { d as STATUSES, g as formatNumber, h as cn, l as PRIORITIES, n as Button, o as FILTER_LABELS } from "./router-D34oBxf9.mjs";
import { n as Route$1 } from "./router-D34oBxf92.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DuWyDD65.mjs";
import { t as LogCallDialog } from "./log-call-dialog-BOg38deu.mjs";
import { t as ProspectFormDialog } from "./prospect-form-dialog-DueA6KKF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prospects.index-Cm-L60K8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("peer size-4 shrink-0 rounded-xs shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: "flex items-center justify-center text-current",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-3",
			strokeWidth: 3
		})
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var FILTERS = Object.keys(FILTER_LABELS);
function ProspectsPage() {
	const search = Route$1.useSearch();
	const navigate = Route$1.useNavigate();
	const q = search.q ?? "";
	const filter = search.filter ?? "all";
	const page = search.page ?? 1;
	const sort = search.sort ?? "updatedAt";
	const dir = search.dir ?? "desc";
	const { data, isLoading } = useProspects({
		q,
		filter,
		page,
		sort,
		dir,
		pageSize: 50
	});
	const bulk = useBulkUpdate();
	const del = useDeleteProspects();
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [logProspect, setLogProspect] = (0, import_react.useState)(null);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [draftQ, setDraftQ] = (0, import_react.useState)(q);
	const rows = data?.rows ?? [];
	const total = data?.total ?? 0;
	const pages = Math.max(1, Math.ceil(total / 50));
	const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));
	function setSearch(patch) {
		navigate({ search: (prev) => ({
			...prev,
			...patch,
			page: patch.page ?? 1
		}) });
	}
	function toggleSort(field) {
		if (sort === field) setSearch({
			dir: dir === "asc" ? "desc" : "asc",
			sort: field
		});
		else setSearch({
			sort: field,
			dir: "asc"
		});
	}
	const selectedSet = (0, import_react.useMemo)(() => new Set(selected), [selected]);
	async function applyBulkStatus(status) {
		if (!selected.length) return;
		await bulk.mutateAsync({
			ids: selected,
			patch: { status }
		});
		toast.success("Status updated");
		setSelected([]);
	}
	async function applyBulkPriority(priority) {
		if (!selected.length) return;
		await bulk.mutateAsync({
			ids: selected,
			patch: { priority }
		});
		toast.success("Priority updated");
		setSelected([]);
	}
	async function exportSelected() {
		const all = await getAllProspects();
		const set = new Set(selected);
		const prospects = selected.length ? all.filter((p) => set.has(p.id)) : all;
		const calls = await listCalls({
			page: 1,
			pageSize: 1e4
		});
		await exportWorkbook({
			prospects,
			calls: calls.rows,
			stats: {
				"Total Prospects": prospects.length,
				Exported: prospects.length
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
					children: "Database"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Prospects"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAddOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add prospect"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-wrap items-center gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					setSearch({
						q: draftQ,
						page: 1
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-56 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draftQ,
						onChange: (e) => setDraftQ(e.target.value),
						placeholder: "Search business, phone, email, city…",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "secondary",
					children: "Search"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSearch({
						filter: f,
						page: 1
					}),
					className: `h-8 rounded-md px-2.5 text-xs font-medium ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
					children: FILTER_LABELS[f]
				}, f))
			}),
			selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [selected.length, " selected"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						onValueChange: (v) => applyBulkStatus(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-8 w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Set status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						onValueChange: (v) => applyBulkPriority(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-8 w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Set priority" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRIORITIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "h-8 w-36",
						placeholder: "Set source",
						onKeyDown: async (e) => {
							if (e.key === "Enter") {
								const source = e.target.value.trim();
								if (!source || !selected.length) return;
								await bulk.mutateAsync({
									ids: selected,
									patch: { source }
								});
								toast.success("Source updated");
								setSelected([]);
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => exportSelected(),
						children: "Export selected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "destructive",
						onClick: () => setConfirmDelete(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Delete"]
					})
				]
			}) : null,
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" }) : total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No matching prospects",
				description: "Adjust filters or import an Excel workbook.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/import",
						children: "Import Excel"
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[980px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-10 px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: allChecked,
										onCheckedChange: (v) => setSelected(v ? rows.map((r) => r.id) : [])
									})
								}),
								[
									["businessName", "Business"],
									["phone", "Phone"],
									["contactName", "Contact"],
									["city", "Location"],
									["status", "Status"],
									["priority", "Priority"],
									["lastCalledAt", "Last called"],
									["nextCallbackAt", "Callback"],
									["callAttempts", "Attempts"]
								].map(([field, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => toggleSort(field),
										children: [label, sort === field ? dir === "asc" ? " ↑" : " ↓" : ""]
									})
								}, field)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-secondary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: selectedSet.has(p.id),
										onCheckedChange: (v) => setSelected((cur) => v ? [...cur, p.id] : cur.filter((id) => id !== p.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/prospects/$id",
										params: { id: p.id },
										className: "hover:underline",
										children: p.businessName || "Untitled"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, { phone: p.phone })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-muted-foreground",
									children: p.contactName || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-muted-foreground",
									children: [p.city, p.state].filter(Boolean).join(", ") || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: p.priority })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs text-muted-foreground",
									children: formatDateTime(p.lastCalledAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs text-muted-foreground",
									children: formatDateTime(p.nextCallbackAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono tabular-nums",
									children: p.callAttempts
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												variant: "ghost",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: p.phone ? `tel:${p.phone}` : void 0,
													children: "Call"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => setLogProspect(p),
												children: "Log"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												variant: "ghost",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/prospects/$id",
													params: { id: p.id },
													children: "Open"
												})
											})
										]
									})
								})
							]
						}, p.id)) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border px-3 py-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						formatNumber(total),
						" prospects · page ",
						page,
						" of ",
						pages
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							disabled: page <= 1,
							onClick: () => setSearch({ page: page - 1 }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							disabled: page >= pages,
							onClick: () => setSearch({ page: page + 1 }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProspectFormDialog, {
				open: addOpen,
				onOpenChange: setAddOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogCallDialog, {
				prospect: logProspect,
				open: !!logProspect,
				onOpenChange: (v) => !v && setLogProspect(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirmDelete,
				onOpenChange: setConfirmDelete,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Delete ",
					selected.length,
					" prospects?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Call history for these records will also be removed. This cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground",
					onClick: async () => {
						await del.mutateAsync(selected);
						toast.success("Prospects deleted");
						setSelected([]);
						setConfirmDelete(false);
					},
					children: "Delete"
				})] })] })
			})
		]
	});
}
//#endregion
export { ProspectsPage as component };
