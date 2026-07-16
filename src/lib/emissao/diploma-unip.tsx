import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (v: string, fb = "—") =>
  v && v.trim() ? v : <span className="text-neutral-400">{fb}</span>;

/** UNIP — Diploma Tradicional (A4 paisagem). Duas folhas: frente + verso. */
export function DiplomaUnip({ state, onMecChange, draggableMec = true }: Props) {
  return (
    <>
      {/* ============ FOLHA 1 — FRENTE ============ */}
      <div
        className="doc-sheet a4-portrait font-serif-doc relative overflow-hidden bg-white"
        style={{
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Imagem completa utilizada como fundo da primeira folha */}
        <img
          src="/images/fundo-unip.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
          style={{ objectFit: "fill" }}
        />

        {/* Conteúdo principal dentro da área superior da imagem */}
        <div
          className="absolute z-10 text-center text-black"
          style={{
            left: "9%",
            right: "9%",
            top: "7.2%",
            fontFamily: '"Cinzel", "Times New Roman", serif',
          }}
        >
          <div
            className="text-[38px] leading-none text-black"
            style={{ fontFamily: '"UnifrakturMaguntia", cursive' }}
          >
            Universidade Paulista
          </div>

          <p className="mt-7 text-[11px] leading-[1.65]">
            O Magnífico Reitor da Universidade Paulista, no uso de suas atribuições,
            confere a
          </p>

          <div
            className="my-4 text-[27px] leading-none text-black"
            style={{ fontFamily: '"UnifrakturMaguntia", cursive' }}
          >
            {ph(state.nomeAluno)}
          </div>

          <p className="text-[11px] leading-[1.8]">
            portador(a) do CPF nº {ph(state.cpf)}, matrícula {ph(state.matricula)},
            havendo concluído o Curso Superior de
          </p>

          <div
            className="mt-3 text-[21px] leading-none text-black"
            style={{ fontFamily: '"UnifrakturMaguntia", cursive' }}
          >
            {ph(state.titulo)} em {ph(state.cursoSuperior)}
          </div>

          <p className="mt-4 text-[10px] leading-[1.65]">
            brasileiro(a), natural de {ph(state.cidadeNasc)} - {ph(state.estadoNasc)},
            nascido(a) em {ph(state.dataNasc)}, portador(a) do RG nº {ph(state.rg)}
            e CPF nº {ph(state.cpf)}.
          </p>

          <p className="mt-3 text-[10px] leading-[1.65]">
            E outorga-lhe o presente Diploma, a fim de que possa gozar de todos os
            direitos e prerrogativas legais.
          </p>

          <p className="mt-3 text-[9.5px] leading-[1.55]">
            Colação de grau em {ph(state.dataColacao)}, período letivo de{" "}
            {ph(state.periodoInicio)} a {ph(state.periodoFim)}. Portaria MEC nº{" "}
            {ph(state.portariaMec)}, Resolução CNE/CP nº {ph(state.resolucao)}.
          </p>

          <p className="mt-4 text-[10px]">
            {ph(state.cidadeEmissao)} - {ph(state.uf)}, {ph(state.dataEmissao)}.
          </p>
        </div>

        {/* Identificação inferior esquerda, alinhada às linhas existentes na imagem */}
        <div
          className="absolute z-10 text-[8.5px] leading-tight text-black"
          style={{
            left: "5.3%",
            fontFamily: '"Times New Roman", serif',
            top: "62.2%",
            width: "43.5%",
          }}
        >
          <div className="flex h-[52px] items-end px-2 pb-1">
            <span className="font-semibold uppercase">
              {state.reitor || "SANDRA REJANE GOMES MIESSA"}
            </span>
          </div>
          <div className="flex h-[52px] items-end px-2 pb-1">
            <span>{ph(state.secretarioGeral)}</span>
          </div>
          <div className="flex h-[52px] items-end px-2 pb-1">
            <span>RA: {ph(state.raCode || state.matricula)}</span>
          </div>
          <div className="flex h-[52px] items-end px-2 pb-1">
            <span>RG: {ph(state.rg)} | CPF: {ph(state.cpf)}</span>
          </div>
          <div className="flex h-[52px] items-end px-2 pb-1">
            <span>Código: {ph(state.codigoUnico)}</span>
          </div>
        </div>

        {/* Área de registro inferior direita */}
        <div
          className="absolute z-10 flex items-center justify-center p-5 text-center text-[8.5px] leading-relaxed text-black"
          style={{
            right: "5.3%",
            fontFamily: '"Times New Roman", serif',
            top: "61.4%",
            width: "39.1%",
            height: "27.5%",
          }}
        >
          <div>
            <p className="font-bold uppercase">Registro do diploma</p>
            <p className="mt-3">
              Registrado sob as condições constantes no verso, nos termos da legislação
              vigente e do Regimento Geral desta Universidade.
            </p>
            <p className="mt-3">
              Livro {ph(state.livro)}, folha {ph(state.folhaLivro)}, lote {ph(state.lote)}.
            </p>
            <p className="mt-3 break-all font-semibold">
              {ph(state.codigoUnico)}
            </p>
          </div>
        </div>

        <MecStampBlock
          mec={state.mec}
          onChange={onMecChange}
          draggable={draggableMec}
        />
      </div>

      {/* ============ FOLHA 2 — VERSO ============ */}
      <div className="doc-sheet a4-landscape font-serif-doc relative bg-white" style={{ pageBreakBefore: "always", breakBefore: "page" }}>
        <div className="grid h-full grid-cols-2 gap-8 p-6">
          {/* Coluna esquerda — Mantenedora */}
          <div className="text-[11px] leading-relaxed">
            <div className="border-b-2 border-[#5a3e0a] pb-1 text-[13px] font-bold uppercase text-[#5a3e0a]">
              Mantenedora
            </div>
            <div className="mt-2 space-y-1">
              <div><b>Razão Social:</b> {state.mantenedora}</div>
              <div><b>CNPJ:</b> {state.cnpj}</div>
              <div><b>Recredenciamento:</b> Portaria MEC nº {ph(state.portariaMec)}</div>
              <div><b>Resolução CNE/CP:</b> {ph(state.resolucao)}</div>
              <div><b>Endereço:</b> {state.enderecoPolo}</div>
            </div>

            <div className="mt-6 border-b-2 border-[#5a3e0a] pb-1 text-[13px] font-bold uppercase text-[#5a3e0a]">
              Dados do Diplomado
            </div>
            <div className="mt-2 space-y-1">
              <div><b>Nome:</b> {ph(state.nomeAluno)}</div>
              <div><b>CPF:</b> {ph(state.cpf)} &nbsp; <b>RG:</b> {ph(state.rg)}</div>
              <div><b>Naturalidade:</b> {ph(state.cidadeNasc)} - {ph(state.estadoNasc)}</div>
              <div><b>Nascimento:</b> {ph(state.dataNasc)} &nbsp; <b>Nacionalidade:</b> {ph(state.nacionalidade)}</div>
              <div><b>Curso:</b> {ph(state.cursoSuperior)} &nbsp; <b>Título:</b> {ph(state.titulo)}</div>
              <div><b>Colação de grau:</b> {ph(state.dataColacao)}</div>
            </div>

            {/* Carimbo circular simulado */}
            <div className="mt-10 flex items-end gap-4">
              <div className="flex size-28 items-center justify-center rounded-full border-4 border-[#5a3e0a] text-center">
                <div className="text-[9px] font-bold uppercase leading-tight text-[#5a3e0a]">
                  Universidade
                  <br />Paulista
                  <br />— UNIP —
                </div>
              </div>
              <div className="text-[10px] text-neutral-700">Carimbo institucional</div>
            </div>
          </div>

          {/* Coluna direita — Secretaria Geral */}
          <div className="rounded-md border-2 border-[#5a3e0a] p-3 text-[11px]">
            <div className="text-center text-[13px] font-bold uppercase text-[#5a3e0a]">
              Secretaria Geral
              <div className="text-[10px] font-normal">Departamento de Registro de Diplomas</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Box label="RA" value={state.raCode} />
              <Box label="LOTE" value={state.lote} />
              <Box label="LIVRO" value={state.livro} />
              <Box label="FOLHA" value={state.folhaLivro} />
            </div>

            <div className="mt-6 space-y-1 text-[10px] leading-relaxed">
              <p>
                Registrado sob as condições acima nos termos da legislação vigente e do
                Regimento Geral desta Universidade.
              </p>
              <p>
                {ph(state.cidadeEmissao)} - {ph(state.uf)}, {ph(state.dataEmissao)}.
              </p>
            </div>

            <div className="mt-12 text-center">
              <div className="mx-auto border-t border-black" />
              <div className="mt-1 text-[10px] font-bold uppercase">{ph(state.secretarioAdjunto)}</div>
              <div className="text-[9px] uppercase tracking-wider text-neutral-700">
                Secretário(a) Geral Adjunto(a)
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#5a3e0a] p-2">
      <div className="text-[8.5px] font-bold uppercase text-[#5a3e0a]">{label}</div>
      <div className="mt-0.5 text-[11px] font-semibold">{value || "—"}</div>
    </div>
  );
}
