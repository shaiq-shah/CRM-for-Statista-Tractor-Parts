import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as cn } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-CL9CUhu3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-10 w-full rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
//#endregion
export { Input as t };
