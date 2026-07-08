import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, CircleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ufNome } from "@/lib/uf";

export const Route = createFileRoute("/verificar/$code")({
  head: () => ({ meta: [{ title: "Verificação de Certificado — Certifica" }, { name: "robots", content: "noindex" }] }),
  component: Verificar,
});

function Verificar() {
  const { code } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["verify", code],
    queryFn: async () =>
      (await supabase.from("certificates")
        .select("code, estado, issued_at, status, students(full_name), courses(name, workload)")
        .eq("code", code).maybeSingle()).data,
  });

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <Card className="w-full max-w-lg border-border/60 shadow-card">
        <CardContent className="p-8 text-center">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Verificando...</p>
          ) : data ? (
            <>
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/10 text-success">
                <ShieldCheck className="size-7" />
              </div>
              <h1 className="mt-4 text-lg font-semibold">Certificado válido</h1>
              <p className="mt-1 text-xs text-muted-foreground">Código: <span className="font-mono">{data.code}</span></p>
              <div className="mt-6 space-y-1 text-left text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Aluno</span><span className="font-medium">{(data.students as { full_name: string } | null)?.full_name}</span></div>
                <div className="flex justify-between border-b py-2"><span className="text-muted-foreground">Curso</span><span className="font-medium">{(data.courses as { name: string } | null)?.name}</span></div>
                <div className="flex justify-between border-b py-2"><span className="text-muted-foreground">Carga horária</span><span className="font-medium">{(data.courses as { workload: number } | null)?.workload}h</span></div>
                <div className="flex justify-between border-b py-2"><span className="text-muted-foreground">Estado</span><span className="font-medium">{ufNome(data.estado)} ({data.estado})</span></div>
                <div className="flex justify-between py-2"><span className="text-muted-foreground">Emissão</span><span className="font-medium">{new Date(data.issued_at).toLocaleDateString("pt-BR")}</span></div>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <CircleAlert className="size-7" />
              </div>
              <h1 className="mt-4 text-lg font-semibold">Certificado não encontrado</h1>
              <p className="mt-1 text-xs text-muted-foreground">O código informado é inválido ou foi cancelado.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
