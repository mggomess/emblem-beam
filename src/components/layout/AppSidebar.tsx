import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  UserCog,
  FileCheck2,
  IdCard,
  Users,
  ScrollText,
  CreditCard,
  Settings,
  LogOut,
  LifeBuoy,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Item = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAV: { section: string; items: Item[] }[] = [
  { section: "Principal", items: [{ to: "/app", label: "Painel Principal", icon: LayoutDashboard }] },
  {
    section: "Acadêmico",
    items: [
      { to: "/app/alunos", label: "Alunos", icon: GraduationCap },
      { to: "/app/cursos", label: "Cursos", icon: BookOpen },
      { to: "/app/docentes", label: "Docentes", icon: UserCog },
    ],
  },
  {
    section: "Documentação",
    items: [
      { to: "/app/certificados", label: "Emissão", icon: FileCheck2 },
      { to: "/app/carteirinhas", label: "Carteirinhas", icon: IdCard },
    ],
  },
  {
    section: "Sistema",
    items: [
      { to: "/app/usuarios", label: "Usuários", icon: Users },
      { to: "/app/logs", label: "Logs de Atividade", icon: ScrollText },
      { to: "/app/faturamento", label: "Faturamento", icon: CreditCard },
      { to: "/app/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const initials = (profile?.full_name || user?.email || "?")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
          <Sparkles className="size-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-sidebar-foreground">Certifica</div>
          <div className="text-[11px] text-muted-foreground">Gestão Acadêmica</div>
        </div>
      </div>
      <Separator />
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV.map((sec) => (
          <div key={sec.section}>
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {sec.section}
            </div>
            <ul className="space-y-1">
              {sec.items.map((it) => {
                const active =
                  pathname === it.to || (it.to !== "/app" && pathname.startsWith(it.to));
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <it.icon className="size-4 shrink-0" />
                      <span className="truncate">{it.label}</span>
                      {active && (
                        <motion.div
                          layoutId="active-dot"
                          className="ml-auto size-1.5 rounded-full bg-primary"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <Separator />
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 rounded-xl bg-accent/60 p-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium">
              {profile?.full_name || user?.email}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {profile?.credits ?? 0} créditos
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <Button variant="ghost" size="icon" onClick={toggle} title="Tema" className="rounded-lg">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" title="Suporte" className="rounded-lg" asChild>
            <a href="mailto:suporte@certifica.app"><LifeBuoy className="size-4" /></a>
          </Button>
          <Button variant="ghost" size="icon" title="Perfil" className="rounded-lg" asChild>
            <Link to="/app/configuracoes"><UserCog className="size-4" /></Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Sair"
            className="rounded-lg text-destructive"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/auth";
            }}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
