import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Badge } from "./badge-CrXKbKDN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-BdDwA0hv.js
var import_jsx_runtime = require_jsx_runtime();
var MAP = {
	New: "new",
	"To Call": "call",
	Called: "called",
	Callback: "callback",
	Interested: "interested",
	"Follow-up": "follow",
	Qualified: "qualified",
	Won: "won",
	Lost: "lost",
	"Not Interested": "lost",
	"Do Not Call": "dnc"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: MAP[status],
		children: status
	});
}
//#endregion
export { StatusBadge as t };
