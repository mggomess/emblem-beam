import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Printer, Trash2, RefreshCw, Palette } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UFSelect } from "@/components/common/UFSelect";
import { toast } from "sonner";

import { defaultState, type EmissaoState, type NivelEnsino, type TemplateSuperior, type DisciplinaSuperior } from "@/lib/emissao/types";
import { CertificadoMedio } from "@/lib/emissao/certificado-medio";
import { CertificadoEstacio } from "@/lib/emissao/certificado-estacio";
import { DiplomaUnip } from "@/lib/emissao/diploma-unip";
import { HistoricoMedio } from "@/lib/emissao/historico-medio";
import { HistoricoSuperior } from "@/lib/emissao/historico-superior";

export const Route = createFileRoute("/_authenticated/app/emissao")({
  head: () => ({ meta: [{ title: "Emissão ao vivo — Certifica" }] }),
  component: EmissaoLivePage,
});

function EmissaoLivePage() {
  const [s, setS] = useState<EmissaoState>(defaultState);
  const patch = (p: Partial<EmissaoState>) => setS((prev) => ({ ...prev, ...p }));

  const gerarCodigo = () => {
    const prefix = s.nivel === "medio" ? "SEDU-MED" : s.templateSuperior.toUpperCase();
    const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
    const code = `${prefix}-${Date.now().toString(36).toUpperCase()}-${rnd}`;
    patch({ codigoUnico: code });
    toast.success(`Código gerado: ${code}`);
  };

  const salvarEEmitir = () => {
    if (!s.codigoUnico) gerarCodigo();
    toast.success("Documento pronto. Use 'Imprimir / Salvar PDF' para exportar.");
  };

  const imprimir = () => {
    if (!s.codigoUnico) {
      gerarCodigo();
      setTimeout(() => window.print(), 200);
    } else {
      window.print();
    }
  };

  const CertComponent = useMemo(() => {
    if (s.nivel === "medio") return CertificadoMedio;
    if (s.templateSuperior === "unip") return DiplomaUnip;
    return CertificadoEstacio;
  }, [s.nivel, s.templateSuperior]);

  const HistComponent = s.nivel === "medio" ? HistoricoMedio : HistoricoSuperior;

  return (
    <AppLayout title="Emissão ao vivo">
      <PageHeader
        title="Emissão ao vivo"
        description="Formulário à esquerda, preview em tempo real à direita. Arraste o carimbo MEC para posicioná-lo."
        action={
          <div className="flex gap-2 no-print">
            <Button variant="outline" className="rounded-xl" onClick={() => setS(defaultState)}>
              <RefreshCw className="mr-1 size-4" /> Reset
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={gerarCodigo}>
              <Plus className="mr-1 size-4" /> Gerar código
            </Button>
            <Button className="rounded-xl" onClick={salvarEEmitir}>
              Salvar e Emitir Documento
            </Button>
            <Button variant="secondary" className="rounded-xl" onClick={imprimir}>
              <Printer className="mr-1 size-4" /> Imprimir / Salvar PDF
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 screen-only lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* ============ FORM ============ */}
        <Card className="no-print border-border/60 p-4 shadow-soft lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Tabs defaultValue="doc">
            <TabsList className="grid w-full grid-cols-4 rounded-xl">
              <TabsTrigger value="doc" className="rounded-lg">Doc</TabsTrigger>
              <TabsTrigger value="aluno" className="rounded-lg">Aluno</TabsTrigger>
              <TabsTrigger value="hist" className="rounded-lg">Histórico</TabsTrigger>
              <TabsTrigger value="qr" className="rounded-lg">QR/MEC</TabsTrigger>
            </TabsList>

            {/* DOC */}
            <TabsContent value="doc" className="mt-4 space-y-3">
              <div>
                <Label>Nível de ensino</Label>
                <Select value={s.nivel} onValueChange={(v: NivelEnsino) => patch({ nivel: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medio">Ensino Médio (SP)</SelectItem>
                    <SelectItem value="superior">Ensino Superior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {s.nivel === "superior" && (
                <div>
                  <Label>Template Superior</Label>
                  <Select
                    value={s.templateSuperior}
                    onValueChange={(v: TemplateSuperior) => patch({ templateSuperior: v })}
                  >
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estacio">Estácio — Certidão (Retrato)</SelectItem>
                      <SelectItem value="unip">UNIP — Diploma (Paisagem)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <F label="Nome do colégio / instituição" val={s.nomeColegio} on={(v) => patch({ nomeColegio: v })} />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>UF</Label>
                  <UFSelect value={s.uf} onChange={(v) => patch({ uf: v })} />
                </div>
                <F label="Cidade de emissão" val={s.cidadeEmissao} on={(v) => patch({ cidadeEmissao: v })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <F label="Data de emissão" val={s.dataEmissao} on={(v) => patch({ dataEmissao: v })} />
                <F label="Ano de conclusão" val={s.anoConclusao} on={(v) => patch({ anoConclusao: v })} />
              </div>

              {s.nivel === "medio" && (
                <>
                  <F label="Nome da Secretária" val={s.nomeSecretaria} on={(v) => patch({ nomeSecretaria: v })} />
                  <F label="RG da Secretária" val={s.rgSecretaria} on={(v) => patch({ rgSecretaria: v })} />
                </>
              )}

              {s.nivel === "superior" && (
                <>
                  <F label="Curso Superior" val={s.cursoSuperior} on={(v) => patch({ cursoSuperior: v })} />
                  <div className="grid grid-cols-2 gap-2">
                    <F label="Título" val={s.titulo} on={(v) => patch({ titulo: v })} />
                    <F label="Data colação" val={s.dataColacao} on={(v) => patch({ dataColacao: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <F label="Período início" val={s.periodoInicio} on={(v) => patch({ periodoInicio: v })} />
                    <F label="Período fim" val={s.periodoFim} on={(v) => patch({ periodoFim: v })} />
                  </div>
                  <F label="Portaria MEC" val={s.portariaMec} on={(v) => patch({ portariaMec: v })} />
                  <F label="Resolução CNE/CP" val={s.resolucao} on={(v) => patch({ resolucao: v })} />
                  <F label="Reitor" val={s.reitor} on={(v) => patch({ reitor: v })} />
                  <F label="Secretário(a) Geral" val={s.secretarioGeral} on={(v) => patch({ secretarioGeral: v })} />
                  {s.templateSuperior === "estacio" && (
                    <div>
                      <Label>Corpo do texto (Estácio, editável)</Label>
                      <Textarea
                        rows={6}
                        className="rounded-xl"
                        value={s.corpoTextoSuperior}
                        onChange={(e) => patch({ corpoTextoSuperior: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* ALUNO */}
            <TabsContent value="aluno" className="mt-4 space-y-3">
              <F label="Nome completo" val={s.nomeAluno} on={(v) => patch({ nomeAluno: v })} />
              <div className="grid grid-cols-2 gap-2">
                <F label="CPF" val={s.cpf} on={(v) => patch({ cpf: v })} />
                <F label="RG" val={s.rg} on={(v) => patch({ rg: v })} />
              </div>
              <F label="Matrícula" val={s.matricula} on={(v) => patch({ matricula: v })} />
              <F label="Nacionalidade" val={s.nacionalidade} on={(v) => patch({ nacionalidade: v })} />
              <div className="grid grid-cols-2 gap-2">
                <F label="Cidade de nasc." val={s.cidadeNasc} on={(v) => patch({ cidadeNasc: v })} />
                <F label="Estado de nasc." val={s.estadoNasc} on={(v) => patch({ estadoNasc: v })} />
              </div>
              <F label="Data de nascimento" val={s.dataNasc} on={(v) => patch({ dataNasc: v })} />
            </TabsContent>

            {/* HISTÓRICO */}
            <TabsContent value="hist" className="mt-4 space-y-3">
              {s.nivel === "medio" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <F label="C.H. Anual" val={s.cargaHorariaAnual} on={(v) => patch({ cargaHorariaAnual: v })} />
                    <F label="Dias letivos" val={s.diasLetivos} on={(v) => patch({ diasLetivos: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <F label="% Faltas" val={s.faltasPct} on={(v) => patch({ faltasPct: v })} />
                    <F label="Resultado final" val={s.resultadoFinal} on={(v) => patch({ resultadoFinal: v })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Notas por disciplina (1ª / 2ª / 3ª)</Label>
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
                </>
              ) : (
                <>
                  <div>
                    <Label className="flex items-center gap-1.5"><Palette className="size-3.5" /> Cor temática do histórico</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={s.corTemaHistorico}
                        onChange={(e) => patch({ corTemaHistorico: e.target.value })}
                        className="h-9 w-16 cursor-pointer rounded-lg border" />
                      <Input className="rounded-xl" value={s.corTemaHistorico} onChange={(e) => patch({ corTemaHistorico: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label>Disciplinas</Label>
                      <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs"
                        onClick={() => patch({ disciplinasSuperior: [...s.disciplinasSuperior, { periodo: "", codigo: "", descricao: "", ch: "", perLetivo: "", media: "", situacao: "AP" }] })}>
                        <Plus className="size-3" /> Linha
                      </Button>
                    </div>
                    {s.disciplinasSuperior.map((d, i) => (
                      <div key={i} className="rounded-lg border p-2 space-y-1">
                        <div className="grid grid-cols-4 gap-1">
                          {(["periodo", "codigo", "ch", "situacao"] as const).map((k) => (
                            <Input key={k} placeholder={k} className="rounded text-xs" value={d[k]}
                              onChange={(e) => {
                                const arr = [...s.disciplinasSuperior]; arr[i] = { ...d, [k]: e.target.value } as DisciplinaSuperior; patch({ disciplinasSuperior: arr });
                              }} />
                          ))}
                        </div>
                        <Input placeholder="descrição" className="rounded text-xs" value={d.descricao}
                          onChange={(e) => {
                            const arr = [...s.disciplinasSuperior]; arr[i] = { ...d, descricao: e.target.value }; patch({ disciplinasSuperior: arr });
                          }} />
                        <div className="grid grid-cols-[1fr_1fr_auto] gap-1">
                          <Input placeholder="per. letivo" className="rounded text-xs" value={d.perLetivo}
                            onChange={(e) => { const arr = [...s.disciplinasSuperior]; arr[i] = { ...d, perLetivo: e.target.value }; patch({ disciplinasSuperior: arr }); }} />
                          <Input placeholder="média" className="rounded text-xs" value={d.media}
                            onChange={(e) => { const arr = [...s.disciplinasSuperior]; arr[i] = { ...d, media: e.target.value }; patch({ disciplinasSuperior: arr }); }} />
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"
                            onClick={() => patch({ disciplinasSuperior: s.disciplinasSuperior.filter((_, j) => j !== i) })}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label>Observações</Label>
                    <Textarea rows={3} className="rounded-xl" value={s.observacoesHistorico}
                      onChange={(e) => patch({ observacoesHistorico: e.target.value })} />
                  </div>
                  <F label="Legenda de notas" val={s.legendaNotas} on={(v) => patch({ legendaNotas: v })} />
                </>
              )}
            </TabsContent>

            {/* QR / MEC */}
            <TabsContent value="qr" className="mt-4 space-y-3">
              <F label="URL base do Portal SEDU" val={s.sedUrlBase} on={(v) => patch({ sedUrlBase: v })} />
              <div>
                <Label>Código único de rastreamento</Label>
                <div className="flex gap-2">
                  <Input className="rounded-xl font-mono" value={s.codigoUnico} onChange={(e) => patch({ codigoUnico: e.target.value })} placeholder="ESTACIO-98483-2026" />
                  <Button variant="outline" onClick={gerarCodigo}>Gerar</Button>
                </div>
                {s.codigoUnico && (
                  <p className="mt-1 break-all text-[10px] text-muted-foreground">
                    QR aponta: {s.sedUrlBase.replace(/\/+$/, "")}/validar/{s.codigoUnico}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <Label className="text-sm">Exibir Carimbo MEC</Label>
                  <p className="text-[11px] text-muted-foreground">Arraste o carimbo no preview para posicioná-lo.</p>
                </div>
                <Switch checked={s.mec.enabled} onCheckedChange={(v) => patch({ mec: { ...s.mec, enabled: v } })} />
              </div>
              {s.mec.enabled && (
                <div className="text-[11px] text-muted-foreground">
                  Posição atual: X={Math.round(s.mec.x)}px Y={Math.round(s.mec.y)}px
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* ============ LIVE PREVIEW ============ */}
        <div className="min-w-0">
          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Folha 1 — {s.nivel === "medio" ? "Certificado" : (s.templateSuperior === "unip" ? "Diploma UNIP" : "Certidão Estácio")}</div>
          <div className="overflow-auto">
            <div className="origin-top-left" style={{ transform: "scale(0.62)", width: "fit-content" }}>
              <CertComponent state={s} onMecChange={(m) => patch({ mec: m })} draggableMec />
            </div>
          </div>

          <div className="mt-6 mb-2 text-xs uppercase tracking-wider text-muted-foreground">Folha 2 — Histórico Escolar</div>
          <div className="overflow-auto">
            <div className="origin-top-left" style={{ transform: "scale(0.62)", width: "fit-content" }}>
              <HistComponent state={s} />
            </div>
          </div>
        </div>
      </div>

      {/* ============ PRINT (não visível na tela) ============ */}
      <div className="print-root">
        <CertComponent state={s} onMecChange={() => {}} draggableMec={false} />
        <HistComponent state={s} />
      </div>
    </AppLayout>
  );
}

function F({ label, val, on }: { label: string; val: string; on: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="rounded-xl" value={val} onChange={(e) => on(e.target.value)} />
    </div>
  );
}
