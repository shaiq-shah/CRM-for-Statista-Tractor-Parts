import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime, d as DialogContent, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as Building2, _ as Clock3, g as Download, l as Phone, m as History, n as Upload, o as Settings, p as LayoutDashboard, r as TriangleAlert, t as X, u as Menu, v as ClipboardList } from "../_libs/lucide-react.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { h as cn, n as Button, o as FILTER_LABELS } from "./router-D34oBxf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D34oBxf9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var Sheet = Dialog;
var SheetContent = import_react.forwardRef(({ className, children, side = "left", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn("fixed z-50 flex h-full w-72 flex-col bg-sidebar shadow-[var(--shadow-border)]", side === "left" ? "top-0 left-0" : "top-0 right-0", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-4 right-4 text-muted-foreground hover:text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = "SheetContent";
var NAV = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/prospects",
		label: "Prospects",
		icon: Building2
	},
	{
		to: "/queue",
		label: "Call Queue",
		icon: Phone
	},
	{
		to: "/requirements",
		label: "Requirements",
		icon: ClipboardList
	},
	{
		to: "/callbacks",
		label: "Callbacks",
		icon: Clock3
	},
	{
		to: "/history",
		label: "Call History",
		icon: History
	},
	{
		to: "/import",
		label: "Import Excel",
		icon: Upload
	},
	{
		to: "/export",
		label: "Export Excel",
		icon: Download
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function NavLinks({ onClick }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-0.5 px-3",
		children: NAV.map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick,
				className: cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150", active ? "bg-primary text-primary-foreground" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
			}, item.to);
		})
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex flex-col gap-2 px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/statista-logo.png",
			alt: "Statista Tractor Parts",
			className: "h-9 w-auto max-w-[180px] object-contain object-left"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold tracking-wide text-primary uppercase",
			children: "CallDesk"
		})]
	});
}
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-svh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sticky top-0 hidden h-svh w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 bg-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-auto px-5 py-4 text-[11px] tracking-wide text-sidebar-muted uppercase",
					children: "Spare parts that deliver"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center gap-2 border-b border-border bg-card px-4 md:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setOpen(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/statista-logo.png",
							alt: "",
							className: "h-7 w-auto object-contain"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "CallDesk"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
						side: "left",
						className: "bg-sidebar p-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 bg-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onClick: () => setOpen(false) })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 px-4 py-5 md:px-8 md:py-6",
					children
				})
			]
		})]
	});
}
function ClientGate({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading workspace"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 animate-pulse rounded-md bg-secondary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-6",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-xl bg-card" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-xl bg-card" })
		]
	});
	return children;
}
var TooltipProvider = Provider;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-[var(--shadow-border)]", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var styles_default = "/assets/styles-D5znNYCM.css";
var APP_NAME = "CallDesk Statista Tractor Parts";
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#e52727"
			},
			{
				name: "description",
				content: "CallDesk for Statista Tractor Parts — capture OEM, used, and aftermarket requirements while you call."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 4e3,
		retry: 1,
		refetchOnWindowFocus: false
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
					client: queryClient,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
						delayDuration: 200,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
							theme: "light",
							position: "bottom-right",
							richColors: false
						})]
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$10 = () => import("./routes-D5GnQLK9.mjs");
var Route$10 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./callbacks-DjctG1vS.mjs");
var Route$9 = createFileRoute("/callbacks")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./export-BojPSv03.mjs");
var Route$8 = createFileRoute("/export")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./history-D1WYrYYa.mjs");
var Route$7 = createFileRoute("/history")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./import-IcPyu-2g.mjs");
var Route$6 = createFileRoute("/import")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./prospects-CzJAk8jW.mjs");
var Route$5 = createFileRoute("/prospects")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./queue-CcjIvcRR.mjs");
var Route$4 = createFileRoute("/queue")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./requirements-ossZBu52.mjs");
var Route$3 = createFileRoute("/requirements")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./settings-BrJOG8Ra.mjs");
var Route$2 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./prospects.index-Cm-L60K8.mjs");
var Route$1 = createFileRoute("/prospects/")({
	validateSearch: (s) => {
		const out = {};
		if (typeof s.q === "string") out.q = s.q;
		if (typeof s.filter === "string" && s.filter in FILTER_LABELS) out.filter = s.filter;
		if (Number(s.page) > 0) out.page = Number(s.page);
		if (typeof s.sort === "string") out.sort = s.sort;
		if (s.dir === "asc" || s.dir === "desc") out.dir = s.dir;
		return out;
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./prospects._id-dw3HdK_W.mjs");
var Route = createFileRoute("/prospects/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var CallbacksRoute = Route$9.update({
	id: "/callbacks",
	path: "/callbacks",
	getParentRoute: () => Route$11
});
var ExportRoute = Route$8.update({
	id: "/export",
	path: "/export",
	getParentRoute: () => Route$11
});
var HistoryRoute = Route$7.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => Route$11
});
var ImportRoute = Route$6.update({
	id: "/import",
	path: "/import",
	getParentRoute: () => Route$11
});
var ProspectsRoute = Route$5.update({
	id: "/prospects",
	path: "/prospects",
	getParentRoute: () => Route$11
});
var QueueRoute = Route$4.update({
	id: "/queue",
	path: "/queue",
	getParentRoute: () => Route$11
});
var RequirementsRoute = Route$3.update({
	id: "/requirements",
	path: "/requirements",
	getParentRoute: () => Route$11
});
var SettingsRoute = Route$2.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$11
});
var ProspectsIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => ProspectsRoute
});
var ProspectsRouteChildren = {
	ProspectsIdRoute: Route.update({
		id: "/$id",
		path: "/$id",
		getParentRoute: () => ProspectsRoute
	}),
	ProspectsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	CallbacksRoute,
	ExportRoute,
	HistoryRoute,
	ImportRoute,
	ProspectsRoute: ProspectsRoute._addFileChildren(ProspectsRouteChildren),
	QueueRoute,
	RequirementsRoute,
	SettingsRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { router_exports as i, Route$1 as n, getRouter as r, Route as t };
