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

/** Estácio — Diploma Paisagem. Moldura ornamental tradicional + fundo marfim. */
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
      {/* Marca d'água */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 select-none"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "110px",
          fontWeight: 700,
          color: "#2f2f2f",
          opacity: 0.05,
          transform: "translate(-50%,-50%) rotate(-20deg)",
          whiteSpace: "nowrap",
        }}
      >
        ESTÁCIO
      </div>

      {/* Moldura ornamental: borda externa escura, faixa ornamental e borda interna fina */}
      <div
        className="pointer-events-none absolute inset-[20px] z-20"
        style={{
          border: "6px solid #222", // borda externa escura
          padding: "12px",
          boxSizing: "border-box",
          backgroundClip: "padding-box",
        }}
      >
        {/* Faixa ornamental (simples, sem imagens) */}
        <div
          className="w-full h-full"
          style={{
            boxSizing: "border-box",
            padding: "10px",
            background: "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(0,0,0,0)",
          }}
        >
          <div
            className="relative flex h-full w-full flex-col justify-between"
            style={{
              border: "1px solid rgba(0,0,0,0.12)", // borda interna fina
              boxShadow: "inset 0 0 0 3px rgba(210,206,181,0.9)",
              backgroundColor: "rgba(244, 241, 223, 0.98)",
              padding: "36px 52px 28px",
              boxSizing: "border-box",
            }}
          >
            {/* Cabeçalho */}
            <div className="relative z-10">
              {/* Selo provisório */}
              <div
                className="absolute flex items-center justify-center rounded-full border-2 border-[#555848] text-center font-semibold text-[#555848]"
                style={{
                  left: "10px",
                  top: "0px",
                  width: "72px",
                  height: "72px",
                  fontSize: "9px",
                }}
              >
                SELO
              </div>

              <h1
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "34px",
                  fontWeight: 600,
                  color: "#2d302a",
                  textAlign: "center",
                  letterSpacing: "0.08em",
                  margin: "14px 0 38px",
                  lineHeight: 1.2,
                }}
              >
                UNIVERSIDADE ESTÁCIO DE SÁ
              </h1>
            </div>

            {/* Corpo do diploma */}
            <div
              className="relative z-10 flex flex-1 flex-col justify-center"
              style={{
                padding: "10px 35px",
                fontFamily: "Arial, Helvetica, sans-serif",
                color: "#30322d",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: 1.8,
                  textAlign: "justify",
                  margin: "0 0 16px",
                }}
              >
                O Reitor da{" "}
                <strong>UNIVERSIDADE ESTÁCIO DE SÁ</strong>, no uso de suas
                atribuições e tendo em vista a conclusão do Curso de{" "}
                <strong>{ph(state.cursoSuperior)}</strong>, confere o título de{" "}
                <strong>{ph(state.titulo)}</strong> a
              </p>

              <p
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "12px 0",
                  letterSpacing: "0.04em",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                }}
              >
                {ph(state.nomeAluno)}
              </p>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: 1.8,
                  textAlign: "justify",
                  margin: "0 0 16px",
                }}
              >
                Cédula de identidade nº{" "}
                <strong>{ph(state.rg || state.cpf)}</strong>, órgão expedidor{" "}
                <strong>{ph(state.uf)}</strong>,
                nascido(a) em <strong>{ph(state.dataNasc)}</strong>, natural de{" "}
                <strong>{ph(state.cidadeNasc)}</strong>, e outorga-lhe o presente
                Diploma, a fim de que possa gozar de todos os direitos e
                prerrogativas legais.
              </p>

              <p
                style={{
                  fontSize: "18px",
                  fontStyle: "italic",
                  textAlign: "right",
                  margin: "8px 0 26px",
                }}
              >
                {ph(state.cidadeEmissao)}, {ph(state.dataEmissao)}.
              </p>
            </div>

            {/* Rodapé em três colunas: Diplomado(a) | ESTÁCIO | Diretor */}
            <div
              className="relative z-10 flex items-end justify-between"
              style={{
                gap: "28px",
                padding: "0 35px",
              }}
            >
              {/* Diplomado */}
              <div
                style={{
                  width: "30%",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    borderTop: "1px solid #333",
                    marginBottom: "7px",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                  }}
                >
                  {ph(state.nomeAluno)}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                    marginTop: "4px",
                  }}
                >
                  Diplomado(a)
                </p>
              </div>

              {/* ESTÁCIO central */}
              <div
                style={{
                  width: "26%",
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#2d302a",
                  paddingBottom: "6px",
                }}
              >
                ESTÁCIO
              </div>

              {/* Diretor */}
              <div
                style={{
                  width: "30%",
                  textAlign: "center",
                }}
              >
                <div style={{ height: "35px" }} />

                <div
                  style={{
                    borderTop: "1px solid #333",
                    marginBottom: "7px",
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                  }}
                >
                  Diretor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}
