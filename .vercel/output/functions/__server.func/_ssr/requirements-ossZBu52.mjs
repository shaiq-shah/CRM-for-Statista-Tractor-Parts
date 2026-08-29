import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as Trash2, s as Search, v as ClipboardList } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CL9CUhu3.mjs";
import { t as EmptyState } from "./empty-state-CRuOjI0i.mjs";
import { I as useDeleteRequirement, q as useRequirements } from "./hooks-CZT9t7MV.mjs";
import { n as Skeleton, t as PhoneLink } from "./skeleton-BGoJabW5.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent } from "./select-CC1Gkl1M.mjs";
import { c as PART_CONDITIONS, n as Button, u as REQUIREMENT_STATUSES } from "./router-D34oBxf9.mjs";
import { n as RequirementStatusBadge, t as ConditionBadge } from "./condition-badge-CaYx6Ryc.mjs";
import { t as RequirementDialog } from "./requirement-dialog-ConxyxZf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requirements-ossZBu52.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RequirementsPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [condition, setCondition] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1);
	const { data, isLoading } = useRequirements({
		q,
		status,
		condition,
		page
	});
	const del = useDeleteRequirement();
	const [edit, setEdit] = (0, import_react.useState)(null);
	const rows = data?.rows ?? [];
	const total = data?.total ?? 0;
	const pages = Math.max(1, Math.ceil(total / 50));
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.16em] text-primary uppercase",
					children: "Parts requested"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Requirements"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-sm text-muted-foreground tabular-nums",
					children: [total, " on file"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex min-w-[200px] flex-1 gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							setQ(draft);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft,
								onChange: (e) => setDraft(e.target.value),
								placeholder: "Search part number, brand, model, dealer…",
								className: "pl-9"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							children: "Search"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: condition,
						onValueChange: (v) => {
							setCondition(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Condition" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All conditions"
						}), PART_CONDITIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c,
							children: c
						}, c))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: (v) => {
							setStatus(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), REQUIREMENT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					})
				]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-8" }),
				title: "No requirements yet",
				description: "When a prospect gives you a part number, log it on the call or on their record — OEM, used, or aftermarket, with brand, model, and the price you quoted.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/queue",
						children: "Open call queue"
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[900px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Part number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Condition"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Model"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Quoted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Prospect"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-3 font-medium" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-secondary/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 font-mono font-medium",
									children: r.partNumber || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionBadge, { condition: r.condition })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: r.brand || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: r.model || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 font-mono tabular-nums",
									children: r.priceQuoted ? `$${r.priceQuoted}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 font-mono tabular-nums",
									children: r.quantity || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/prospects/$id",
										params: { id: r.prospectId },
										className: "font-medium hover:underline",
										children: r.businessName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, { phone: r.phone })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementStatusBadge, { status: r.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2.5 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setEdit(r),
										children: "Edit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "text-destructive",
										onClick: async () => {
											await del.mutateAsync(r.id);
											toast.success("Requirement removed");
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})]
								})
							]
						}, r.id)) })]
					})
				}), pages > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border px-4 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: page <= 1,
							onClick: () => setPage((p) => p - 1),
							children: "Previous"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-muted-foreground tabular-nums",
							children: [
								page,
								" / ",
								pages
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: page >= pages,
							onClick: () => setPage((p) => p + 1),
							children: "Next"
						})
					]
				}) : null]
			}),
			edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementDialog, {
				open: true,
				onOpenChange: (v) => {
					if (!v) setEdit(null);
				},
				prospectId: edit.prospectId,
				prospectName: edit.businessName,
				requirement: edit
			}) : null
		]
	});
}
//#endregion
export { RequirementsPage as component };
