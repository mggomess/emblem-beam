import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, CircleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ufNome } from "@/lib/uf";
import { verifyHistorico } from "@/lib/historicos.functions";

export const Route = createFileRoute("/verificar/$code")({
  head: () => ({
    meta: [
      { title: "Verificação de Documento — Certifica" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Verificar,
});

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

function Verificar() {
  const { code } = Route.useParams();

  // Histórico: apenas UUIDs válidos são consultados no servidor.
  const historico = useQuery({
    queryKey: ["verify-historico", code],
    enabled: isUuid(code),
    queryFn: async () => verifyHistorico({ data: { uuid: code } }),
  });

  // Certificado legado (código não-UUID).
  const certificado = useQuery({
    queryKey: ["verify-cert", code],
    enabled: !isUuid(code),
    queryFn: async () =>
      (
        await supabase
          .from("certificates")
          .select("code, estado, issued_at, status, students(full_name), courses(name, workload)")
          .eq("code", code)
          .maybeSingle()
      ).data,
  });

  const isLoading = historico.isLoading || certificado.isLoading;
  const historicoFound = historico.data?.found ? historico.data : null;
  const certificadoFound = certificado.data ?? null;

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <Card className="w-full max-w-lg border-border/60 shadow-card">
        <CardContent className="p-8 text-center">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Verificando...</p>
          ) : historicoFound ? (
            <>
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/10 text-success">
                <ShieldCheck className="size-7" />
              </div>
              <h1 className="mt-4 text-lg font-semibold">Certificado autêntico</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                UUID: <span className="font-mono">{historicoFound.verification_uuid.slice(0, 8)}…</span>
              </p>
              <div className="mt-6 space-y-1 text-left text-sm">
                <Row label="Nome" value={historicoFound.nome_aluno} />
                <Row label="CPF" value={historicoFound.cpf ?? "—"} />
                <Row label="Curso" value={historicoFound.curso ?? "—"} />
                <Row label="Instituição" value={historicoFound.instituicao ?? "—"} />
                <Row label="Data de conclusão" value={historicoFound.data_conclusao ?? "—"} />
                <Row label="Carga horária" value={historicoFound.carga_horaria ?? "—"} />
                <Row label="Nº de registro" value={historicoFound.numero_registro ?? "—"} />
                <Row label="Emissão" value={new Date(historicoFound.issued_at).toLocaleDateString("pt-BR")} />
              </div>
            </>
          ) : certificadoFound ? (
            <>
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/10 text-success">
                <ShieldCheck className="size-7" />
              </div>
              <h1 className="mt-4 text-lg font-semibold">Certificado válido</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Código: <span className="font-mono">{certificadoFound.code}</span>
              </p>
              <div className="mt-6 space-y-1 text-left text-sm">
                <Row label="Aluno" value={(certificadoFound.students as { full_name: string } | null)?.full_name ?? "—"} />
                <Row label="Curso" value={(certificadoFound.courses as { name: string } | null)?.name ?? "—"} />
                <Row label="Carga horária" value={`${(certificadoFound.courses as { workload: number } | null)?.workload ?? "—"}h`} />
                <Row label="Estado" value={`${ufNome(certificadoFound.estado)} (${certificadoFound.estado})`} />
                <Row label="Emissão" value={new Date(certificadoFound.issued_at).toLocaleDateString("pt-BR")} />
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <CircleAlert className="size-7" />
              </div>
              <h1 className="mt-4 text-lg font-semibold">Certificado não localizado</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                O código informado não consta em nossa base de dados.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
