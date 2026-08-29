import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { T as telHref, a as displayPhone } from "./hooks-CZT9t7MV.mjs";
import { h as cn } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skeleton-BGoJabW5.js
var import_jsx_runtime = require_jsx_runtime();
function PhoneLink({ phone, className }) {
	const href = telHref(phone);
	const label = displayPhone(phone);
	if (!href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("font-mono text-sm text-muted-foreground", className),
		children: label
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className: cn("font-mono text-sm text-foreground underline-offset-4 hover:text-accent hover:underline", className),
		children: label
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-secondary", className),
		...props
	});
}
//#endregion
export { Skeleton as n, PhoneLink as t };
