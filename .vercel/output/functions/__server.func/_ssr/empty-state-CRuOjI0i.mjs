import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as cn } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state-CRuOjI0i.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ icon, title, description, action, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center gap-3 rounded-xl bg-card px-6 py-14 text-center shadow-[var(--shadow-border)]", className),
		children: [
			icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: icon
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium",
					children: title
				}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm text-muted-foreground",
					children: description
				}) : null]
			}),
			action
		]
	});
}
//#endregion
export { EmptyState as t };
