import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatsCard } from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IdCard, Plus, Coins, CalendarClock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/carteirinhas")({
  head: () => ({ meta: [{ title: "Carteirinhas — Certifica" }] }),
  component: Page,
});

function Page() {
  const { data: cards = [] } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => (await supabase.from("student_cards").select("*")).data ?? [],
  });
  return (
    <AppLayout title="Carteirinhas">
      <PageHeader
        title="Carteirinhas"
        description="Emita carteirinhas digitais dos seus alunos."
        action={<Button className="rounded-xl" disabled><Plus className="mr-1 size-4" /> Nova Carteirinha</Button>}
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatsCard label="Total emitidas" value={cards.length} icon={<IdCard className="size-5" />} />
        <StatsCard label="Crédito por emissão" value="1" icon={<Coins className="size-5" />} />
        <StatsCard label="Validade padrão" value="12 meses" icon={<CalendarClock className="size-5" />} />
      </div>
      <Card className="border-border/60 p-6 shadow-soft">
        <EmptyState
          title="Módulo em preparação"
          description="A emissão de carteirinhas será disponibilizada na próxima atualização. A estrutura de dados já está pronta."
          icon={<IdCard className="size-5" />}
        />
      </Card>
    </AppLayout>
  );
}
