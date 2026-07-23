import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito — Certifica" },
      { name: "description", content: "Painel administrativo privado." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

// Mapeia "usuário" simples para um email interno usado pelo Supabase Auth.
// Aceita também email completo (contém "@").
function resolveEmail(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes("@")) return trimmed;
  return `${trimmed}@admin.local`;
}

function AuthPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !password) return;
    setLoading(true);
    const email = resolveEmail(usuario);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Usuário ou senha inválidos.");
      return;
    }
    navigate({ to: "/app" });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl border border-border/60 bg-card p-8 shadow-card"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Painel Administrativo</div>
            <div className="text-xs text-muted-foreground">Acesso restrito</div>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Usuário</Label>
            <Input
              required
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="rounded-xl"
              placeholder="admin"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Senha</Label>
            <Input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-xl" size="lg">
            <Lock className="mr-2 size-4" />
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Área privada. Todos os acessos são registrados.
        </p>
      </motion.div>
    </div>
  );
}
