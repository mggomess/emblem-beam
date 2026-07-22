import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Printer, Trash2, RefreshCw, Palette, ArrowUp, ArrowDown, ArrowDownAZ, Loader2, Upload, RotateCw, Stamp, PenLine } from "lucide-react";
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

import { defaultState, SITUACOES, type EmissaoState, type NivelEnsino, type TemplateSuperior, type DisciplinaSuperior, type UniversidadeHist, type DocOverlay, type DocOverlayKind, type DocOverlayTarget } from "@/lib/emissao/types";
import { CertificadoMedio } from "@/lib/emissao/certificado-medio";
import { UnipCertidao } from "@/lib/emissao/unip-certidao";
import { DiplomaUnip } from "@/lib/emissao/diploma-unip";
import { EstacioCertidaoRetrato, EstacioDiplomaPaisagem } from "@/lib/emissao/estacio-templates";
import { HistoricoMedio } from "@/lib/emissao/historico-medio";
import { HistoricoSuperior, HISTORICO_UNIP_LINHAS_POR_FOLHA } from "@/lib/emissao/historico-superior";
import { EstacioHistoricoSuperior, HISTORICO_ESTACIO_LINHAS_POR_FOLHA } from "@/lib/emissao/estacio-historico";
import { OverlayLayer } from "@/lib/emissao/overlays";
import { useMatrices, fetchDisciplinesForMatrix, calcularChCumprida } from "@/lib/emissao/use-curriculum";

export const Route = createFileRoute("/_authenticated/app/emissao")({
  head: () => ({ meta: [{ title: "Emissão ao vivo — Certifica" }] }),
  component: EmissaoLivePage,
});

