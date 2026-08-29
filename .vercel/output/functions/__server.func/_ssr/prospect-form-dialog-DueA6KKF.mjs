import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CcDEPlX6.mjs";
import { t as Input } from "./input-CL9CUhu3.mjs";
import { X as useUpdateProspect, Y as useSettings, j as useCreateProspect, o as emptyProspect } from "./hooks-CZT9t7MV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Label } from "./select-CC1Gkl1M.mjs";
import { d as STATUSES, l as PRIORITIES, n as Button } from "./router-D34oBxf9.mjs";
import { t as Textarea } from "./textarea-ynLQbQ8G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prospect-form-dialog-DueA6KKF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELDS = [
	{
		key: "businessName",
		label: "Business name"
	},
	{
		key: "phone",
		label: "Phone"
	},
	{
		key: "alternatePhone",
		label: "Alternate phone"
	},
	{
		key: "email",
		label: "Email"
	},
	{
		key: "website",
		label: "Website"
	},
	{
		key: "contactName",
		label: "Contact name"
	},
	{
		key: "contactTitle",
		label: "Contact title"
	},
	{
		key: "address",
		label: "Address",
		span: true
	},
	{
		key: "city",
		label: "City"
	},
	{
		key: "state",
		label: "State"
	},
	{
		key: "zip",
		label: "ZIP"
	},
	{
		key: "leadType",
		label: "Lead type"
	},
	{
		key: "source",
		label: "Source"
	}
];
function ProspectFormDialog({ open, onOpenChange, prospect }) {
	const create = useCreateProspect();
	const update = useUpdateProspect();
	const settings = useSettings();
	const [form, setForm] = (0, import_react.useState)(emptyProspect());
	(0, import_react.useEffect)(() => {
		if (open) {
			if (prospect) setForm({ ...prospect });
			else setForm({
				...emptyProspect(),
				status: settings.data?.defaultStatus ?? "New",
				priority: settings.data?.defaultPriority ?? "Warm"
			});
		}
	}, [
		open,
		prospect,
		settings.data
	]);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function submit() {
		if (!form.businessName.trim() && !form.phone.trim()) {
			toast.error("Enter a business name or phone number.");
			return;
		}
		try {
			if (prospect) {
				await update.mutateAsync({
					id: prospect.id,
					patch: form
				});
				toast.success("Prospect updated");
			} else {
				await create.mutateAsync(form);
				toast.success("Prospect added");
			}
			onOpenChange(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save prospect.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] max-w-2xl overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: prospect ? "Edit prospect" : "Add prospect" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: [
						FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: f.span ? "grid gap-1.5 sm:col-span-2" : "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: f.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(form[f.key] ?? ""),
								onChange: (e) => set(f.key, e.target.value)
							})]
						}, f.key)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.status,
								onValueChange: (v) => set("status", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.priority,
								onValueChange: (v) => set("priority", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRIORITIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Remarks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.remarks,
								onChange: (e) => set("remarks", e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Next action" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.nextAction,
								onChange: (e) => set("nextAction", e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: create.isPending || update.isPending,
					children: prospect ? "Save changes" : "Add prospect"
				})] })
			]
		})
	});
}
//#endregion
export { ProspectFormDialog as t };
