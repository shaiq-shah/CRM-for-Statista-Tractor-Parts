import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as ChevronLeft, s as Search, y as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CL9CUhu3.mjs";
import { t as EmptyState } from "./empty-state-CRuOjI0i.mjs";
import { O as useCalls, l as formatDateTime } from "./hooks-CZT9t7MV.mjs";
import { n as Skeleton, t as PhoneLink } from "./skeleton-BGoJabW5.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as formatNumber, n as Button } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-D1WYrYYa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const { data, isLoading } = useCalls({
		q,
		page,
		pageSize: 50
	});
	const total = data?.total ?? 0;
	const pages = Math.max(1, Math.ceil(total / 50));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
				children: "Activity"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Call history"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				className: "flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					setPage(1);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						value: q,
						onChange: (e) => {
							setQ(e.target.value);
							setPage(1);
						},
						placeholder: "Search notes, outcomes, businesses…"
					})]
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" }) : total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No calls logged",
				description: "Every call is stored permanently and never overwritten."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[860px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 font-medium",
									children: "Date"
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
									children: "Outcome"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Notes"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data?.rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-secondary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 font-mono text-xs whitespace-nowrap",
									children: formatDateTime(c.calledAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/prospects/$id",
										params: { id: c.prospectId },
										className: "hover:underline",
										children: c.businessName
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, { phone: c.phone })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 text-muted-foreground",
									children: c.contactName || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: c.outcome
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "max-w-sm truncate px-3 py-2.5 text-muted-foreground",
									children: c.notes || "—"
								})
							]
						}, c.id)) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border px-3 py-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						formatNumber(total),
						" records · page ",
						page,
						" of ",
						pages
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							disabled: page <= 1,
							onClick: () => setPage((p) => p - 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							disabled: page >= pages,
							onClick: () => setPage((p) => p + 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { HistoryPage as component };
