export type NivelEnsino = "medio" | "superior";
export type TemplateSuperior = "estacio" | "unip";

export type MecStamp = {
  enabled: boolean;
  x: number; // px offset within sheet
  y: number;
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
  // ==== Nível ====
  nivel: NivelEnsino;
  templateSuperior: TemplateSuperior;

  // ==== Aluno ====
  nomeAluno: string;
  nacionalidade: string;
  cidadeNasc: string;
  estadoNasc: string;
  dataNasc: string;
  cpf: string;
  rg: string;
  matricula: string;

  // ==== Instituição ====
  nomeColegio: string;
  uf: string;
  cidadeEmissao: string;
  dataEmissao: string;
  anoConclusao: string;
  logoUrl: string;

  // ==== Rodapé médio ====
  nomeSecretaria: string;
  rgSecretaria: string;

  // ==== Superior ====
  cursoSuperior: string;
  titulo: string;
  dataColacao: string;
  periodoInicio: string;
  periodoFim: string;
  portariaMec: string;
  resolucao: string;
  reitor: string;
  secretarioGeral: string;
  corpoTextoSuperior: string; // Estácio: editável livre

  // ==== MEC ====
  mec: MecStamp;

  // ==== QR / SEDU ====
  sedUrlBase: string;
  codigoUnico: string;

  // ==== Histórico ====
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
  templateSuperior: "estacio",
  nomeAluno: "MARIA DA SILVA SANTOS",
  nacionalidade: "brasileira",
  cidadeNasc: "São Paulo",
  estadoNasc: "SP",
  dataNasc: "15 de março de 2005",
  cpf: "000.000.000-00",
  rg: "00.000.000-0",
  matricula: "2026001",
  nomeColegio: "E.E.E.F.M. PROFESSOR JOÃO DA SILVA",
  uf: "SP",
  cidadeEmissao: "São Paulo",
  dataEmissao: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
  anoConclusao: String(new Date().getFullYear()),
  logoUrl: "",
  nomeSecretaria: "FLORÊNCIA MARIA ALVES",
  rgSecretaria: "41.114.200",
  cursoSuperior: "ADMINISTRAÇÃO",
  titulo: "BACHAREL",
  dataColacao: "21/12/2025",
  periodoInicio: "Janeiro de 2022",
  periodoFim: "Dezembro de 2025",
  portariaMec: "913, de 28/12/2018",
  resolucao: "1, de 15 de maio de 2006",
  reitor: "PROF. DR. JOÃO CARLOS DIAS DI GENIO",
  secretarioGeral: "PROFA. MARIA LÚCIA SANTOS",
  corpoTextoSuperior:
    "Certificamos que MARIA DA SILVA SANTOS, portador(a) do CPF nº 000.000.000-00, concluiu com aproveitamento o curso de Bacharelado em ADMINISTRAÇÃO, com carga horária total de 3.000 (três mil) horas, nesta Universidade, satisfazendo integralmente as exigências curriculares e legais.",
  mec: { enabled: true, x: 60, y: 460 },
  sedUrlBase: "https://validar.sedu.gov.br",
  codigoUnico: "",
  disciplinasBNCC: [
    { nome: "Língua Portuguesa", s1: "8.0", s2: "8.5", s3: "9.0" },
    { nome: "Matemática", s1: "7.5", s2: "8.0", s3: "8.5" },
    { nome: "História", s1: "8.5", s2: "8.0", s3: "9.0" },
    { nome: "Geografia", s1: "8.0", s2: "7.5", s3: "8.5" },
    { nome: "Química", s1: "7.0", s2: "8.0", s3: "8.0" },
    { nome: "Física", s1: "7.5", s2: "7.5", s3: "8.0" },
    { nome: "Biologia", s1: "8.5", s2: "9.0", s3: "9.0" },
    { nome: "Filosofia", s1: "9.0", s2: "9.0", s3: "9.5" },
    { nome: "Sociologia", s1: "9.0", s2: "8.5", s3: "9.0" },
    { nome: "Artes", s1: "9.5", s2: "9.5", s3: "9.5" },
    { nome: "Ed. Física", s1: "9.0", s2: "9.5", s3: "9.5" },
    { nome: "Inglês", s1: "8.0", s2: "8.5", s3: "9.0" },
  ],
  cargaHorariaAnual: "1.000h",
  diasLetivos: "200",
  faltasPct: "3%",
  resultadoFinal: "APROVADO",
  disciplinasSuperior: [
    { periodo: "1º", codigo: "ADM101", descricao: "Introdução à Administração", ch: "80", perLetivo: "2022/1", media: "8.5", situacao: "AP" },
    { periodo: "1º", codigo: "MAT101", descricao: "Matemática Aplicada", ch: "80", perLetivo: "2022/1", media: "8.0", situacao: "AP" },
    { periodo: "2º", codigo: "ADM201", descricao: "Teoria Geral da Administração", ch: "80", perLetivo: "2022/2", media: "9.0", situacao: "AP" },
    { periodo: "3º", codigo: "CTB301", descricao: "Contabilidade Geral", ch: "80", perLetivo: "2023/1", media: "8.2", situacao: "AP" },
  ],
  observacoesHistorico: "Aluno(a) com aproveitamento integral e frequência regular em todos os períodos letivos.",
  legendaNotas: "AP - Aprovado | DS - Dispensado | RF - Reprovado por Falta | RM - Reprovado por Média",
  corTemaHistorico: "#1D3557",
};
