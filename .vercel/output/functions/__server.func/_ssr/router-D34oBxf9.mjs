import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime, k as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as router_exports } from "./router-D34oBxf92.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/types-C6FTpoWC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatNumber(n) {
	return new Intl.NumberFormat("en-US").format(n);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,background-color,box-shadow,transform] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			outline: "bg-transparent shadow-[var(--shadow-border)] hover:bg-secondary",
			ghost: "hover:bg-secondary",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
			call: "bg-ok text-primary-foreground hover:opacity-90",
			link: "text-accent underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 rounded-sm px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var STATUSES = [
	"New",
	"To Call",
	"Called",
	"Callback",
	"Interested",
	"Follow-up",
	"Qualified",
	"Won",
	"Lost",
	"Not Interested",
	"Do Not Call"
];
var TERMINAL_STATUSES = [
	"Won",
	"Lost",
	"Do Not Call"
];
var PRIORITIES = [
	"Hot",
	"Warm",
	"Cold"
];
var LOG_CALL_OUTCOMES = [
	"No Answer",
	"Voicemail",
	"Spoke With Receptionist",
	"Spoke With Owner",
	"Spoke With Manager",
	"Interested",
	"Very Interested",
	"Send Information",
	"Callback Requested",
	"Not Interested",
	"Wrong Number",
	"Disconnected",
	"Already Has Supplier",
	"Do Not Call",
	"Qualified",
	"Converted / Won",
	"Callback Completed",
	"Callback Rescheduled"
].filter((o) => o !== "Callback Completed" && o !== "Callback Rescheduled");
var PART_CONDITIONS = [
	"OEM",
	"Used",
	"Aftermarket"
];
var REQUIREMENT_STATUSES = [
	"Open",
	"Quoted",
	"Ordered",
	"Won",
	"Lost"
];
var TRACTOR_BRANDS = [
	"John Deere",
	"Mahindra",
	"Massey Ferguson",
	"Kubota",
	"Case IH",
	"New Holland",
	"Ford",
	"International Harvester",
	"CAT",
	"Yanmar",
	"Kioti",
	"Bobcat",
	"Other"
];
var CRM_FIELDS = [
	"businessName",
	"phone",
	"alternatePhone",
	"email",
	"website",
	"address",
	"city",
	"state",
	"zip",
	"contactName",
	"contactTitle",
	"leadType",
	"status",
	"priority",
	"source",
	"remarks",
	"nextAction",
	"partNumber",
	"condition",
	"brand",
	"model",
	"priceQuoted",
	"quantity"
];
var CRM_FIELD_LABELS = {
	businessName: "Business Name",
	phone: "Phone",
	alternatePhone: "Alternate Phone",
	email: "Email",
	website: "Website",
	address: "Address",
	city: "City",
	state: "State",
	zip: "ZIP",
	contactName: "Contact Name",
	contactTitle: "Contact Title",
	leadType: "Lead Type",
	status: "Status",
	priority: "Priority",
	source: "Source",
	remarks: "Remarks",
	nextAction: "Next Action",
	partNumber: "Part Number",
	condition: "Condition (OEM / Used / Aftermarket)",
	brand: "Brand",
	model: "Model",
	priceQuoted: "Price Quoted",
	quantity: "Quantity"
};
var DEFAULT_SETTINGS = {
	id: "default",
	defaultStatus: "New",
	defaultPriority: "Warm",
	defaultCallbackMinutes: 60,
	updatedAt: (/* @__PURE__ */ new Date(0)).toISOString()
};
var FILTER_LABELS = {
	all: "All",
	new: "New",
	"to-call": "To Call",
	"never-called": "Never Called",
	"called-today": "Called Today",
	"callbacks-today": "Callbacks Today",
	overdue: "Overdue callbacks",
	requirements: "Has requirement",
	interested: "Interested",
	hot: "Hot",
	warm: "Warm",
	cold: "Cold",
	"follow-up": "Follow-up",
	won: "Won",
	lost: "Lost",
	"do-not-call": "Do Not Call"
};
//#endregion
export { DEFAULT_SETTINGS as a, PART_CONDITIONS as c, STATUSES as d, TERMINAL_STATUSES as f, formatNumber as g, cn as h, CRM_FIELD_LABELS as i, PRIORITIES as l, buttonVariants as m, Button as n, FILTER_LABELS as o, TRACTOR_BRANDS as p, CRM_FIELDS as r, LOG_CALL_OUTCOMES as s, router_exports as t, REQUIREMENT_STATUSES as u };