function EmissaoLivePage() {
  const [s, setS] = useState<EmissaoState>(defaultState);
  const patch = (p: Partial<EmissaoState>) => setS((prev) => ({ ...prev, ...p }));

  const gerarCodigo = () => {
    // UUID v4 é o identificador público usado no QRCode e na página /verificar/{uuid}.
    const uuid =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}-4xxx-yxxx-xxxxxxxxxxxx`.replace(
            /[xy]/g,
            (c) => {
              const r = (Math.random() * 16) | 0;
              return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
            },
          );
    patch({ codigoUnico: uuid });
    toast.success(`Código gerado: ${uuid.slice(0, 8)}…`);
    return uuid;
  };

  const persistirHistorico = async (uuid: string) => {
    try {
      const { saveHistorico } = await import("@/lib/historicos.functions");
      await saveHistorico({
        data: {
          verification_uuid: uuid,
          nivel: s.nivel,
          universidade: s.nivel === "superior" ? (s.templateSuperior.startsWith("unip") ? "UNIP" : "ESTACIO") : null,
          nome_aluno: s.nomeAluno || "—",
          cpf: s.cpf || null,
          curso: s.nivel === "superior" ? s.cursoSuperior : null,
          instituicao: s.nomeColegio || null,
          data_conclusao: s.anoConclusao || null,
          carga_horaria: s.chExigida || null,
          numero_registro: s.matricula || s.raCode || null,
          data_nascimento: s.dataNasc || null,
          ano_conclusao: s.anoConclusao || null,
          estado: s.estadoNasc || null,
          cidade: s.cidadeEmissao || s.cidadeNasc || null,
          endereco: s.enderecoPolo || null,
          nivel_label: s.nivel === "medio" ? "Ensino Médio" : "Ensino Superior",
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível registrar o histórico para verificação pública.");
    }
  };


  const salvarEEmitir = async () => {
    const uuid = s.codigoUnico || gerarCodigo();
    await persistirHistorico(uuid);
    toast.success("Histórico registrado. QR pronto para verificação pública.");
  };

  const imprimir = async () => {
    const uuid = s.codigoUnico || gerarCodigo();
    await persistirHistorico(uuid);
    setTimeout(() => window.print(), 200);
  };



  // Par institucional trancado: certificado + histórico da mesma bandeira
  const { CertComponent, HistComponent } = useMemo(() => {
    if (s.nivel === "medio") {
      return { CertComponent: CertificadoMedio, HistComponent: HistoricoMedio };
    }
    switch (s.templateSuperior) {
      case "unip-certidao":
        return { CertComponent: UnipCertidao, HistComponent: HistoricoSuperior };
      case "unip-diploma":
        return { CertComponent: DiplomaUnip, HistComponent: HistoricoSuperior };
      case "estacio-certidao":
        return { CertComponent: EstacioCertidaoRetrato, HistComponent: EstacioHistoricoSuperior };
      case "estacio-diploma":
        return { CertComponent: EstacioDiplomaPaisagem, HistComponent: EstacioHistoricoSuperior };
    }
  }, [s.nivel, s.templateSuperior]);

  const isEstacio = s.templateSuperior.startsWith("estacio");
  const isUnipCertidao = s.templateSuperior === "unip-certidao";

  // Paginação do histórico superior — quebra em folhas conforme o layout.
  const linhasPorFolha = s.nivel === "superior"
    ? (isEstacio ? HISTORICO_ESTACIO_LINHAS_POR_FOLHA : HISTORICO_UNIP_LINHAS_POR_FOLHA)
    : 0;
  const totalFolhasHist = s.nivel === "superior"
    ? Math.max(1, Math.ceil((s.disciplinasSuperior.length || 0) / linhasPorFolha) || 1)
    : 1;

  // Manipulação da tabela de disciplinas (superior).
  const updateDisc = (i: number, patchRow: Partial<DisciplinaSuperior>) => {
    const arr = [...s.disciplinasSuperior];
    arr[i] = { ...arr[i], ...patchRow };
    patch({ disciplinasSuperior: arr });
  };
  const addDisc = () => patch({
    disciplinasSuperior: [
      ...s.disciplinasSuperior,
      { periodo: "", codigo: "", descricao: "", ch: "", perLetivo: "", media: "", frequencia: "", situacao: "AP" },
    ],
  });
  const removeDisc = (i: number) =>
    patch({ disciplinasSuperior: s.disciplinasSuperior.filter((_, j) => j !== i) });
  const moveDisc = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= s.disciplinasSuperior.length) return;
    const arr = [...s.disciplinasSuperior];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    patch({ disciplinasSuperior: arr });
  };
  const sortByPeriodo = () => {
    const arr = [...s.disciplinasSuperior].sort((a, b) => {
      const pa = parseInt(a.periodo, 10);
      const pb = parseInt(b.periodo, 10);
      if (isNaN(pa) && isNaN(pb)) return a.periodo.localeCompare(b.periodo);
      if (isNaN(pa)) return 1;
      if (isNaN(pb)) return -1;
      return pa - pb;
    });
    patch({ disciplinasSuperior: arr });
  };

  // Sincroniza universidadeHist com o template escolhido.
  useEffect(() => {
    const uni: UniversidadeHist = s.templateSuperior.startsWith("estacio") ? "ESTACIO" : "UNIP";
    if (uni !== s.universidadeHist) patch({ universidadeHist: uni, matrixId: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.templateSuperior]);

  const { matrices, loading: loadingMatrices } = useMatrices(s.universidadeHist);
  const [loadingDisc, setLoadingDisc] = useState(false);

  const carregarMatriz = async (matrixId: string) => {
    const matrix = matrices.find((m) => m.id === matrixId);
    if (!matrix) return;
    setLoadingDisc(true);
    const disciplinas = await fetchDisciplinesForMatrix(matrixId);
    setLoadingDisc(false);
    patch({
      matrixId,
      matrixVersao: matrix.versao,
      cursoSuperior: matrix.curso,
      chExigida: String(matrix.carga_horaria || ""),
      disciplinasSuperior: disciplinas,
    });
    toast.success(`Matriz carregada: ${disciplinas.length} disciplinas`);
  };

  const chCumprida = useMemo(
    () => calcularChCumprida(s.disciplinasSuperior),
    [s.disciplinasSuperior],
  );

  // Overlays (assinaturas / carimbos)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingKind, setPendingKind] = useState<DocOverlayKind>("assinatura");
  const addOverlayFile = (file: File, kind: DocOverlayKind) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || "");
      if (!src) return;
      const overlay: DocOverlay = {
        id: crypto.randomUUID(),
        src,
        kind,
        target: "both",
        label: file.name,
        x: 120,
        y: 900,
        widthMm: kind === "carimbo" ? 45 : 60,
        rotation: 0,
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
    <AppLayout title="Emissão ao vivo">
      <div className="no-print">
        <PageHeader
          title="Emissão ao vivo"
          description="Formulário à esquerda, preview em tempo real à direita. Arraste o carimbo MEC para posicioná-lo."
          action={
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setS(defaultState)}>
                <RefreshCw className="mr-1 size-4" /> Reset
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={gerarCodigo}>
                <Plus className="mr-1 size-4" /> Gerar código
              </Button>
              <Button className="rounded-xl" onClick={salvarEEmitir}>
                Salvar e Emitir
              </Button>
              <Button variant="secondary" className="rounded-xl" onClick={imprimir}>
                <Printer className="mr-1 size-4" /> Imprimir / Salvar PDF
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid gap-4 screen-only lg:grid-cols-[minmax(0,420px)_1fr]">
        <Card className="no-print border-border/60 p-4 shadow-soft lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Tabs defaultValue="doc">
            <TabsList className="grid w-full grid-cols-5 rounded-xl">
              <TabsTrigger value="doc" className="rounded-lg text-xs">Doc</TabsTrigger>
              <TabsTrigger value="aluno" className="rounded-lg text-xs">Aluno</TabsTrigger>
              <TabsTrigger value="hist" className="rounded-lg text-xs">Hist.</TabsTrigger>
              <TabsTrigger value="selos" className="rounded-lg text-xs">Selos</TabsTrigger>
              <TabsTrigger value="qr" className="rounded-lg text-xs">QR</TabsTrigger>
            </TabsList>

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
                  <Label>Template Superior (par Certificado + Histórico trancado)</Label>
                  <Select
                    value={s.templateSuperior}
                    onValueChange={(v: TemplateSuperior) => patch({ templateSuperior: v })}
                  >
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unip-certidao">UNIP — Certidão (Retrato)</SelectItem>
                      <SelectItem value="unip-diploma">UNIP — Diploma (Paisagem, 2 folhas)</SelectItem>
                      <SelectItem value="estacio-certidao">Estácio — Certidão (Retrato)</SelectItem>
                      <SelectItem value="estacio-diploma">Estácio — Diploma (Paisagem)</SelectItem>
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
                  <F label="Nome da Secretária Escolar" val={s.nomeSecretaria} on={(v) => patch({ nomeSecretaria: v })} />
                  <F label="RG da Secretária" val={s.rgSecretaria} on={(v) => patch({ rgSecretaria: v })} />
                </>
              )}

              {s.nivel === "superior" && (
                <>
                  <F label="Curso Superior / Habilitação" val={s.cursoSuperior} on={(v) => patch({ cursoSuperior: v })} />
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
                  <div className="grid grid-cols-2 gap-2">
                    <F label="Código e-MEC" val={s.codigoEmec} on={(v) => patch({ codigoEmec: v })} />
                    <F label="Reconhecimento (Portaria)" val={s.reconhecimentoPortaria} on={(v) => patch({ reconhecimentoPortaria: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <F label="Publicação DOU" val={s.publicacaoDou} on={(v) => patch({ publicacaoDou: v })} />
                    <F label="Forma de ingresso" val={s.formaIngresso} on={(v) => patch({ formaIngresso: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <F label="Disciplinas do vestibular" val={s.disciplinasVestibular} on={(v) => patch({ disciplinasVestibular: v })} />
                    <F label="Mês/Ano do vestibular" val={s.mesAnoVestibular} on={(v) => patch({ mesAnoVestibular: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <F label="C.H. Exigida" val={s.chExigida} on={(v) => patch({ chExigida: v })} />
                    <div>
                      <Label className="text-xs">C.H. Cumprida (auto)</Label>
                      <Input readOnly className="rounded-xl bg-muted/40" value={`${chCumprida} h`} />
                    </div>
                  </div>
                  <F label="Reitor(a)" val={s.reitor} on={(v) => patch({ reitor: v })} />
                  <F label="Secretário(a) Geral" val={s.secretarioGeral} on={(v) => patch({ secretarioGeral: v })} />
                  <F label="Endereço do polo (rodapé)" val={s.enderecoPolo} on={(v) => patch({ enderecoPolo: v })} />

                  {isUnipCertidao && (
                    <F label="Assinatura digital (rodapé)" val={s.assinaturaDigital} on={(v) => patch({ assinaturaDigital: v })} />
                  )}

                  {s.templateSuperior === "unip-diploma" && (
                    <>
                      <F label="Mantenedora" val={s.mantenedora} on={(v) => patch({ mantenedora: v })} />
                      <F label="CNPJ" val={s.cnpj} on={(v) => patch({ cnpj: v })} />
                      <div className="grid grid-cols-2 gap-2">
                        <F label="RA" val={s.raCode} on={(v) => patch({ raCode: v })} />
                        <F label="Lote" val={s.lote} on={(v) => patch({ lote: v })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <F label="Livro" val={s.livro} on={(v) => patch({ livro: v })} />
                        <F label="Folha" val={s.folhaLivro} on={(v) => patch({ folhaLivro: v })} />
                      </div>
                      <F label="Secretário(a) Geral Adjunto(a)" val={s.secretarioAdjunto} on={(v) => patch({ secretarioAdjunto: v })} />
                    </>
                  )}

                  {isEstacio && (
                    <div>
                      <Label>Corpo do texto (opcional — sobrescreve o padrão)</Label>
                      <Textarea
                        rows={5}
                        className="rounded-xl"
                        value={s.corpoTextoSuperior}
                        onChange={(e) => patch({ corpoTextoSuperior: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}
            </TabsContent>

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
              <F label="Certificado Militar" val={s.certificadoMilitar} on={(v) => patch({ certificadoMilitar: v })} />
              <div className="grid grid-cols-3 gap-2">
                <F label="Título de Eleitor" val={s.tituloEleitor} on={(v) => patch({ tituloEleitor: v })} />
                <F label="Zona" val={s.zonaEleitoral} on={(v) => patch({ zonaEleitoral: v })} />
                <F label="Seção" val={s.secaoEleitoral} on={(v) => patch({ secaoEleitoral: v })} />
              </div>
            </TabsContent>

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
                  <div className="rounded-lg border p-3 space-y-2 bg-muted/20">
                    <Label className="text-xs font-semibold">Matriz Curricular</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[10px]">Universidade</Label>
                        <Select
                          value={s.universidadeHist}
                          onValueChange={(v: UniversidadeHist) => patch({
                            universidadeHist: v,
                            matrixId: "",
                            templateSuperior: v === "ESTACIO" ? "estacio-certidao" : "unip-certidao",
                          })}
                        >
                          <SelectTrigger className="rounded-lg h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UNIP">UNIP</SelectItem>
                            <SelectItem value="ESTACIO">ESTÁCIO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[10px]">Curso</Label>
                        <Select
                          value={s.matrixId}
                          onValueChange={(v) => carregarMatriz(v)}
                          disabled={loadingMatrices || matrices.length === 0}
                        >
                          <SelectTrigger className="rounded-lg h-8 text-xs">
                            <SelectValue placeholder={loadingMatrices ? "Carregando…" : "Selecionar…"} />
                          </SelectTrigger>
                          <SelectContent>
                            {matrices.map((m) => (
                              <SelectItem key={m.id} value={m.id} className="text-xs">{m.curso}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>C.H. cumprida: <strong className="text-foreground">{chCumprida}h</strong> / {s.chExigida || "?"}h</span>
                      {loadingDisc && <Loader2 className="size-3 animate-spin" />}
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-1.5"><Palette className="size-3.5" /> Cor temática (só UNIP genérico)</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={s.corTemaHistorico}
                        onChange={(e) => patch({ corTemaHistorico: e.target.value })}
                        className="h-9 w-16 cursor-pointer rounded-lg border" />
                      <Input className="rounded-xl" value={s.corTemaHistorico} onChange={(e) => patch({ corTemaHistorico: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-sm">
                        Disciplinas ({s.disciplinasSuperior.length})
                        {s.disciplinasSuperior.length > linhasPorFolha && (
                          <span className="ml-1 text-[10px] text-muted-foreground">
                            — {totalFolhasHist} folha(s), {linhasPorFolha}/folha
                          </span>
                        )}
                      </Label>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs"
                          onClick={sortByPeriodo}
                          title="Ordenar por período">
                          <ArrowDownAZ className="size-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs"
                          onClick={addDisc}>
                          <Plus className="size-3" /> Disciplina
                        </Button>
                      </div>
                    </div>

                    {s.disciplinasSuperior.length === 0 && (
                      <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
                        Selecione uma matriz curricular acima, ou clique em "Disciplina" para adicionar manualmente.
                      </div>
                    )}


                    {s.disciplinasSuperior.map((d, i) => (
                      <div key={i} className="rounded-lg border p-2 space-y-1.5 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium text-muted-foreground">#{i + 1}</span>
                          <div className="flex gap-0.5">
                            <Button size="icon" variant="ghost" className="h-6 w-6"
                              disabled={i === 0}
                              onClick={() => moveDisc(i, -1)} title="Mover para cima">
                              <ArrowUp className="size-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6"
                              disabled={i === s.disciplinasSuperior.length - 1}
                              onClick={() => moveDisc(i, 1)} title="Mover para baixo">
                              <ArrowDown className="size-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive"
                              onClick={() => removeDisc(i)} title="Excluir">
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-[70px_1fr] gap-1">
                          <Input placeholder="Período" className="rounded text-xs h-8" value={d.periodo}
                            onChange={(e) => updateDisc(i, { periodo: e.target.value })} />
                          <Input placeholder="Código" className="rounded text-xs h-8" value={d.codigo}
                            readOnly={d.fromMatrix}
                            onChange={(e) => updateDisc(i, { codigo: e.target.value })} />
                        </div>

                        <Input placeholder="Nome da disciplina" className="rounded text-xs h-8" value={d.descricao}
                          readOnly={d.fromMatrix}
                          onChange={(e) => updateDisc(i, { descricao: e.target.value })} />

                        <div className="grid grid-cols-2 gap-1">
                          <Input placeholder="C.H." className="rounded text-xs h-8" value={d.ch}
                            readOnly={d.fromMatrix}
                            onChange={(e) => updateDisc(i, { ch: e.target.value })} />
                          <Input placeholder="Ano/Semestre" className="rounded text-xs h-8" value={d.perLetivo}
                            onChange={(e) => updateDisc(i, { perLetivo: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-1">
                          <Input placeholder="Nota" className="rounded text-xs h-8" value={d.media}
                            onChange={(e) => updateDisc(i, { media: e.target.value })} />
                          <Input placeholder="Frequência %" className="rounded text-xs h-8" value={d.frequencia ?? ""}
                            onChange={(e) => updateDisc(i, { frequencia: e.target.value })} />
                        </div>

                        <Select value={d.situacao || "AP"}
                          onValueChange={(v) => updateDisc(i, { situacao: v })}>
                          <SelectTrigger className="rounded text-xs h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {SITUACOES.map((o) => (
                              <SelectItem key={o.value} value={o.value} className="text-xs">
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

            <TabsContent value="selos" className="mt-4 space-y-3">
              <div className="rounded-lg border p-3 space-y-2 bg-muted/20">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Stamp className="size-3.5" /> Assinaturas & Carimbos
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Envie PNG (fundo transparente recomendado). Arraste no preview para posicionar sobre o certificado e/ou histórico.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-lg flex-1"
                    onClick={() => { setPendingKind("assinatura"); fileInputRef.current?.click(); }}
                  >
                    <PenLine className="size-3.5 mr-1" /> Assinatura
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-lg flex-1"
                    onClick={() => { setPendingKind("carimbo"); fileInputRef.current?.click(); }}
                  >
                    <Stamp className="size-3.5 mr-1" /> Carimbo
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) addOverlayFile(f, pendingKind);
                    e.target.value = "";
                  }}
                />
              </div>

              {s.overlays.length === 0 && (
                <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
                  Nenhum selo adicionado. Envie uma assinatura ou carimbo para começar.
                </div>
              )}

              {s.overlays.map((o) => (
                <div key={o.id} className="rounded-lg border p-2 space-y-2 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <img
                      src={o.src}
                      alt=""
                      className="h-10 w-10 rounded border object-contain bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{o.label}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">
                        {o.kind === "carimbo" ? "Carimbo" : "Assinatura"} · {o.rotation}°
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"
                      onClick={() => removeOverlay(o.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px]">Aplicar em</Label>
                      <Select
                        value={o.target}
                        onValueChange={(v: DocOverlayTarget) => updateOverlay(o.id, { target: v })}
                      >
                        <SelectTrigger className="rounded-lg h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="both" className="text-xs">Ambos</SelectItem>
                          <SelectItem value="cert" className="text-xs">Certificado</SelectItem>
                          <SelectItem value="hist" className="text-xs">Histórico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[10px]">Largura (mm)</Label>
                      <Input
                        type="number"
                        min={10}
                        max={200}
                        className="rounded-lg h-8 text-xs"
                        value={o.widthMm}
                        onChange={(e) => updateOverlay(o.id, { widthMm: Number(e.target.value) || 40 })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs flex-1"
                      onClick={() => updateOverlay(o.id, { rotation: (o.rotation + 15) % 360 })}>
                      <RotateCw className="size-3 mr-1" /> +15°
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs"
                      onClick={() => updateOverlay(o.id, { rotation: 0 })}>
                      Reset
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="qr" className="mt-4 space-y-3">
              <F label="URL base do Portal SEDU" val={s.sedUrlBase} on={(v) => patch({ sedUrlBase: v })} />
              <div>
                <Label>Código único de rastreamento</Label>
                <div className="flex gap-2">
                  <Input className="rounded-xl font-mono" value={s.codigoUnico} onChange={(e) => patch({ codigoUnico: e.target.value })} placeholder="—" />
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
                  <p className="text-[11px] text-muted-foreground">Arraste no preview; clique para girar.</p>
                </div>
                <Switch checked={s.mec.enabled} onCheckedChange={(v) => patch({ mec: { ...s.mec, enabled: v } })} />
              </div>
              {s.mec.enabled && (
                <div className="space-y-2">
                  <div className="text-[11px] text-muted-foreground">
                    Posição: X={Math.round(s.mec.x)}px Y={Math.round(s.mec.y)}px — Rotação: {s.mec.rotation || 0}°
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => patch({ mec: { ...s.mec, rotation: ((s.mec.rotation || 0) + 15) % 360 } })}>
                      Girar +15°
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => patch({ mec: { ...s.mec, rotation: 0 } })}>
                      Reset rotação
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        <div className="min-w-0">
          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            Folha 1 — Certificado
          </div>
          <div className="overflow-auto">
            <div className="origin-top-left" style={{ transform: "scale(0.62)", width: "fit-content" }}>
              <CertComponent state={s} onMecChange={(m) => patch({ mec: m })} draggableMec />
            </div>
          </div>

          {Array.from({ length: totalFolhasHist }, (_, i) => (
            <div key={`hist-preview-${i}`}>
              <div className="mt-6 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Folha {i + 2} — Histórico Escolar {totalFolhasHist > 1 ? `(${i + 1}/${totalFolhasHist})` : ""}
              </div>
              <div className="overflow-auto">
                <div className="origin-top-left" style={{ transform: "scale(0.62)", width: "fit-content" }}>
                  <HistComponent state={s} page={i} totalPages={totalFolhasHist} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Somente para impressão */}
      <div className="print-root">
        <CertComponent state={s} onMecChange={() => {}} draggableMec={false} />
        {Array.from({ length: totalFolhasHist }, (_, i) => (
          <HistComponent key={`hist-print-${i}`} state={s} page={i} totalPages={totalFolhasHist} />
        ))}
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
