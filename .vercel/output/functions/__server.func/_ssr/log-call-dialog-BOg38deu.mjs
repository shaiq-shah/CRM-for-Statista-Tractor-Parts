import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CcDEPlX6.mjs";
import { t as Input } from "./input-CL9CUhu3.mjs";
import { B as useLogCall, Y as useSettings, i as defaultCallbackIso, p as fromDatetimeLocal } from "./hooks-CZT9t7MV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Label } from "./select-CC1Gkl1M.mjs";
import { c as PART_CONDITIONS, n as Button, p as TRACTOR_BRANDS, s as LOG_CALL_OUTCOMES } from "./router-D34oBxf9.mjs";
import { t as Textarea } from "./textarea-ynLQbQ8G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/log-call-dialog-BOg38deu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LogCallDialog({ prospect, open, onOpenChange, onSaved, onSavedNext }) {
	const logCall = useLogCall();
	const settings = useSettings();
	const [outcome, setOutcome] = (0, import_react.useState)("No Answer");
	const [contactName, setContactName] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [callback, setCallback] = (0, import_react.useState)("");
	const [nextAction, setNextAction] = (0, import_react.useState)("");
	const [partNumber, setPartNumber] = (0, import_react.useState)("");
	const [condition, setCondition] = (0, import_react.useState)("OEM");
	const [brand, setBrand] = (0, import_react.useState)("");
	const [model, setModel] = (0, import_react.useState)("");
	const [priceQuoted, setPriceQuoted] = (0, import_react.useState)("");
	const [quantity, setQuantity] = (0, import_react.useState)("");
	function reset(p) {
		setOutcome("No Answer");
		setContactName(p?.contactName ?? "");
		setNotes("");
		setCallback("");
		setNextAction(p?.nextAction ?? "");
		setPartNumber("");
		setCondition("OEM");
		setBrand("");
		setModel("");
		setPriceQuoted("");
		setQuantity("");
	}
	async function save(mode) {
		if (!prospect) return;
		let callbackAt = fromDatetimeLocal(callback);
		if (mode === "callback" && !callbackAt) callbackAt = defaultCallbackIso(settings.data?.defaultCallbackMinutes ?? 60);
		const finalOutcome = mode === "callback" && outcome === "No Answer" ? "Callback Requested" : outcome;
		const hasReq = partNumber.trim() || brand.trim() || model.trim() || priceQuoted.trim();
		try {
			await logCall.mutateAsync({
				prospectId: prospect.id,
				outcome: finalOutcome,
				contactName,
				notes,
				callbackAt,
				nextAction,
				requirement: hasReq ? {
					partNumber,
					condition,
					brand,
					model,
					priceQuoted,
					quantity,
					notes: notes.trim() ? `From call: ${notes.trim()}` : "",
					status: "Open"
				} : null
			});
			toast.success(hasReq ? "Call logged with requirement" : "Call logged");
			onOpenChange(false);
			reset(prospect);
			if (mode === "next") onSavedNext?.();
			else onSaved?.();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save call.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			onOpenChange(v);
			if (v) reset(prospect);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Log call" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: prospect ? `${prospect.businessName} · ${prospect.phone || "No phone"}` : "Select a prospect" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Outcome" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: outcome,
								onValueChange: (v) => setOutcome(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LOG_CALL_OUTCOMES.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: o,
									children: o
								}, o)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Contact spoken to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: contactName,
								onChange: (e) => setContactName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Remarks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: "What they said, callback notes, anything useful…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-secondary/50 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold tracking-[0.14em] text-primary uppercase",
									children: "Requirement"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 mb-3 text-xs text-muted-foreground",
									children: "If they gave you a part number, log it here — OEM, used, or aftermarket, plus brand, model, and the price you quoted."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Part number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: partNumber,
												onChange: (e) => setPartNumber(e.target.value),
												placeholder: "RE507541",
												className: "font-mono"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 sm:grid-cols-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Condition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: condition,
														onValueChange: (v) => setCondition(v),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PART_CONDITIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: c,
															children: c
														}, c)) })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brand" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															list: "log-call-brands",
															value: brand,
															onChange: (e) => setBrand(e.target.value),
															placeholder: "John Deere"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
															id: "log-call-brands",
															children: TRACTOR_BRANDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: b }, b))
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: model,
														onChange: (e) => setModel(e.target.value),
														placeholder: "5075E"
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price quoted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: priceQuoted,
													onChange: (e) => setPriceQuoted(e.target.value),
													placeholder: "48.50",
													className: "font-mono"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Qty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: quantity,
													onChange: (e) => setQuantity(e.target.value),
													placeholder: "1"
												})]
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Callback" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "datetime-local",
								value: callback,
								onChange: (e) => setCallback(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Next action" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: nextAction,
								onChange: (e) => setNextAction(e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								disabled: logCall.isPending,
								onClick: () => save("save"),
								children: "Save call"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								disabled: logCall.isPending,
								onClick: () => save("callback"),
								children: "Save & callback"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: logCall.isPending,
								onClick: () => save("next"),
								children: "Save & next"
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { LogCallDialog as t };
