import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/layout/app-shell";
import { ClientGate } from "@/components/crm/client-gate";
import { TooltipProvider } from "@/components/ui/tooltip";
import appCss from "../styles.css?url";

const APP_NAME = "CallDesk Statista Tractor Parts";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#e52727" },
      {
        name: "description",
        content:
          "CallDesk for Statista Tractor Parts — capture OEM, used, and aftermarket requirements while you call.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 4_000, retry: 1, refetchOnWindowFocus: false } },
      }),
  );
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        <PreviewHostBridge />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={200}>
              <AppShell>
                <ClientGate>
                  <Outlet />
                </ClientGate>
              </AppShell>
              <Toaster theme="light" position="bottom-right" richColors={false} />
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
