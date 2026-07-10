export type University = {
  id: string;
  nome: string;
  sigla: string;
  cidadeSede: string;
  uf: string;
};

export const UNIVERSITIES: University[] = [
  { id: "unip", sigla: "UNIP", nome: "Universidade Paulista", cidadeSede: "São Paulo", uf: "SP" },
  { id: "anhanguera", sigla: "ANHANGUERA", nome: "Universidade Anhanguera", cidadeSede: "Valinhos", uf: "SP" },
  { id: "estacio", sigla: "ESTÁCIO", nome: "Universidade Estácio de Sá", cidadeSede: "Rio de Janeiro", uf: "RJ" },
  { id: "unopar", sigla: "UNOPAR", nome: "Universidade Norte do Paraná", cidadeSede: "Londrina", uf: "PR" },
  { id: "cruzeirodosul", sigla: "CRUZEIRO DO SUL", nome: "Universidade Cruzeiro do Sul", cidadeSede: "São Paulo", uf: "SP" },
  { id: "unicesumar", sigla: "UNICESUMAR", nome: "Centro Universitário de Maringá", cidadeSede: "Maringá", uf: "PR" },
  { id: "uninassau", sigla: "UNINASSAU", nome: "Centro Universitário Maurício de Nassau", cidadeSede: "Recife", uf: "PE" },
  { id: "unip2", sigla: "UNIPÊ", nome: "Centro Universitário de João Pessoa", cidadeSede: "João Pessoa", uf: "PB" },
  { id: "fmu", sigla: "FMU", nome: "Centro Universitário FMU", cidadeSede: "São Paulo", uf: "SP" },
  { id: "uniritter", sigla: "UNIRITTER", nome: "Centro Universitário Ritter dos Reis", cidadeSede: "Porto Alegre", uf: "RS" },
  { id: "uninove", sigla: "UNINOVE", nome: "Universidade Nove de Julho", cidadeSede: "São Paulo", uf: "SP" },
  { id: "unifavip", sigla: "UNIFAVIP", nome: "Centro Universitário UniFavip Wyden", cidadeSede: "Caruaru", uf: "PE" },
  { id: "pitagoras", sigla: "PITÁGORAS", nome: "Faculdade Pitágoras", cidadeSede: "Belo Horizonte", uf: "MG" },
  { id: "ulbra", sigla: "ULBRA", nome: "Universidade Luterana do Brasil", cidadeSede: "Canoas", uf: "RS" },
  { id: "unicsul", sigla: "UNICSUL", nome: "Universidade Cidade de São Paulo", cidadeSede: "São Paulo", uf: "SP" },
];

export function findUniversity(id: string) {
  return UNIVERSITIES.find((u) => u.id === id);
}
