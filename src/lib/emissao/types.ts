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

export type DisciplinaSuperior = {
  periodo: string;
  codigo: string;
  descricao: string;
  ch: string;
  perLetivo: string;
  media: string;
  situacao: string;
};

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
