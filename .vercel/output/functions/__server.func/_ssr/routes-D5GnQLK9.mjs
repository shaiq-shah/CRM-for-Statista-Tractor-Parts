import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { l as Phone, n as Upload } from "../_libs/lucide-react.mjs";
import { t as EmptyState } from "./empty-state-CRuOjI0i.mjs";
import { N as useDashboard, f as formatTimeShort, u as formatRelativeDay, z as useLoadSample } from "./hooks-CZT9t7MV.mjs";
import { n as Skeleton, t as PhoneLink } from "./skeleton-BGoJabW5.mjs";
import { t as PriorityBadge } from "./priority-badge-DWfVhJDd.mjs";
import { t as StatusBadge } from "./status-badge-BdDwA0hv.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as formatNumber, h as cn, n as Button } from "./router-D34oBxf9.mjs";
import { n as RequirementStatusBadge, t as ConditionBadge } from "./condition-badge-CaYx6Ryc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D5GnQLK9.js
var import_jsx_runtime = require_jsx_runtime();
function KpiCard({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-2 font-mono text-3xl leading-none font-medium tabular-nums", tone === "warn" && "text-warm", tone === "ok" && "text-ok", tone === "hot" && "text-hot"),
			children: formatNumber(value)
		})]
	});
}
function DashboardPage() {
	const { data, isLoading } = useDashboard();
	const sample = useLoadSample();
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-6",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" })]
	});
	const empty = data.stats.total === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.16em] text-primary uppercase",
					children: "CallDesk Statista Tractor Parts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Dashboard"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/import",
							children: "Import Excel"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/queue",
							children: "Open call queue"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Total prospects",
						value: data.stats.total
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "To call",
						value: data.stats.toCall
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Called today",
						value: data.stats.calledToday
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Callbacks today",
						value: data.stats.callbacksToday
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Requirements",
						value: data.stats.requirements,
						tone: "hot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Interested",
						value: data.stats.interested,
						tone: "ok"
					})
				]
			}),
			empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-8" }),
				title: "No prospects yet",
				description: "Import an Excel workbook with dealers and part numbers. Every row becomes a prospect, and part details become requirements you can quote.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/import",
							children: "Import Excel"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => sample.mutate(),
						disabled: sample.isPending,
						children: "Load sample workspace"
					})]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Today's call queue",
						className: "xl:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProspectMiniTable, {
							rows: data.todayQueue,
							empty: "Nothing queued for today."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Recent activity",
						children: data.activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-8 text-sm text-muted-foreground",
							children: "No calls logged yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: data.activity.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-3 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: a.businessName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: a.outcome
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-muted-foreground tabular-nums",
									children: formatTimeShort(a.calledAt)
								})]
							}, a.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Open requirements",
						className: "xl:col-span-3",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/requirements",
								children: "View all"
							})
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementMiniTable, { rows: data.openRequirements })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Upcoming callbacks",
						className: "xl:col-span-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProspectMiniTable, {
							rows: data.upcoming,
							empty: "No upcoming callbacks."
						})
					})
				]
			})
		]
	});
}
function Panel({ title, children, className, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: title
			}), action]
		}), children]
	});
}
function RequirementMiniTable({ rows }) {
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-8 text-sm text-muted-foreground",
		children: "No open requirements. Log a part number from a call, or import a workbook with OEM / used / aftermarket columns."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[720px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-[11px] tracking-wide text-muted-foreground uppercase",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2 font-medium",
						children: "Part number"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Condition"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Brand / model"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Quoted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Prospect"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2 font-medium" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border hover:bg-secondary/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2.5 font-mono text-sm font-medium",
						children: r.partNumber || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionBadge, { condition: r.condition })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5",
						children: [r.brand, r.model].filter(Boolean).join(" ") || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 font-mono tabular-nums",
						children: r.priceQuoted ? `$${r.priceQuoted}` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: r.businessName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, {
							phone: r.phone,
							className: "text-xs"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementStatusBadge, { status: r.status })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/prospects/$id",
								params: { id: r.prospectId },
								children: "Open"
							})
						})
					})
				]
			}, r.id)) })]
		})
	});
}
function ProspectMiniTable({ rows, empty }) {
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-8 text-sm text-muted-foreground",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[640px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-[11px] tracking-wide text-muted-foreground uppercase",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2 font-medium",
						children: "Business"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Priority"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Callback"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Attempts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2 font-medium" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border hover:bg-secondary/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2.5 font-medium",
						children: p.businessName || "Untitled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, { phone: p.phone })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: p.priority })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 font-mono text-xs text-muted-foreground",
						children: formatRelativeDay(p.nextCallbackAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 font-mono tabular-nums",
						children: p.callAttempts
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-3 py-2.5 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/prospects/$id",
								params: { id: p.id },
								children: "Open"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/queue",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), "Call"]
							})
						})]
					})
				]
			}, p.id)) })]
		})
	});
}
//#endregion
export { DashboardPage as component };
