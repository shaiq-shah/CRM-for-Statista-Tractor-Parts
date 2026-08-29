import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Badge } from "./badge-CrXKbKDN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/priority-badge-DWfVhJDd.js
var import_jsx_runtime = require_jsx_runtime();
function PriorityBadge({ priority }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: priority === "Hot" ? "hot" : priority === "Warm" ? "warm" : "cold",
		children: priority
	});
}
//#endregion
export { PriorityBadge as t };
