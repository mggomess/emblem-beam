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
      export function EstacioDiplomaPaisagem({
  state,
  onMecChange,
  draggableMec = true,
}: Props) {
  return (
    <div
      className="doc-sheet a4-landscape relative overflow-hidden"
      style={{
        backgroundColor: "#f4f1df",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <img
        src="/images/fundo-estacio.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
        style={{
          objectFit: "fill",
        }}
      />

      <div
        className="absolute z-10"
        style={{
          left: "10.8%",
          right: "10.8%",
          top: "28.5%",
          bottom: "18%",
          fontFamily: "'Arial Narrow', Arial, Helvetica, sans-serif",
          color: "#36372d",
        }}
      >
        <div
          style={{
            width: "100%",
            fontSize: "17px",
            lineHeight: 1.45,
            fontStyle: "italic",
          }}
        >
          <p
            style={{
              margin: 0,
              textAlign: "justify",
            }}
          >
            O Reitor da{" "}
            <strong style={{ fontWeight: 600 }}>
              UNIVERSIDADE ESTÁCIO DE SÁ
            </strong>
            , no uso de suas atribuições e tendo em vista a
          </p>

          <p
            style={{
              margin: "5px 0 0",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "14px",
            }}
          >
            <span>conclusão do Curso de</span>

            <strong
              style={{
                flex: 1,
                fontWeight: 500,
                fontStyle: "normal",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {ph(state.cursoSuperior)}
            </strong>

            <span>
              , em {ph(state.dataColacao || state.dataEmissao)},
            </span>
          </p>

          <p
            style={{
              margin: "5px 0 0",
              display: "flex",
              alignItems: "baseline",
              gap: "14px",
            }}
          >
            <span>confere o título de</span>

            <strong
              style={{
                flex: 1,
                fontWeight: 500,
                fontStyle: "normal",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {ph(state.titulo)}
            </strong>

            <span>a</span>
          </p>

          <p
            style={{
              margin: "15px 0 17px",
              fontSize: "29px",
              fontWeight: 400,
              fontStyle: "normal",
              lineHeight: 1.1,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {ph(state.nomeAluno)}
          </p>

          <p
            style={{
              margin: 0,
              display: "grid",
              gridTemplateColumns: "auto 1fr auto 1fr",
              alignItems: "baseline",
              columnGap: "12px",
            }}
          >
            <span>Cédula de identidade nº</span>

            <strong
              style={{
                fontWeight: 400,
                fontStyle: "normal",
              }}
            >
              {ph(state.rg || state.cpf)}
            </strong>

            <span>, órgão expedidor</span>

            <strong
              style={{
                fontWeight: 400,
                fontStyle: "normal",
              }}
            >
              {ph(state.orgaoExpedidor || state.uf)}
            </strong>
          </p>

          <p
            style={{
              margin: "8px 0 0",
              display: "grid",
              gridTemplateColumns: "auto auto auto 1fr",
              alignItems: "baseline",
              columnGap: "12px",
            }}
          >
            <span>nascido(a) em</span>

            <strong
              style={{
                fontWeight: 400,
                fontStyle: "normal",
              }}
            >
              {ph(state.dataNasc)}
            </strong>

            <span>, natural de</span>

            <strong
              style={{
                fontWeight: 400,
                fontStyle: "normal",
                textTransform: "uppercase",
              }}
            >
              {ph(state.cidadeNasc)}
              {state.uf ? ` - ${state.uf}` : ""}
            </strong>
          </p>

          <p
            style={{
              margin: "10px 0 0",
              textAlign: "justify",
            }}
          >
            e outorga-lhe o presente Diploma, a fim de que possa gozar de
            todos os direitos e prerrogativas legais.
          </p>

          <p
            style={{
              margin: "18px 5% 0 0",
              fontSize: "18px",
              fontStyle: "italic",
              textAlign: "right",
            }}
          >
            {ph(state.cidadeEmissao)}, {ph(state.dataEmissao)}.
          </p>
        </div>
      </div>

      <MecStampBlock
        mec={state.mec}
        onChange={onMecChange}
        draggable={draggableMec}
      />
    </div>
  );
}
