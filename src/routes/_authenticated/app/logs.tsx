import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/logs")({
  head: () => ({ meta: [{ title: "Logs — Certifica" }] }),
  component: Page,
});

function Page() {
  const { data: logs = [] } = useQuery({
    queryKey: ["logs"],
    queryFn: async () =>
      (await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [],
  });

  return (
    <AppLayout title="Logs de Atividade">
      <PageHeader title="Logs de Atividade" description="Rastreabilidade das ações no sistema." />
      <Card className="border-border/60 shadow-soft">
        {logs.length === 0 ? (
          <div className="p-6"><EmptyState title="Nenhum log ainda" icon={<ScrollText className="size-5" />} /></div>
        ) : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Data/Hora</TableHead><TableHead>Ação</TableHead><TableHead>Descrição</TableHead><TableHead>IP</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs">{new Date(l.created_at).toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="font-medium">{l.action}</TableCell>
                  <TableCell>{l.description}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.ip ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </AppLayout>
  );
}
