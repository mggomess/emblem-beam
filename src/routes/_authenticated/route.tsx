import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { ensureSession } from "@/lib/auto-session";

function LoadingPanel() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">Carregando o painel…</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Acesso livre: garante sessão automaticamente, sem pedir senha.
    // Nunca bloqueia a navegação: se a rede falhar, o painel abre e
    // as consultas tentam novamente.
    try {
      await Promise.race([
        ensureSession(),
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]);
    } catch (error) {
      console.error("Sessão automática indisponível:", error);
    }
  },
  pendingMs: 100,
  pendingComponent: LoadingPanel,
  component: () => <Outlet />,
});
