import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, CreditCard, Landmark, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/faturamento")({
  head: () => ({ meta: [{ title: "Faturamento — Certifica" }] }),
  component: Page,
});

function Page() {
  const { data: profile } = useQuery({
    queryKey: ["profile-billing"],
    queryFn: async () => (await supabase.from("profiles").select("credits").maybeSingle()).data,
  });
  return (
    <AppLayout title="Faturamento">
      <PageHeader title="Faturamento" description="Gerencie créditos e formas de pagamento." />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatsCard label="Saldo atual" value={`${profile?.credits ?? 0} créditos`} icon={<Coins className="size-5" />} />
        <StatsCard label="Consumo mês" value="—" icon={<Landmark className="size-5" />} />
        <StatsCard label="Próxima recarga" value="Manual" icon={<CreditCard className="size-5" />} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: QrCode, label: "PIX", desc: "Instantâneo" },
          { icon: CreditCard, label: "Cartão de crédito", desc: "Visa · Master" },
          { icon: Landmark, label: "Boleto", desc: "3 dias úteis" },
        ].map((m) => (
          <Card key={m.label} className="border-border/60 shadow-soft">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><m.icon className="size-5 text-primary" /> {m.label}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
              <Button className="mt-4 w-full rounded-xl" disabled>Recarregar (em breve)</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
