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
      className="doc-sheet a4-landscape font-sans-doc relative"
      style={{
        width: "1123px",
        height: "794px",
        backgroundColor: "#f4f1df",
        backgroundImage:
          "radial-gradient(rgba(90, 90, 70, 0.04) 1px, transparent 1px)",
        backgroundSize: "6px 6px",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {/* Marca d'água Estácio */}
      <img
        src="/templates/estacio/marca-dagua-estacio.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          top: "50%",
          width: "48%",
          transform: "translate(-50%, -50%)",
          objectFit: "contain",
          opacity: 0.07,
          zIndex: 0,
        }}
        onError={(e) => (e.currentTarget.style.visibility = "hidden")}
      />

      {/* Moldura ornamental */}
      <div
        className="pointer-events-none absolute"
        style={{
          inset: "22px",
          border: "2px solid #33352b",
          padding: "10px",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderWidth: "20px",
            borderStyle: "solid",
            borderImage:
              "repeating-linear-gradient(45deg, #25271f 0, #25271f 4px, #5c5e4c 4px, #5c5e4c 7px, #2e3027 7px, #2e3027 11px) 20",
            padding: "8px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              border: "2px solid #606352",
              boxShadow:
                "inset 0 0 0 3px #c8c5ac, inset 0 0 0 5px #555848",
              backgroundColor: "rgba(244, 241, 223, 0.96)",
              padding: "40px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Cabeçalho: Título institucional e Selo */}
            <div style={{ position: "relative", zIndex: 10 }}>
              {/* Selo institucional superior esquerdo */}
              <img
                src="/templates/estacio/selo-estacio.png"
                alt="Selo institucional"
                className="absolute"
                style={{
                  left: "55px",
                  top: "48px",
                  height: "72px",
                  width: "72px",
                  objectFit: "contain",
                  zIndex: 10,
                }}
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />

              {/* Título institucional */}
              <h1
                className="institution-title"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "32px",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#2d302a",
                  textAlign: "center",
                  margin: "0 0 20px 0",
                  lineHeight: 1.2,
                }}
              >
                UNIVERSIDADE ESTÁCIO DE SÁ
              </h1>
            </div>

            {/* Corpo do diploma */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "20px 40px",
              }}
            >
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "18px",
                  color: "#30322d",
                  lineHeight: 1.8,
                  textAlign: "justify",
                  margin: "0 0 16px 0",
                }}
              >
                O Reitor da <strong>UNIVERSIDADE ESTÁCIO DE SÁ</strong>, no uso de suas atribuições
                e tendo em vista a conclusão do Curso de{" "}
                <strong>{ph(state.cursoSuperior)}</strong>, em{" "}
                <strong>{ph(state.dataColacao)}</strong>, confere o título de{" "}
                <strong>{ph(state.titulo)}</strong> a
              </p>

              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "#30322d",
                  textAlign: "center",
                  margin: "12px 0 12px 0",
                  letterSpacing: "0.05em",
                }}
              >
                {ph(state.nomeAluno)}
              </p>

              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "18px",
                  color: "#30322d",
                  lineHeight: 1.8,
                  textAlign: "justify",
                  margin: "0 0 16px 0",
                }}
              >
                Cédula de identidade nº <strong>{ph(state.cpf)}</strong>, órgão expedidor{" "}
                <strong>{ph(state.uf)}</strong>, nascido(a) em{" "}
                <strong>{ph(state.dataColacao)}</strong>, natural de{" "}
                <strong>{ph(state.cidadeEmissao)}</strong>, e outorga-lhe o presente Diploma, a
                fim de que possa gozar de todos os direitos e prerrogativas legais.
              </p>
            </div>

            {/* Rodapé com data, local e assinaturas */}
            <div style={{ position: "relative", zIndex: 10 }}>
              {/* Data e local */}
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "16px",
                  fontStyle: "italic",
                  color: "#30322d",
                  textAlign: "right",
                  margin: "0 0 40px 0",
                }}
              >
                {ph(state.cidadeEmissao)}, {ph(state.dataEmissao)}.
              </p>

              {/* Assinaturas e logo */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  gap: "40px",
                  alignItems: "flex-end",
                  position: "relative",
                }}
              >
                {/* Assinatura do diplomado */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      height: "50px",
                    }}
                  />
                  <div
                    style={{
                      borderTop: "1px solid #30322d",
                      marginBottom: "8px",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "#30322d",
                      margin: 0,
                      letterSpacing: "0.05em",
                    }}
                  >
                    Diplomado(a)
                  </p>
                </div>

                {/* Logo Estácio central */}
                <img
                  src="/templates/estacio/logo-estacio.png"
                  alt="Estácio"
                  style={{
                    height: "42px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />

                {/* Assinatura do diretor */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      height: "50px",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      marginBottom: "0px",
                    }}
                  >
                    {state.reitor && (
                      <img
                        src={state.reitor}
                        alt="Assinatura do diretor"
                        style={{
                          maxHeight: "40px",
                          objectFit: "contain",
                        }}
                        onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #30322d",
                      marginBottom: "8px",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "#30322d",
                      margin: 0,
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
      </div>

      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}
