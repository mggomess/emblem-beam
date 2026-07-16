import type { CSSProperties, ReactNode } from "react";
import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (value?: string | null, fallback = "-"): ReactNode =>
  value?.trim() ? value : <span className="du-placeholder">{fallback}</span>;

const bodyFont = '"EB Garamond", "Times New Roman", Times, serif';
const gothicFont =
  '"UnifrakturCook", "Old English Text MT", "Engravers Old English", "UnifrakturMaguntia", serif';

const pageStyle: CSSProperties = {
  position: "relative",
  width: "297mm",
  height: "210mm",
  overflow: "hidden",
  background: "#fff",
  color: "#111",
  fontFamily: bodyFont,
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
  boxSizing: "border-box",
  flex: "0 0 auto",
};

/**
 * Modelo estável para A4 horizontal.
 *
 * O layout usa milímetros em vez de porcentagens, reduzindo diferenças entre
 * navegadores, visualização e impressão em PDF. A imagem fundo-unip.png deve
 * conter somente moldura, brasão e logomarca.
 */
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
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=UnifrakturCook:wght@700&display=swap");

        .du-page, .du-page * { box-sizing: border-box; }
        .du-placeholder { color: #777; }
        .du-nowrap { white-space: nowrap; }
        .du-break { overflow-wrap: anywhere; word-break: break-word; }

        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .du-page {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-after: always;
            break-after: page;
          }

          .du-page:last-of-type {
            page-break-after: auto;
            break-after: auto;
          }
        }
      `}</style>

      {/* FOLHA 1, FRENTE */}
      <section className="du-page" style={pageStyle}>
        <img
          src="/images/fundo-unip.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "297mm",
            height: "auto",
            maxWidth: "none",
            objectFit: "contain",
            objectPosition: "top left",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Cabeçalho */}
        <header
          style={{
            position: "absolute",
            top: "16.5mm",
            left: "62mm",
            width: "173mm",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div
            className="du-nowrap"
            style={{
              fontFamily: gothicFont,
              fontSize: "12.2mm",
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.15mm",
            }}
          >
            Universidade Paulista
          </div>
        </header>

        {/* Texto principal */}
        <main
          style={{
            position: "absolute",
            top: "52mm",
            left: "59mm",
            width: "179mm",
            zIndex: 2,
            textAlign: "center",
            fontSize: "3.45mm",
            lineHeight: 1.42,
          }}
        >
          <p style={{ margin: 0 }}>
            A Reitora da Universidade Paulista, no uso de suas atribuições,
          </p>
          <p style={{ margin: "1.2mm 0 0" }}>
            tendo em vista a conclusão do Curso Superior de{" "}
            {ph(state.cursoSuperior)},
          </p>
          <p style={{ margin: "1.2mm 0 0" }}>
            na data de {ph(state.dataColacao)}, e a Colação de Grau realizada na
            mesma data,
          </p>
          <p style={{ margin: "1.2mm 0 0" }}>confere o título de</p>

          <div
            style={{
              marginTop: "3.2mm",
              minHeight: "11mm",
              fontFamily: gothicFont,
              fontSize: "7.2mm",
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "0",
            }}
          >
            {ph(state.titulo)} em {ph(state.cursoSuperior)} a
          </div>

          <div
            style={{
              marginTop: "3.3mm",
              minHeight: "10mm",
              fontFamily: gothicFont,
              fontSize: "8mm",
              fontWeight: 700,
              lineHeight: 1.05,
              textTransform: "none",
              letterSpacing: "0",
            }}
          >
            {ph(state.nomeAluno)}
          </div>

          <p style={{ margin: "4.1mm 0 0" }}>
            {ph(state.nacionalidade, "brasileiro(a)")}, natural de{" "}
            {naturalidade || "-"}, nascido(a) em {ph(state.dataNasc)},
          </p>
          <p style={{ margin: "1mm 0 0" }}>
            RG nº {ph(state.rg)} e CPF nº {ph(state.cpf)},
          </p>
          <p style={{ margin: "3.4mm 0 0" }}>
            e outorga-lhe o presente Diploma,
          </p>
          <p style={{ margin: "1mm 0 0" }}>
            a fim de que possa gozar de todos os direitos e prerrogativas
            legais.
          </p>
          <p style={{ margin: "3.7mm 0 0" }}>
            {ph(state.cidadeEmissao, "São Paulo")}, {ph(state.dataEmissao)}.
          </p>
        </main>

        {/* Assinatura da reitoria */}
        <div
          style={{
            position: "absolute",
            top: "153mm",
            left: "103.5mm",
            width: "90mm",
            zIndex: 2,
            textAlign: "center",
            fontFamily: bodyFont,
          }}
        >
          <div style={{ height: "10mm", borderBottom: "0.25mm solid #111" }} />
          <div
            style={{
              marginTop: "1.5mm",
              fontSize: "2.65mm",
              lineHeight: 1.05,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {state.reitor || "SANDRA REJANE GOMES MIESSA"}
          </div>
          <div style={{ marginTop: "0.7mm", fontSize: "2.5mm", lineHeight: 1 }}>
            Reitora
          </div>
        </div>

        {/* Validação */}
        <aside
          style={{
            position: "absolute",
            right: "30mm",
            bottom: "21mm",
            width: "54mm",
            zIndex: 2,
            fontSize: "2.15mm",
            lineHeight: 1.2,
            textAlign: "left",
          }}
        >
          <div>Documento digital</div>
          <div style={{ marginTop: "0.8mm" }}>Código de validação:</div>
          <div
            className="du-break"
            style={{ marginTop: "0.5mm", fontWeight: 700 }}
          >
            {ph(state.codigoUnico)}
          </div>
        </aside>

        {/* Integração preservada */}
        <div hidden aria-hidden="true">
          <MecStampBlock
            mec={state.mec}
            onChange={onMecChange}
            draggable={draggableMec}
          />
        </div>
      </section>

      {/* FOLHA 2, VERSO */}
      <section
        className="du-page"
        style={{
          ...pageStyle,
          pageBreakBefore: "always",
          breakBefore: "page",
          padding: "13mm 15mm",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "8mm",
            border: "0.45mm solid #6b521f",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "10mm",
            border: "0.18mm solid #6b521f",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "11mm",
            height: "100%",
            padding: "6mm 7mm",
          }}
        >
          <div style={{ fontSize: "3mm", lineHeight: 1.45 }}>
            <SectionTitle>Mantenedora</SectionTitle>
            <InfoLine label="Razão Social" value={state.mantenedora} />
            <InfoLine label="CNPJ" value={state.cnpj} />
            <InfoLine
              label="Recredenciamento"
              value={`Portaria MEC nº ${state.portariaMec || "-"}`}
            />
            <InfoLine label="Resolução CNE/CP" value={state.resolucao} />
            <InfoLine label="Endereço" value={state.enderecoPolo} />

            <div style={{ height: "7mm" }} />
            <SectionTitle>Dados do Diplomado</SectionTitle>
            <InfoLine label="Nome" value={state.nomeAluno} />
            <InfoLine label="CPF" value={state.cpf} />
            <InfoLine label="RG" value={state.rg} />
            <InfoLine label="Naturalidade" value={naturalidade} />
            <InfoLine label="Nascimento" value={state.dataNasc} />
            <InfoLine label="Nacionalidade" value={state.nacionalidade} />
            <InfoLine label="Curso" value={state.cursoSuperior} />
            <InfoLine label="Título" value={state.titulo} />
            <InfoLine label="Colação de grau" value={state.dataColacao} />

            <div
              style={{
                marginTop: "10mm",
                width: "34mm",
                height: "34mm",
                border: "1mm double #6b521f",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontSize: "2.7mm",
                lineHeight: 1.15,
                fontWeight: 700,
                color: "#6b521f",
              }}
            >
              UNIVERSIDADE
              <br />
              PAULISTA
              <br />
              UNIP
            </div>
          </div>

          <div
            style={{
              height: "100%",
              border: "0.45mm solid #6b521f",
              padding: "7mm",
              fontSize: "3mm",
              lineHeight: 1.4,
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "#6b521f",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "4mm",
              }}
            >
              Secretaria Geral
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "1mm",
                fontSize: "2.8mm",
                color: "#6b521f",
              }}
            >
              Departamento de Registro de Diplomas
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3mm",
                marginTop: "8mm",
              }}
            >
              <Box label="RA" value={state.raCode} />
              <Box label="LOTE" value={state.lote} />
              <Box label="LIVRO" value={state.livro} />
              <Box label="FOLHA" value={state.folhaLivro} />
            </div>

            <p style={{ margin: "10mm 0 0" }}>
              Registrado sob as condições acima, nos termos da legislação
              vigente e do Regimento Geral desta Universidade.
            </p>
            <p style={{ margin: "4mm 0 0" }}>
              {ph(state.cidadeEmissao)} - {ph(state.uf)},{" "}
              {ph(state.dataEmissao)}.
            </p>

            <div style={{ marginTop: "25mm", textAlign: "center" }}>
              <div style={{ borderTop: "0.25mm solid #111" }} />
              <div
                style={{
                  marginTop: "1.5mm",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {ph(state.secretarioAdjunto)}
              </div>
              <div
                style={{
                  marginTop: "0.8mm",
                  fontSize: "2.6mm",
                  textTransform: "uppercase",
                }}
              >
                Secretário(a) Geral Adjunto(a)
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginBottom: "3mm",
        paddingBottom: "1.2mm",
        borderBottom: "0.45mm solid #6b521f",
        color: "#6b521f",
        fontSize: "3.6mm",
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ marginTop: "1.3mm" }}>
      <strong>{label}:</strong> {value?.trim() || "-"}
    </div>
  );
}

function Box({ label, value }: { label: string; value?: string | null }) {
  return (
    <div
      style={{
        minHeight: "16mm",
        border: "0.25mm solid #6b521f",
        padding: "3mm",
      }}
    >
      <div
        style={{
          color: "#6b521f",
          fontSize: "2.4mm",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        className="du-break"
        style={{ marginTop: "1mm", fontSize: "3mm", fontWeight: 600 }}
      >
        {value?.trim() || "-"}
      </div>
    </div>
  );
}
