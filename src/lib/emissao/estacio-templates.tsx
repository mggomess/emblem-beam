import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (v: string, fb = "—") =>
  v && v.trim() ? v : <span className="text-neutral-400">{fb}</span>;

/** Logo Estácio — losango azul-marinho estilizado. */
function EstacioLogo({ className = "h-14 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 70" className={className}>
      <g>
        <rect x="4" y="10" width="40" height="40" transform="rotate(45 24 30)" fill="#002B49" />
        <rect x="14" y="20" width="20" height="20" transform="rotate(45 24 30)" fill="#fff" />
      </g>
      <text x="60" y="34" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="900" fill="#002B49" letterSpacing="1">
        Estácio
      </text>
      <text x="60" y="50" fontFamily="Arial, sans-serif" fontSize="9" fill="#002B49" letterSpacing="3">
        UNIVERSIDADE
      </text>
    </svg>
  );
}

/** Estácio — Certidão de Conclusão (A4 retrato). Fundo branco puro. */
export function EstacioCertidaoRetrato({ state, onMecChange, draggableMec = true }: Props) {
  return (
    <div className="doc-sheet a4-portrait font-sans-doc relative bg-white">
      {/* Cabeçalho azul-marinho */}
      <div className="relative z-10 flex items-center justify-between border-b-4 border-[#002B49] pb-4">
        <EstacioLogo className="h-16 w-auto" />
        <div className="text-right text-[10px] text-[#002B49]">
          <div className="text-sm font-bold uppercase">Universidade Estácio de Sá</div>
          <div>Credenciamento MEC — Portaria {state.portariaMec || "—"}</div>
        </div>
      </div>

      <div className="relative z-10 mt-10 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-[0.3em] text-[#002B49]">
          Certidão de Conclusão de Curso
        </h1>
        <div className="mx-auto mt-2 h-[2px] w-32 bg-[#002B49]" />
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-[170mm] text-center text-[13px] leading-[2] text-black">
        {state.corpoTextoSuperior ? (
          <p className="whitespace-pre-wrap text-justify">{state.corpoTextoSuperior}</p>
        ) : (
          <p>
            Certificamos que <b>{ph(state.nomeAluno)}</b>, portador(a) do CPF nº {ph(state.cpf)},
            matrícula nº {ph(state.matricula)}, concluiu o curso de{" "}
            <b>{ph(state.cursoSuperior)}</b>, fazendo jus ao título de <b>{ph(state.titulo)}</b>,
            período letivo <b>{ph(state.periodoInicio)} a {ph(state.periodoFim)}</b>, colação em{" "}
            <b>{ph(state.dataColacao)}</b>.
          </p>
        )}
        <p className="mt-8">
          <b>{ph(state.cidadeEmissao)} - {ph(state.uf)}, {ph(state.dataEmissao)}.</b>
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-[22mm] z-10 grid grid-cols-2 gap-10 px-20">
        <div className="text-center">
          <div className="h-14" />
          <div className="border-t border-black" />
          <div className="mt-1 text-[11px] font-bold uppercase">{ph(state.reitor)}</div>
          <div className="text-[10px] uppercase text-[#002B49]">Reitor(a)</div>
        </div>
        <div className="text-center">
          <div className="h-14" />
          <div className="border-t border-black" />
          <div className="mt-1 text-[11px] font-bold uppercase">{ph(state.secretarioGeral)}</div>
          <div className="text-[10px] uppercase text-[#002B49]">Secretário(a) Geral</div>
        </div>
      </div>

      <div className="absolute inset-x-[15mm] bottom-[10mm] z-10">
        <div className="border-t border-[#002B49]/40" />
        <div className="mt-1 text-center text-[10px] uppercase tracking-wide text-[#002B49]">
          {state.enderecoPolo || "—"}
        </div>
      </div>

      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}

/** Estácio — Diploma Paisagem usando imagem pronta como fundo. */
export function EstacioDiplomaPaisagem({ state, onMecChange, draggableMec = true }: Props) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: "#f4f1df",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/*
        Coloque a imagem em:
        public/images/fundo-estacio.png

        A moldura, o brasão, o título, a marca d'água, o logo e as linhas
        de assinatura já fazem parte da imagem. O código abaixo desenha
        somente os dados variáveis do diploma.
      */}
      <img
        src="/images/fundo-estacio.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
        style={{ objectFit: "fill" }}
      />

      {/* Área de textos variáveis */}
      <div
        className="absolute z-10"
        style={{
          left: "14%",
          right: "14%",
          top: "31%",
          bottom: "15%",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#3d3d2f",
        }}
      >
        <div className="flex h-full flex-col justify-center">
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              lineHeight: 1.65,
              textAlign: "justify",
            }}
          >
            O Reitor da <strong>UNIVERSIDADE ESTÁCIO DE SÁ</strong>, no uso de suas
            atribuições e tendo em vista a conclusão do Curso de{" "}
            <strong>{ph(state.cursoSuperior)}</strong>, confere o título de{" "}
            <strong>{ph(state.titulo)}</strong> a
          </p>

          <p
            style={{
              margin: "18px 0",
              fontFamily: "Georgia, 'Times New Roman', Times, serif",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              lineHeight: 1.2,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {ph(state.nomeAluno)}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              lineHeight: 1.65,
              textAlign: "justify",
            }}
          >
            Cédula de identidade nº <strong>{ph(state.rg || state.cpf)}</strong>,
            órgão expedidor <strong>{ph(state.uf)}</strong>, nascido(a) em{" "}
            <strong>{ph(state.dataNasc)}</strong>, natural de{" "}
            <strong>{ph(state.cidadeNasc)}</strong>, e outorga-lhe o presente
            Diploma, a fim de que possa gozar de todos os direitos e prerrogativas
            legais.
          </p>

          <p
            style={{
              margin: "18px 0 0",
              fontSize: "17px",
              fontStyle: "italic",
              textAlign: "right",
            }}
          >
            {ph(state.cidadeEmissao)}, {ph(state.dataEmissao)}.
          </p>
        </div>
      </div>

      {/* Mantido exatamente para continuar editável no sistema */}
      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}
