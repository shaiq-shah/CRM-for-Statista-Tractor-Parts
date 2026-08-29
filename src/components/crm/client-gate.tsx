import { useEffect, useState, type ReactNode } from "react";

export function ClientGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Loading workspace</p>
        <div className="h-8 w-48 animate-pulse rounded-md bg-secondary" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-card" />
      </div>
    );
  }
  return children;
}
