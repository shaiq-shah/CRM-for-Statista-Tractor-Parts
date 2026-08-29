import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { h as cn } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CrXKbKDN.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "bg-secondary text-muted-foreground",
		new: "bg-secondary text-muted-foreground",
		call: "bg-accent/15 text-accent",
		called: "bg-secondary text-muted-foreground",
		callback: "bg-warm/15 text-warm",
		interested: "bg-ok/15 text-ok",
		follow: "bg-accent/15 text-accent",
		qualified: "bg-ok/20 text-ok",
		won: "bg-ok/25 text-ok",
		lost: "bg-destructive/15 text-destructive",
		dnc: "bg-destructive/20 text-destructive",
		hot: "bg-hot/15 text-hot",
		warm: "bg-warm/15 text-warm",
		cold: "bg-cold/15 text-cold"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
