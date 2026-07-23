import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, User, Eye, EyeOff, Loader2 } from "lucide-react";
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

function resolveEmail(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes("@")) return trimmed;
  return `${trimmed}@admin.local`;
}

function AuthPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/app" });
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !password) return;
    setLoading(true);
    const email = resolveEmail(usuario);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      setLoading(false);
      toast.error("Usuário ou senha inválidos.");
      return;
    }
    // Only navigate after confirmed session — no bypass possible.
    navigate({ to: "/app" });
  };

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950">
        <Loader2 className="size-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* subtle inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-40" />

          <div className="relative">
            <div className="mb-8 flex items-center gap-3">
              <div className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
                <ShieldCheck className="size-6 text-white" />
                <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-fuchsia-500/40 blur-md" />
              </div>
              <div>
                <div className="text-base font-semibold tracking-tight">
                  Painel Administrativo
                </div>
                <div className="text-xs text-slate-400">
                  Acesso restrito · Certifica
                </div>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-400">
                  Usuário
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    required
                    autoComplete="username"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="admin"
                    className="h-11 rounded-xl border-white/10 bg-white/5 pl-10 text-slate-100 placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-400">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    required
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl border-white/10 bg-white/5 pl-10 pr-10 text-slate-100 placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-500/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    tabIndex={-1}
                    aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="group relative h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-fuchsia-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 size-4" />
                    Entrar no painel
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <p className="text-[11px] leading-tight text-slate-400">
                Área privada. Todos os acessos são registrados e monitorados.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} Certifica · Sistema interno
        </p>
      </motion.div>
    </div>
  );
}
