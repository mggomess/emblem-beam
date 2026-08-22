import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ensureSession } from "@/lib/auto-session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrando — Certifica" },
      { name: "description", content: "Painel administrativo privado da Certifica." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Acesso livre: sem senha, entra direto no painel.
    ensureSession().finally(() => {
      navigate({ to: "/app", replace: true });
    });
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">
      <div className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-sm">Abrindo o painel…</span>
      </div>
    </div>
  );
}
