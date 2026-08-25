import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { ensureSession } from "@/lib/auto-session";

function AuthenticatedLayout() {
  useEffect(() => {
    // Acesso livre: prepara/renova a sessão em segundo plano.
    // A abertura do painel nunca depende dessa chamada terminar.
    void ensureSession();
  }, []);

  return <Outlet />;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});
