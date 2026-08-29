import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Badge } from "./badge-CrXKbKDN.mjs";
import { h as cn } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/condition-badge-CaYx6Ryc.js
var import_jsx_runtime = require_jsx_runtime();
var CONDITION = {
	OEM: "bg-oem/12 text-oem",
	Used: "bg-used/15 text-used",
	Aftermarket: "bg-aftermarket/12 text-aftermarket"
};
function ConditionBadge({ condition }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", CONDITION[condition]),
		children: condition
	});
}
function RequirementStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "Won" ? "won" : status === "Lost" ? "lost" : status === "Quoted" ? "callback" : status === "Ordered" ? "qualified" : "new",
		children: status
	});
}
//#endregion
export { RequirementStatusBadge as n, ConditionBadge as t };
