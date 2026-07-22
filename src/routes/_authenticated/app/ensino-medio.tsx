import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Printer, RefreshCw, Stamp, PenLine, RotateCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UFSelect } from "@/components/common/UFSelect";
import { defaultState, type EmissaoState, type DocOverlay, type DocOverlayKind, type DocOverlayTarget } from "@/lib/emissao/types";
import { CertificadoMedio } from "@/lib/emissao/certificado-medio";
import { HistoricoMedio } from "@/lib/emissao/historico-medio";
import { OverlayLayer } from "@/lib/emissao/overlays";

export const Route = createFileRoute("/_authenticated/app/ensino-medio")({
  head: () => ({ meta: [{ title: "Ensino Médio — Certificado + Histórico" }] }),
  component: EnsinoMedioPage,
});

function EnsinoMedioPage() {
  const [s, setS] = useState<EmissaoState>({ ...defaultState, nivel: "medio" });
  const patch = (p: Partial<EmissaoState>) => setS((prev) => ({ ...prev, ...p }));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingKind, setPendingKind] = useState<DocOverlayKind>("assinatura");
  const addOverlayFile = (file: File, kind: DocOverlayKind) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || "");
      if (!src) return;
      const overlay: DocOverlay = {
        id: crypto.randomUUID(),
        src, kind, target: "both", label: file.name,
        x: 120, y: 900, widthMm: kind === "carimbo" ? 45 : 60, rotation: 0,
      };
      patch({ overlays: [...s.overlays, overlay] });
      toast.success(`${kind === "carimbo" ? "Carimbo" : "Assinatura"} adicionado`);
    };
    reader.readAsDataURL(file);
  };
  const updateOverlay = (id: string, p: Partial<DocOverlay>) =>
    patch({ overlays: s.overlays.map((o) => (o.id === id ? { ...o, ...p } : o)) });
  const removeOverlay = (id: string) =>
    patch({ overlays: s.overlays.filter((o) => o.id !== id) });

  return (
    <AppLayout title="Ensino Médio">
      <div className="no-print">
        <PageHeader
          title="Ensino Médio — Certificado + Histórico"
          description="Modelo offline (fora do modo live): preencha os dados e imprima o certificado e o histórico juntos."
          action={
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setS({ ...defaultState, nivel: "medio" })}>
                <RefreshCw className="mr-1 size-4" /> Reset
              </Button>
              <Button variant="secondary" className="rounded-xl" onClick={() => window.print()}>
                <Printer className="mr-1 size-4" /> Imprimir / PDF
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid gap-4 screen-only lg:grid-cols-[minmax(0,420px)_1fr]">
        <Card className="no-print border-border/60 p-4 shadow-soft lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Tabs defaultValue="inst">
            <TabsList className="grid w-full grid-cols-4 rounded-xl">
              <TabsTrigger value="inst" className="text-xs">Inst.</TabsTrigger>
              <TabsTrigger value="aluno" className="text-xs">Aluno</TabsTrigger>
              <TabsTrigger value="hist" className="text-xs">Hist.</TabsTrigger>
              <TabsTrigger value="selos" className="text-xs">Selos</TabsTrigger>
            </TabsList>

            <TabsContent value="inst" className="mt-4 space-y-3">
              <F label="Nome do colégio" v={s.nomeColegio} on={(v) => patch({ nomeColegio: v })} />
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">UF</Label><UFSelect value={s.uf} onChange={(v) => patch({ uf: v })} /></div>
                <F label="Cidade de emissão" v={s.cidadeEmissao} on={(v) => patch({ cidadeEmissao: v })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <F label="Data de emissão" v={s.dataEmissao} on={(v) => patch({ dataEmissao: v })} />
                <F label="Ano de conclusão" v={s.anoConclusao} on={(v) => patch({ anoConclusao: v })} />
              </div>
              <F label="Secretária Escolar" v={s.nomeSecretaria} on={(v) => patch({ nomeSecretaria: v })} />
              <F label="RG da Secretária" v={s.rgSecretaria} on={(v) => patch({ rgSecretaria: v })} />
            </TabsContent>

            <TabsContent value="aluno" className="mt-4 space-y-3">
              <F label="Nome completo" v={s.nomeAluno} on={(v) => patch({ nomeAluno: v })} />
              <div className="grid grid-cols-2 gap-2">
                <F label="CPF" v={s.cpf} on={(v) => patch({ cpf: v })} />
                <F label="RG" v={s.rg} on={(v) => patch({ rg: v })} />
              </div>
              <F label="Matrícula" v={s.matricula} on={(v) => patch({ matricula: v })} />
              <F label="Nacionalidade" v={s.nacionalidade} on={(v) => patch({ nacionalidade: v })} />
              <div className="grid grid-cols-2 gap-2">
                <F label="Cidade nasc." v={s.cidadeNasc} on={(v) => patch({ cidadeNasc: v })} />
                <F label="Estado nasc." v={s.estadoNasc} on={(v) => patch({ estadoNasc: v })} />
              </div>
              <F label="Data de nascimento" v={s.dataNasc} on={(v) => patch({ dataNasc: v })} />
            </TabsContent>

            <TabsContent value="hist" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <F label="C.H. Anual" v={s.cargaHorariaAnual} on={(v) => patch({ cargaHorariaAnual: v })} />
                <F label="Dias letivos" v={s.diasLetivos} on={(v) => patch({ diasLetivos: v })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <F label="% Faltas" v={s.faltasPct} on={(v) => patch({ faltasPct: v })} />
                <F label="Resultado final" v={s.resultadoFinal} on={(v) => patch({ resultadoFinal: v })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Notas por disciplina (1ª / 2ª / 3ª)</Label>
                {s.disciplinasBNCC.map((d, i) => (
                  <div key={i} className="grid grid-cols-[1fr_50px_50px_50px] gap-1">
                    <Input className="rounded-lg text-xs" value={d.nome}
                      onChange={(e) => {
                        const arr = [...s.disciplinasBNCC]; arr[i] = { ...d, nome: e.target.value }; patch({ disciplinasBNCC: arr });
                      }} />
                    {(["s1", "s2", "s3"] as const).map((k) => (
                      <Input key={k} className="rounded-lg text-center text-xs" value={d[k]}
                        onChange={(e) => {
                          const arr = [...s.disciplinasBNCC]; arr[i] = { ...d, [k]: e.target.value }; patch({ disciplinasBNCC: arr });
                        }} />
                    ))}
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-xs">Observações</Label>
                <Textarea rows={3} className="rounded-xl" value={s.observacoesHistorico}
                  onChange={(e) => patch({ observacoesHistorico: e.target.value })} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="min-w-0">
          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Folha 1 — Certificado</div>
          <div className="overflow-auto">
            <div className="origin-top-left" style={{ transform: "scale(0.62)", width: "fit-content" }}>
              <CertificadoMedio state={s} onMecChange={() => {}} draggableMec={false} />
            </div>
          </div>
          <div className="mt-6 mb-2 text-xs uppercase tracking-wider text-muted-foreground">Folha 2 — Histórico Escolar</div>
          <div className="overflow-auto">
            <div className="origin-top-left" style={{ transform: "scale(0.62)", width: "fit-content" }}>
              <HistoricoMedio state={s} />
            </div>
          </div>
        </div>
      </div>

      <div className="print-root">
        <CertificadoMedio state={s} onMecChange={() => {}} draggableMec={false} />
        <HistoricoMedio state={s} />
      </div>
    </AppLayout>
  );
}

function F({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="rounded-xl" value={v} onChange={(e) => on(e.target.value)} />
    </div>
  );
}
