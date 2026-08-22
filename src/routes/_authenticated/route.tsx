import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ensureSession } from "@/lib/auto-session";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Acesso livre: garante sessão automaticamente, sem pedir senha.
    await ensureSession();
  },
  component: () => <Outlet />,
});
