import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/gov/forms")({ component: () => <Outlet /> });
