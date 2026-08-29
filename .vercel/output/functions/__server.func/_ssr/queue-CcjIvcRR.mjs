import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as SkipForward, l as Phone } from "../_libs/lucide-react.mjs";
import { t as EmptyState } from "./empty-state-CRuOjI0i.mjs";
import { G as useQueue, K as useQueueSession, U as useProspectRequirements, a as displayPhone, l as formatDateTime } from "./hooks-CZT9t7MV.mjs";
import { n as Skeleton, t as PhoneLink } from "./skeleton-BGoJabW5.mjs";
import { t as PriorityBadge } from "./priority-badge-DWfVhJDd.mjs";
import { t as StatusBadge } from "./status-badge-BdDwA0hv.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./router-D34oBxf9.mjs";
import { t as ConditionBadge } from "./condition-badge-CaYx6Ryc.mjs";
import { t as LogCallDialog } from "./log-call-dialog-BOg38deu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queue-CcjIvcRR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QueuePage() {
	const { data = [], isLoading } = useQueue();
	const skip = useQueueSession((s) => s.skip);
	const reset = useQueueSession((s) => s.reset);
	const [logOpen, setLogOpen] = (0, import_react.useState)(false);
	const current = data[0] ?? null;
	const upcoming = data.slice(1, 8);
	const remaining = data.length;
	const { data: reqs = [] } = useProspectRequirements(current?.id);
	const subtitle = (0, import_react.useMemo)(() => {
		if (!current) return "";
		return [current.city, current.state].filter(Boolean).join(", ");
	}, [current]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" });
	if (!current) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Call queue"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-8" }),
			title: "Queue is clear",
			description: "No more prospects to call right now. Import a list, or reset skipped records.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/import",
						children: "Import Excel"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => reset(),
					children: "Reset skipped"
				})]
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
					children: "Next prospect"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Call queue"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-sm text-muted-foreground tabular-nums",
					children: [remaining, " remaining"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card px-6 py-8 text-center shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: subtitle || current.leadType || "Prospect"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-3xl font-semibold tracking-tight",
						children: current.businessName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-mono text-2xl tracking-wide",
						children: displayPhone(current.phone)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: current.status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: current.priority }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["Attempts ", current.callAttempts]
							})
						]
					}),
					current.contactName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: [current.contactName, current.contactTitle ? ` · ${current.contactTitle}` : ""]
					}) : null,
					current.remarks ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-lg text-sm text-muted-foreground",
						children: current.remarks
					}) : null,
					current.nextCallbackAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-warm",
						children: ["Callback ", formatDateTime(current.nextCallbackAt)]
					}) : null,
					reqs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-5 max-w-lg space-y-2 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[11px] font-semibold tracking-[0.14em] text-primary uppercase",
							children: "Open requirements"
						}), reqs.filter((r) => r.status === "Open" || r.status === "Quoted").slice(0, 4).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2 rounded-md bg-secondary px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm font-medium",
								children: r.partNumber || "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [[r.brand, r.model].filter(Boolean).join(" "), r.priceQuoted ? ` · $${r.priceQuoted}` : ""]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionBadge, { condition: r.condition })]
						}, r.id))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap justify-center gap-2",
						children: [
							current.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${current.phone}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), "Call"]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								disabled: true,
								children: "No phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								onClick: () => setLogOpen(true),
								children: "Log result"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								variant: "outline",
								onClick: () => skip(current.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" }), "Skip"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/prospects/$id",
								params: { id: current.id },
								children: "Open full record"
							})
						})
					})
				]
			}),
			upcoming.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "border-b border-border px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Up next"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: upcoming.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: p.businessName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, {
								phone: p.phone,
								className: "text-xs"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: p.priority }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })]
						})]
					}, p.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogCallDialog, {
				prospect: current,
				open: logOpen,
				onOpenChange: setLogOpen,
				onSaved: () => skip(current.id),
				onSavedNext: () => skip(current.id)
			})
		]
	});
}
//#endregion
export { QueuePage as component };
