import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as Plus, d as MapPin, f as Mail, h as Globe, i as Trash2, l as Phone } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CcDEPlX6.mjs";
import { t as Input } from "./input-CL9CUhu3.mjs";
import { F as useDeleteProspects, H as useProspectCalls, U as useProspectRequirements, V as useProspect, X as useUpdateProspect, l as formatDateTime, p as fromDatetimeLocal, r as datetimeLocalValue } from "./hooks-CZT9t7MV.mjs";
import { n as Skeleton, t as PhoneLink } from "./skeleton-BGoJabW5.mjs";
import { t as StatusBadge } from "./status-badge-BdDwA0hv.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Label } from "./select-CC1Gkl1M.mjs";
import { d as STATUSES, l as PRIORITIES, n as Button } from "./router-D34oBxf9.mjs";
import { t as Route } from "./router-D34oBxf92.mjs";
import { n as RequirementStatusBadge, t as ConditionBadge } from "./condition-badge-CaYx6Ryc.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DuWyDD65.mjs";
import { t as LogCallDialog } from "./log-call-dialog-BOg38deu.mjs";
import { t as ProspectFormDialog } from "./prospect-form-dialog-DueA6KKF.mjs";
import { t as RequirementDialog } from "./requirement-dialog-ConxyxZf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prospects._id-dw3HdK_W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProspectDetailPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const { data: prospect, isLoading } = useProspect(id);
	const { data: calls = [] } = useProspectCalls(id);
	const { data: requirements = [] } = useProspectRequirements(id);
	const update = useUpdateProspect();
	const del = useDeleteProspects();
	const [logOpen, setLogOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [cbOpen, setCbOpen] = (0, import_react.useState)(false);
	const [cbValue, setCbValue] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [reqOpen, setReqOpen] = (0, import_react.useState)(false);
	const [editReq, setEditReq] = (0, import_react.useState)(null);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" });
	if (!prospect) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold",
			children: "Prospect not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/prospects",
				children: "Back to prospects"
			})
		})]
	});
	const location = [
		prospect.address,
		prospect.city,
		prospect.state,
		prospect.zip
	].filter(Boolean).join(", ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/prospects",
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: "Prospects"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-semibold tracking-tight",
					children: prospect.businessName || "Untitled"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						prospect.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${prospect.phone}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), "Call now"]
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => setLogOpen(true),
							children: "Log call"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setCbValue(datetimeLocalValue(prospect.nextCallbackAt));
								setCbOpen(true);
							},
							children: "Schedule callback"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setEditOpen(true),
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setReqOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add requirement"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fact, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
							label: "Phone",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, { phone: prospect.phone }), prospect.alternatePhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-muted-foreground",
								children: ["Alt ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLink, { phone: prospect.alternatePhone })]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }),
							label: "Email",
							children: prospect.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${prospect.email}`,
								className: "hover:underline",
								children: prospect.email
							}) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4" }),
							label: "Website",
							children: prospect.website ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: prospect.website.startsWith("http") ? prospect.website : `https://${prospect.website}`,
								className: "hover:underline",
								target: "_blank",
								rel: "noreferrer",
								children: prospect.website
							}) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }),
							label: "Location",
							children: location || "—"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: prospect.status,
								onValueChange: (v) => update.mutate({
									id: prospect.id,
									patch: { status: v }
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: prospect.priority,
								onValueChange: (v) => update.mutate({
									id: prospect.id,
									patch: { priority: v }
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRIORITIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Next callback"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-sm",
							children: formatDateTime(prospect.nextCallbackAt)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Call attempts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-sm tabular-nums",
							children: prospect.callAttempts
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Current remarks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-wrap text-sm text-muted-foreground",
						children: prospect.remarks || "No remarks yet."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Next action"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: prospect.nextAction || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: [
								prospect.contactName || "No contact",
								prospect.contactTitle ? ` · ${prospect.contactTitle}` : "",
								prospect.source ? ` · ${prospect.source}` : ""
							]
						})
					]
				})]
			}),
			Object.keys(prospect.extra).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Other Excel columns"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-3 grid gap-2 sm:grid-cols-2",
					children: Object.entries(prospect.extra).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] tracking-wide text-muted-foreground uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-sm",
						children: v || "—"
					})] }, k))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-border px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Requirements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setReqOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Add"]
					})]
				}), requirements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 py-8 text-sm text-muted-foreground",
					children: "No part requirements yet. Add the part number they asked for — OEM, used, or aftermarket — with brand, model, and the price you quoted."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: requirements.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-start justify-between gap-3 px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-sm font-medium",
									children: r.partNumber || "No part number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										[r.brand, r.model].filter(Boolean).join(" ") || "Brand / model not set",
										r.priceQuoted ? ` · $${r.priceQuoted}` : "",
										r.quantity ? ` · qty ${r.quantity}` : ""
									]
								}),
								r.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: r.notes
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionBadge, { condition: r.condition }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementStatusBadge, { status: r.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setEditReq(r),
									children: "Edit"
								})
							]
						})]
					}, r.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "border-b border-border px-5 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Call history"
					})
				}), calls.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 py-8 text-sm text-muted-foreground",
					children: "No calls logged for this prospect."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "divide-y divide-border",
					children: calls.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-5 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-muted-foreground",
									children: formatDateTime(c.calledAt)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { outcome: c.outcome })]
							}),
							c.contactName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: c.contactName
							}) : null,
							c.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground whitespace-pre-wrap",
								children: c.notes
							}) : null,
							c.nextAction ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-accent",
								children: ["Next: ", c.nextAction]
							}) : null
						]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "text-destructive",
					onClick: () => setConfirm(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete prospect"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogCallDialog, {
				prospect,
				open: logOpen,
				onOpenChange: setLogOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProspectFormDialog, {
				prospect,
				open: editOpen,
				onOpenChange: setEditOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementDialog, {
				open: reqOpen || !!editReq,
				onOpenChange: (v) => {
					if (!v) {
						setReqOpen(false);
						setEditReq(null);
					}
				},
				prospectId: prospect.id,
				prospectName: prospect.businessName,
				requirement: editReq
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: cbOpen,
				onOpenChange: setCbOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Schedule callback" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "datetime-local",
						value: cbValue,
						onChange: (e) => setCbValue(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setCbOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: async () => {
							const iso = fromDatetimeLocal(cbValue);
							if (!iso) {
								toast.error("Choose a valid date and time.");
								return;
							}
							await update.mutateAsync({
								id: prospect.id,
								patch: {
									nextCallbackAt: iso,
									status: "Callback"
								}
							});
							toast.success("Callback scheduled");
							setCbOpen(false);
						},
						children: "Save"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirm,
				onOpenChange: setConfirm,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete this prospect?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Call history will be removed with the record." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground",
					onClick: async () => {
						await del.mutateAsync([prospect.id]);
						toast.success("Deleted");
						navigate({ to: "/prospects" });
					},
					children: "Delete"
				})] })] })
			})
		]
	});
}
function Fact({ icon, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 text-muted-foreground",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm",
			children
		})] })]
	});
}
function StatusChip({ outcome }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: outcome.includes("Interest") ? "Interested" : "Called" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: outcome
		})]
	});
}
//#endregion
export { ProspectDetailPage as component };
