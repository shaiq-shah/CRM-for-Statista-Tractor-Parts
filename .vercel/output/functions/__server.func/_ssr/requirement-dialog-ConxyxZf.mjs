import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CcDEPlX6.mjs";
import { t as Input } from "./input-CL9CUhu3.mjs";
import { M as useCreateRequirement, Z as useUpdateRequirement, s as emptyRequirement } from "./hooks-CZT9t7MV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Label } from "./select-CC1Gkl1M.mjs";
import { c as PART_CONDITIONS, n as Button, p as TRACTOR_BRANDS, u as REQUIREMENT_STATUSES } from "./router-D34oBxf9.mjs";
import { t as Textarea } from "./textarea-ynLQbQ8G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requirement-dialog-ConxyxZf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RequirementDialog({ open, onOpenChange, prospectId, prospectName, requirement }) {
	const create = useCreateRequirement();
	const update = useUpdateRequirement();
	const [form, setForm] = (0, import_react.useState)(emptyRequirement(prospectId));
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (requirement) setForm({ ...requirement });
		else setForm(emptyRequirement(prospectId));
	}, [
		open,
		requirement,
		prospectId
	]);
	async function submit() {
		if (!form.partNumber.trim() && !form.brand.trim() && !form.model.trim()) {
			toast.error("Enter a part number, brand, or model.");
			return;
		}
		try {
			if (requirement) {
				await update.mutateAsync({
					id: requirement.id,
					patch: form
				});
				toast.success("Requirement updated");
			} else {
				await create.mutateAsync({
					...form,
					prospectId
				});
				toast.success("Requirement saved");
			}
			onOpenChange(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save requirement.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: requirement ? "Edit requirement" : "Add requirement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: prospectName ? `Part request from ${prospectName}. OEM, used, or aftermarket.` : "Capture the part number, condition, brand, model, and quoted price." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementFields, {
					form,
					setForm
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void submit(),
					disabled: create.isPending || update.isPending,
					children: "Save requirement"
				})] })
			]
		})
	});
}
function RequirementFields({ form, setForm }) {
	function set(key, value) {
		setForm({
			...form,
			[key]: value
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Part number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.partNumber,
					onChange: (e) => set("partNumber", e.target.value),
					placeholder: "RE507541",
					className: "font-mono"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Condition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.condition,
						onValueChange: (v) => set("condition", v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PART_CONDITIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c,
							children: c
						}, c)) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.status,
						onValueChange: (v) => set("status", v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: REQUIREMENT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s)) })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brand" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							list: "tractor-brands",
							value: form.brand,
							onChange: (e) => set("brand", e.target.value),
							placeholder: "John Deere"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "tractor-brands",
							children: TRACTOR_BRANDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: b }, b))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.model,
						onChange: (e) => set("model", e.target.value),
						placeholder: "5075E"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price quoted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.priceQuoted,
						onChange: (e) => set("priceQuoted", e.target.value),
						placeholder: "48.50",
						className: "font-mono"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.quantity,
						onChange: (e) => set("quantity", e.target.value),
						placeholder: "1"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: form.notes,
					onChange: (e) => set("notes", e.target.value)
				})]
			})
		]
	});
}
//#endregion
export { RequirementDialog as t };
