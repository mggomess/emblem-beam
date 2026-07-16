import type { ReactNode } from "react";
import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (value?: string | null, fallback = "—"): ReactNode =>
  value?.trim() ? value : <span className="text-neutral-400">{fallback}</span>;

const gothicFont = '"UnifrakturMaguntia", "Old English Text MT", serif';
const bodyFont = '"Times New Roman", Times, serif';

/** UNIP, Diploma Tradicional em duas folhas: frente e verso. */
export function DiplomaUnip({
  state,
  onMecChange,
  draggableMec = true,
}: Props) {
  const naturalidade = [state.cidadeNasc, state.estadoNasc]
    .filter((item) => item?.trim())
    .join(" - ");

  return (
    <>
      {/* ============ FOLHA 1, FRENTE ============ */}
      <div
        className="doc-sheet a4-landscape relative overflow-hidden bg-white"
        style={{
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          fontFamily: bodyFont,
        }}
      >
        {/* A imagem contém somente a moldura, o brasão e a logomarca. */}
        <img
          src="/images/fundo-unip.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
          style={{ objectFit: "fill" }}
        />

        {/* Título, posicionado entre o brasão e a logomarca. */}
        <div
          className="absolute z-10 whitespace-nowrap text-center text-black"
          style={{
            top: "8.4%",
            left: "21%",
            right: "21%",
            fontFamily: gothicFont,
            fontSize: "38px",
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          Universidade Paulista
        </div>

        {/* Corpo principal, seguindo a distribuição do modelo de referência. */}
        <div
          className="absolute z-10 text-center text-black"
          style={{
            top: "22.5%",
            left: "20.5%",
            right: "20.5%",
            fontFamily: bodyFont,
            fontSize: "10.5px",
            lineHeight: 1.42,
          }}
        >
          <p className="m-0">
            A Reitora da Universidade Paulista, no uso de suas atribuições
          </p>

          <p className="m-0 mt-[3px]">
            e tendo em vista a conclusão do Curso Superior de {ph(state.cursoSuperior)},
          </p>

          <p className="m-0 mt-[3px]">
            na data de {ph(state.dataColacao)}, e a Colação de Grau na data de{" "}
            {ph(state.dataColacao)}, confere o título de
          </p>

          <div
            className="mt-[9px] text-black"
            style={{
              fontFamily: gothicFont,
              fontSize: "22px",
              lineHeight: 1.05,
            }}
          >
            {ph(state.titulo)} em {ph(state.cursoSuperior)} a
          </div>

          <div
            className="mt-[8px] text-black"
            style={{
              fontFamily: gothicFont,
              fontSize: "27px",
              lineHeight: 1.05,
            }}
          >
            {ph(state.nomeAluno)}
          </div>

          <p className="m-0 mt-[11px]">
            {ph(state.nacionalidade, "brasileiro(a)")}, natural de{" "}
            {naturalidade || "—"}, nascido(a) em {ph(state.dataNasc)},
          </p>

          <p className="m-0 mt-[2px]">
            RG nº {ph(state.rg)} e CPF nº {ph(state.cpf)},
          </p>

          <p className="m-0 mt-[10px]">e outorga-lhe o presente Diploma,</p>

          <p className="m-0 mt-[2px]">
            a fim de que possa gozar de todos os direitos e prerrogativas legais.
          </p>

          <p className="m-0 mt-[11px]">
            {ph(state.cidadeEmissao, "São Paulo")}, {ph(state.dataEmissao)}.
          </p>
        </div>

        {/* Assinatura central, conforme o modelo. */}
        <div
          className="absolute z-10 text-center text-black"
          style={{
            left: "35.5%",
            width: "29%",
            top: "69.5%",
            fontFamily: bodyFont,
          }}
        >
          <div
            className="mx-auto h-[24px] w-[78%] border-b border-black"
            aria-hidden="true"
          />
          <div className="mt-[4px] text-[8.5px] font-bold uppercase leading-none">
            {state.reitor || "SANDRA REJANE GOMES MIESSA"}
          </div>
          <div className="mt-[2px] text-[8px] leading-none">Reitora</div>
        </div>

        {/* Informações de validação, no canto inferior direito da área interna. */}
        <div
          className="absolute z-10 text-left text-black"
          style={{
            right: "10.5%",
            bottom: "11.2%",
            width: "21%",
            fontFamily: bodyFont,
            fontSize: "7px",
            lineHeight: 1.15,
          }}
        >
          <div>Documento digital</div>
          <div className="mt-[2px] break-all">Código de validação:</div>
          <div className="break-all font-bold">{ph(state.codigoUnico)}</div>
        </div>

        {/* Mantém a integração existente, sem sobrepor o modelo da frente. */}
        <div className="hidden" aria-hidden="true">
          <MecStampBlock
            mec={state.mec}
            onChange={onMecChange}
            draggable={draggableMec}
          />
        </div>
      </div>

      {/* ============ FOLHA 2, VERSO ============ */}
      <div
        className="doc-sheet a4-landscape font-serif-doc relative bg-white"
        style={{ pageBreakBefore: "always", breakBefore: "page" }}
      >
        <div className="grid h-full grid-cols-2 gap-8 p-6">
          {/* Coluna esquerda, mantenedora. */}
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

            <div className="mt-10 flex items-end gap-4">
              <div className="flex size-28 items-center justify-center rounded-full border-4 border-[#5a3e0a] text-center">
                <div className="text-[9px] font-bold uppercase leading-tight text-[#5a3e0a]">
                  Universidade
                  <br />Paulista
                  <br />UNIP
                </div>
              </div>
              <div className="text-[10px] text-neutral-700">Carimbo institucional</div>
            </div>
          </div>

          {/* Coluna direita, Secretaria Geral. */}
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
