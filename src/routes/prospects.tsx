import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/prospects")({
  component: ProspectsLayout,
});

function ProspectsLayout() {
  return <Outlet />;
}
