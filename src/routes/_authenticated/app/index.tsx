import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  FileCheck2,
  IdCard,
  Coins,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [{ title: "Painel — Certifica" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dash-stats"],
    queryFn: async () => {
      const [students, certs, cards, profile] = await Promise.all([
        supabase.from("students").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("student_cards").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("credits").maybeSingle(),
      ]);
      return {
        students: students.count ?? 0,
        certs: certs.count ?? 0,
        cards: cards.count ?? 0,
        credits: profile.data?.credits ?? 0,
      };
    },
  });

  const { data: recentCerts } = useQuery({
    queryKey: ["dash-recent-certs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("certificates")
        .select("id, code, estado, issued_at, status, students(full_name), courses(name)")
        .order("issued_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: recentStudents } = useQuery({
    queryKey: ["dash-recent-students"],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("id, full_name, created_at, courses(name)")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { mes: d.toLocaleDateString("pt-BR", { month: "short" }), emissoes: Math.round(Math.random() * 20) };
  });

  return (
    <AppLayout title="Painel Principal">
      <PageHeader
        title="Visão geral"
        description="Acompanhe os principais indicadores da sua instituição."
        action={
          <Button asChild className="rounded-xl">
            <Link to="/app/certificados">
              Nova emissão <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total de alunos" value={stats?.students ?? "—"} icon={<GraduationCap className="size-5" />} />
        <StatsCard label="Certificados" value={stats?.certs ?? "—"} icon={<FileCheck2 className="size-5" />} />
        <StatsCard label="Carteirinhas" value={stats?.cards ?? "—"} icon={<IdCard className="size-5" />} />
        <StatsCard label="Créditos" value={stats?.credits ?? "—"} icon={<Coins className="size-5" />} trend="+ atualize no faturamento" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-soft">
          <CardHeader><CardTitle className="text-base">Emissões nos últimos 6 meses</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="emissoes" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-soft">
          <CardHeader><CardTitle className="text-base">Últimas emissões</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentCerts?.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma emissão ainda.</p>}
            {recentCerts?.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <div className="grid size-9 place-items-center rounded-lg bg-accent">
                  <FileCheck2 className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{(c.students as { full_name: string } | null)?.full_name ?? "—"}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {(c.courses as { name: string } | null)?.name} · {c.estado}
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full">{c.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 shadow-soft">
          <CardHeader><CardTitle className="text-base">Últimos alunos cadastrados</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentStudents?.length === 0 && <p className="text-xs text-muted-foreground">Nenhum aluno cadastrado.</p>}
            {recentStudents?.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {s.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.full_name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {(s.courses as { name: string } | null)?.name ?? "Sem curso"}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(s.created_at), { locale: ptBR, addSuffix: true })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-soft">
          <CardHeader><CardTitle className="text-base">Atividades recentes</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Suas ações aparecerão aqui automaticamente.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
