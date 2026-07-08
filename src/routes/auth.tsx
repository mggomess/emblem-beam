import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Certifica" },
      { name: "description", content: "Acesse sua conta para gerenciar alunos, cursos e certificados." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/app" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Verifique seu email.");
  };

  const handleGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (res.error) toast.error(res.error.message);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 shadow-card"
      >
        <div className="mb-6 flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Certifica</div>
            <div className="text-xs text-muted-foreground">Bem-vindo de volta</div>
          </div>
        </div>

        <Tabs defaultValue="in">
          <TabsList className="grid w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="in" className="rounded-lg">Entrar</TabsTrigger>
            <TabsTrigger value="up" className="rounded-lg">Criar conta</TabsTrigger>
          </TabsList>

          <TabsContent value="in">
            <form onSubmit={handleSignIn} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Senha</Label>
                <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-xl" size="lg">
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="up">
            <form onSubmit={handleSignUp} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Nome completo</Label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Senha</Label>
                <Input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-xl" size="lg">
                Criar conta
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" onClick={handleGoogle} className="w-full rounded-xl" size="lg">
          Continuar com Google
        </Button>
      </motion.div>
    </div>
  );
}
