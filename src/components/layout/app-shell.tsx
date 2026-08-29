import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  ClipboardList,
  Clock3,
  Download,
  History,
  LayoutDashboard,
  Menu,
  Phone,
  Settings,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/prospects", label: "Prospects", icon: Building2 },
  { to: "/queue", label: "Call Queue", icon: Phone },
  { to: "/requirements", label: "Requirements", icon: ClipboardList },
  { to: "/callbacks", label: "Callbacks", icon: Clock3 },
  { to: "/history", label: "Call History", icon: History },
  { to: "/import", label: "Import Excel", icon: Upload },
  { to: "/export", label: "Export Excel", icon: Download },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
              active
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex flex-col gap-2 px-4 py-4">
      <img
        src="/statista-logo.png"
        alt="Statista Tractor Parts"
        className="h-9 w-auto max-w-[180px] object-contain object-left"
      />
      <span className="text-xs font-semibold tracking-wide text-primary uppercase">CallDesk</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-svh bg-background">
      <aside className="sticky top-0 hidden h-svh w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="h-1 bg-primary" />
        <Brand />
        <NavLinks />
        <p className="mt-auto px-5 py-4 text-[11px] tracking-wide text-sidebar-muted uppercase">
          Spare parts that deliver
        </p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-2 border-b border-border bg-card px-4 md:hidden">
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <img src="/statista-logo.png" alt="" className="h-7 w-auto object-contain" />
          <span className="text-sm font-semibold">CallDesk</span>
        </header>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="bg-sidebar p-0">
            <div className="h-1 bg-primary" />
            <Brand />
            <NavLinks onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <main className="min-w-0 flex-1 px-4 py-5 md:px-8 md:py-6">{children}</main>
      </div>
    </div>
  );
}
