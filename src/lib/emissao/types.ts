export type NivelEnsino = "medio" | "superior";
export type TemplateSuperior =
  | "unip-certidao"
  | "unip-diploma"
  | "estacio-certidao"
  | "estacio-diploma";

export type MecStamp = {
  enabled: boolean;
  x: number;
  y: number;
  rotation: number;
};

export type DisciplinaBNCC = {
  nome: string;
  s1: string;
  s2: string;
  s3: string;
};

export type SituacaoDisciplina =
  | "AP" | "RM" | "RF" | "DP" | "DS" | "AE" | "EX" | "AC" | "NC";

export const SITUACOES: { value: SituacaoDisciplina; label: string }[] = [
  { value: "AP", label: "AP — Aprovado" },
  { value: "RM", label: "RM — Reprovado por Média" },
  { value: "RF", label: "RF — Reprovado por Falta" },
  { value: "DP", label: "DP — Dependência" },
  { value: "DS", label: "DS — Dispensado" },
  { value: "AE", label: "AE — Aproveitamento de Estudos" },
  { value: "EX", label: "EX — Extracurricular" },
  { value: "AC", label: "AC — Aguardando Complementação" },
  { value: "NC", label: "NC — Não Cursada" },
];

export type DisciplinaSuperior = {
  periodo: string;
  codigo: string;
  descricao: string;
  ch: string;
  perLetivo: string;
  /** Média/Nota final exibida na coluna "MÉDIA" do histórico. */
  media: string;
  /** Frequência em % — armazenada para relatórios internos. */
  frequencia?: string;
  situacao: string;
  /** Marca disciplinas vindas da matriz curricular (metadados travados). */
  fromMatrix?: boolean;
};

export type UniversidadeHist = "UNIP" | "ESTACIO";

export type EmissaoState = {
  nivel: NivelEnsino;
  templateSuperior: TemplateSuperior;

  // Aluno
  nomeAluno: string;
  nacionalidade: string;
  cidadeNasc: string;
  estadoNasc: string;
  dataNasc: string;
  cpf: string;
  rg: string;
  matricula: string;

  // Instituição
  nomeColegio: string;
  uf: string;
  cidadeEmissao: string;
  dataEmissao: string;
  anoConclusao: string;
  logoUrl: string;

  // Rodapé médio
  nomeSecretaria: string;
  rgSecretaria: string;

  // Superior
  cursoSuperior: string;
  titulo: string;
  dataColacao: string;
  periodoInicio: string;
  periodoFim: string;
  portariaMec: string;
  resolucao: string;
  reitor: string;
  secretarioGeral: string;
  corpoTextoSuperior: string;

  // UNIP / Estácio extras
  enderecoPolo: string;
  assinaturaDigital: string;
  mantenedora: string;
  cnpj: string;
  raCode: string;
  lote: string;
  livro: string;
  folhaLivro: string;
  secretarioAdjunto: string;

  mec: MecStamp;

  sedUrlBase: string;
  codigoUnico: string;

  // Histórico
  disciplinasBNCC: DisciplinaBNCC[];
  cargaHorariaAnual: string;
  diasLetivos: string;
  faltasPct: string;
  resultadoFinal: string;
  disciplinasSuperior: DisciplinaSuperior[];
  observacoesHistorico: string;
  legendaNotas: string;
  corTemaHistorico: string;

  // Novos — histórico universitário completo
  universidadeHist: UniversidadeHist;
  matrixId: string;
  matrixVersao: string;
  codigoEmec: string;
  reconhecimentoPortaria: string;
  publicacaoDou: string;
  formaIngresso: string;
  disciplinasVestibular: string;
  mesAnoVestibular: string;
  chExigida: string;
  certificadoMilitar: string;
  tituloEleitor: string;
  zonaEleitoral: string;
  secaoEleitoral: string;
};

export const defaultState: EmissaoState = {
  nivel: "medio",
  templateSuperior: "unip-certidao",
  nomeAluno: "",
  nacionalidade: "brasileira",
  cidadeNasc: "",
  estadoNasc: "",
  dataNasc: "",
  cpf: "",
  rg: "",
  matricula: "",
  nomeColegio: "",
  uf: "SP",
  cidadeEmissao: "",
  dataEmissao: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
  anoConclusao: String(new Date().getFullYear()),
  logoUrl: "",
  nomeSecretaria: "",
  rgSecretaria: "",
  cursoSuperior: "",
  titulo: "BACHAREL",
  dataColacao: "",
  periodoInicio: "",
  periodoFim: "",
  portariaMec: "",
  resolucao: "",
  reitor: "",
  secretarioGeral: "",
  corpoTextoSuperior: "",
  enderecoPolo:
    "RUA EXEMPLO, 000 — BAIRRO — CIDADE/UF — CEP 00000-000",
  assinaturaDigital:
    "ASSUPERO ENSINO SUPERIOR LTDA: 06059229000101",
  mantenedora: "ASSUPERO ENSINO SUPERIOR LTDA",
  cnpj: "06.059.229/0001-01",
  raCode: "",
  lote: "",
  livro: "",
  folhaLivro: "",
  secretarioAdjunto: "",
  mec: { enabled: true, x: 60, y: 460, rotation: 0 },
  sedUrlBase: "https://validar.sedu.gov.br",
  codigoUnico: "",
  disciplinasBNCC: [
    { nome: "Língua Portuguesa", s1: "", s2: "", s3: "" },
    { nome: "Matemática", s1: "", s2: "", s3: "" },
    { nome: "História", s1: "", s2: "", s3: "" },
    { nome: "Geografia", s1: "", s2: "", s3: "" },
    { nome: "Química", s1: "", s2: "", s3: "" },
    { nome: "Física", s1: "", s2: "", s3: "" },
    { nome: "Biologia", s1: "", s2: "", s3: "" },
    { nome: "Filosofia", s1: "", s2: "", s3: "" },
    { nome: "Sociologia", s1: "", s2: "", s3: "" },
    { nome: "Artes", s1: "", s2: "", s3: "" },
    { nome: "Ed. Física", s1: "", s2: "", s3: "" },
    { nome: "Inglês", s1: "", s2: "", s3: "" },
  ],
  cargaHorariaAnual: "1.000h",
  diasLetivos: "200",
  faltasPct: "",
  resultadoFinal: "APROVADO",
  disciplinasSuperior: [],
  observacoesHistorico: "",
  legendaNotas: "AP - Aprovado | DS - Dispensado | RF - Reprovado por Falta | RM - Reprovado por Média",
  corTemaHistorico: "#1D3557",
};
