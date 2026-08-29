import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CcDEPlX6.mjs";
import { t as Input } from "./input-CL9CUhu3.mjs";
import { t as EmptyState } from "./empty-state-CRuOjI0i.mjs";
import { C as rescheduleCallback, D as useCallbacks, R as useInvalidateCrm, d as formatTime, l as formatDateTime, n as completeCallback, p as fromDatetimeLocal, r as datetimeLocalValue } from "./hooks-CZT9t7MV.mjs";
import { n as Skeleton, t as PhoneLink } from "./skeleton-BGoJabW5.mjs";
import { t as PriorityBadge } from "./priority-badge-DWfVhJDd.mjs";
import { t as StatusBadge } from "./status-badge-BdDwA0hv.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/callbacks-DjctG1vS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CallbacksPage() {
	const { data, isLoading } = useCallbacks();
	const invalidate = useInvalidateCrm();
	const [reschedule, setReschedule] = (0, import_react.useState)(null);
	const [when, setWhen] = (0, import_react.useState)("");
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" });
	const groups = [
		["Overdue", data.overdue],
		["Today", data.today],
		["Tomorrow", data.tomorrow],
		["Upcoming", data.upcoming]
	];
	const empty = groups.every(([, rows]) => rows.length === 0);
	async function complete(p) {
		await completeCallback(p.id);
		toast.success("Callback completed");
		await invalidate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
				children: "Schedule"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Callbacks"
			})] }),
			empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No callbacks scheduled",
				description: "Log a call and set a callback to fill this list."
			}) : groups.map(([title, rows]) => rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-muted-foreground tabular-nums",
						children: rows.length
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[800px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 font-medium",
									children: "Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Business"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Phone"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Contact"
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
									children: "Last note"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2 font-medium" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-secondary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 font-mono text-xs",
									children: title === "Upcoming" ? formatDateTime(p.nextCallbackAt) : formatTime(p.nextCallbackAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 font-medium",
									children: p.businessName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, { phone: p.phone })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 text-muted-foreground",
									children: p.contactName || "—"
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
									className: "max-w-48 truncate px-3 py-2.5 text-xs text-muted-foreground",
									children: p.remarks || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-1",
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
												asChild: true,
												size: "sm",
												variant: "ghost",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/prospects/$id",
													params: { id: p.id },
													children: "Open"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => complete(p),
												children: "Complete"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => {
													setReschedule(p);
													setWhen(datetimeLocalValue(p.nextCallbackAt));
												},
												children: "Reschedule"
											})
										]
									})
								})
							]
						}, p.id)) })]
					})
				})]
			}, title) : null),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!reschedule,
				onOpenChange: (v) => !v && setReschedule(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reschedule callback" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "datetime-local",
						value: when,
						onChange: (e) => setWhen(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setReschedule(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: async () => {
							const iso = fromDatetimeLocal(when);
							if (!iso || !reschedule) {
								toast.error("Choose a valid date and time.");
								return;
							}
							await rescheduleCallback(reschedule.id, iso);
							toast.success("Callback rescheduled");
							setReschedule(null);
							await invalidate();
						},
						children: "Save"
					})] })
				] })
			})
		]
	});
}
//#endregion
export { CallbacksPage as component };
