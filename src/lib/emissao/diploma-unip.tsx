import type { CSSProperties, ReactNode } from "react";
import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (value?: string | null, fallback = "-"): ReactNode =>
  value?.trim() ? value : <span style={{ opacity: 0.55 }}>{fallback}</span>;

const MM = (value: number) => `${value}mm`;

// Coordenadas calibradas a partir do diploma de referência em A4 horizontal.
const POS = {
  front: {
    titleTop: 37.0,
    titleLeft: 55,
    titleWidth: 187,
    introTop: 65.5,
    introLeft: 51,
    introWidth: 195,
    degreeTop: 88.0,
    degreeLeft: 43,
    degreeWidth: 211,
    studentTop: 100.0,
    studentLeft: 38,
    studentWidth: 221,
    identityTop: 115.5,
    identityLeft: 46,
    identityWidth: 205,
    grantTop: 133.0,
    grantLeft: 49,
    grantWidth: 199,
    dateTop: 146.5,
    dateLeft: 49,
    dateWidth: 199,
    signatureTop: 159.0,
    signatureLeft: 95,
    signatureWidth: 107,
    validationTop: 171,
    validationLeft: 221,
    validationWidth: 49,
  },
};

const pageBase: CSSProperties = {
  position: "relative",
  width: "297mm",
  height: "210mm",
  overflow: "hidden",
  background: "#fff",
  color: "#000",
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
};

const centerText: CSSProperties = {
  position: "absolute",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const oldEnglishBase: CSSProperties = {
  fontWeight: 400,
  fontStyle: "normal",
  fontSynthesis: "none",
  transformOrigin: "center top",
};

/**
 * Diploma UNIP reconstruído em coordenadas fixas de milímetros.
 *
 * Arquivos esperados:
 * public/images/fundo-unip.png
 * public/fonts/OldEnglishTextMT.ttf
 */
export function DiplomaUnip({
  state,
  onMecChange,
  draggableMec = true,
}: Props) {
  const naturalidade = [state.cidadeNasc, state.estadoNasc]
    .filter((item) => item?.trim())
    .join(" - ");

  const nacionalidade = state.nacionalidade?.trim() || "brasileiro(a)";
  const cidadeEmissao = state.cidadeEmissao?.trim() || "São Paulo";
  const reitor = state.reitor?.trim() || "SANDRA REJANE GOMES MIESSA";

  return (
    <>
      <style>{`
        @font-face {
          font-family: "OldEnglishUNIP";
          src: url("/fonts/OldEnglishTextMT.ttf") format("truetype");
          font-style: normal;
          font-weight: 400;
          font-display: block;
        }

        .unip-old-english {
          font-family: "OldEnglishUNIP", "Old English Text MT", "Cloister Black", serif;
          font-synthesis: none;
        }

        .unip-body {
          font-family: "Times New Roman", Times, serif;
        }

        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {
          .doc-sheet.a4-landscape {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* FOLHA 1, FRENTE */}
      <div className="doc-sheet a4-landscape" style={pageBase}>
        <img
          src="/images/fundo-unip.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            width: "297mm",
            height: "210mm",
            objectFit: "fill",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        <div
          className="unip-old-english"
          style={{
            ...centerText,
            zIndex: 2,
            top: MM(POS.front.titleTop),
            left: MM(POS.front.titleLeft),
            width: MM(POS.front.titleWidth),
            ...oldEnglishBase,
            fontSize: "13.4mm",
            lineHeight: 1,
            letterSpacing: "-0.10mm",
            transform: "scaleX(1) scaleY(0.90)",
          }}
        >
          Universidade Paulista
        </div>

        <div
          className="unip-body"
          style={{
            ...centerText,
            zIndex: 2,
            top: MM(POS.front.introTop),
            left: MM(POS.front.introLeft),
            width: MM(POS.front.introWidth),
            fontSize: "3.1mm",
            lineHeight: 1.42,
          }}
        >
          <div>
            A Reitora da Universidade Paulista, no uso de suas atribuições
          </div>
          <div>
            e tendo em vista a conclusão do Curso Superior de{" "}
            {ph(state.cursoSuperior)},
          </div>
          <div>
            na data de {ph(state.dataColacao)}, e a Colação de Grau na data de{" "}
            {ph(state.dataColacao)}, confere o título de
          </div>
        </div>

        <div
          className="unip-old-english"
          style={{
            ...centerText,
            zIndex: 2,
            top: MM(POS.front.degreeTop),
            left: MM(POS.front.degreeLeft),
            width: MM(POS.front.degreeWidth),
            ...oldEnglishBase,
            fontSize: "6.6mm",
            lineHeight: 1,
            letterSpacing: "-0.05mm",
            transform: "scaleX(1.02) scaleY(0.88)",
          }}
        >
          {ph(state.titulo)} em {ph(state.cursoSuperior)} a
        </div>

        <div
          className="unip-old-english"
          style={{
            ...centerText,
            zIndex: 2,
            top: MM(POS.front.studentTop),
            left: MM(POS.front.studentLeft),
            width: MM(POS.front.studentWidth),
            ...oldEnglishBase,
            fontSize: "8.2mm",
            lineHeight: 1,
            letterSpacing: "-0.08mm",
            transform: "scaleX(1.02) scaleY(0.88)",
          }}
        >
          {ph(state.nomeAluno)}
        </div>

        <div
          className="unip-body"
          style={{
            ...centerText,
            zIndex: 2,
            top: MM(POS.front.identityTop),
            left: MM(POS.front.identityLeft),
            width: MM(POS.front.identityWidth),
            fontSize: "3.15mm",
            lineHeight: 1.44,
          }}
        >
          <div>
            {nacionalidade}, natural de {naturalidade || "-"}, nascido(a) em{" "}
            {ph(state.dataNasc)},
          </div>
          <div>
            RG nº {ph(state.rg)} e CPF nº {ph(state.cpf)},
          </div>
        </div>

        <div
          className="unip-body"
          style={{
            ...centerText,
            zIndex: 2,
            top: MM(POS.front.grantTop),
            left: MM(POS.front.grantLeft),
            width: MM(POS.front.grantWidth),
            fontSize: "3.25mm",
            lineHeight: 1.52,
          }}
        >
          <div>e outorga-lhe o presente Diploma,</div>
          <div>
            a fim de que possa gozar de todos os direitos e prerrogativas
            legais.
          </div>
        </div>

        <div
          className="unip-old-english"
          style={{
            ...centerText,
            zIndex: 2,
            top: MM(POS.front.dateTop),
            left: MM(POS.front.dateLeft),
            width: MM(POS.front.dateWidth),
            ...oldEnglishBase,
            fontSize: "4.8mm",
            lineHeight: 1,
            letterSpacing: "-0.03mm",
            transform: "scaleX(1.01) scaleY(0.90)",
          }}
        >
          {cidadeEmissao}, {ph(state.dataEmissao)}.
        </div>

        <div
          className="unip-body"
          style={{
            position: "absolute",
            zIndex: 2,
            top: MM(POS.front.signatureTop),
            left: MM(POS.front.signatureLeft),
            width: MM(POS.front.signatureWidth),
            textAlign: "center",
          }}
        >
          <div style={{ height: "10mm" }} />
          <div
            style={{
              borderTop: "0.25mm solid #000",
              width: "58mm",
              margin: "0 auto",
            }}
          />
          <div
            style={{
              marginTop: "1.2mm",
              fontSize: "2.55mm",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {reitor}
          </div>
          <div style={{ marginTop: "0.8mm", fontSize: "2.4mm", lineHeight: 1 }}>
            Reitora
          </div>
        </div>

        <div
          className="unip-body"
          style={{
            position: "absolute",
            zIndex: 2,
            top: MM(POS.front.validationTop),
            left: MM(POS.front.validationLeft),
            width: MM(POS.front.validationWidth),
            fontSize: "2.05mm",
            lineHeight: 1.1,
            textAlign: "left",
          }}
        >
          <div>Documento digital</div>
          <div>Código de validação:</div>
          <div style={{ fontWeight: 700, overflowWrap: "anywhere" }}>
            {ph(state.codigoUnico)}
          </div>
        </div>

        <div style={{ display: "none" }} aria-hidden="true">
          <MecStampBlock
            mec={state.mec}
            onChange={onMecChange}
            draggable={draggableMec}
          />
        </div>
      </div>

      {/* FOLHA 2, VERSO */}
      <div
        className="doc-sheet a4-landscape unip-body"
        style={{
          ...pageBase,
          pageBreakBefore: "always",
          breakBefore: "page",
          fontSize: "3.05mm",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "18mm",
            top: "34mm",
            width: "118mm",
            textAlign: "center",
            lineHeight: 1.45,
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {state.mantenedora || "ASSUPERO - ENSINO SUPERIOR LTDA"}
          </div>
          <div>CNPJ {state.cnpj || "-"}</div>
          <div style={{ marginTop: "11mm" }}>Universidade Paulista - UNIP</div>
          <div style={{ marginTop: "11mm" }}>
            Recredenciada pela Portaria MEC nº {ph(state.portariaMec)}
          </div>
          <div style={{ marginTop: "11mm" }}>
            Curso Superior de {ph(state.cursoSuperior)}
          </div>
          <div style={{ marginTop: "4mm" }}>{ph(state.resolucao)}</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "171mm",
            top: "24mm",
            width: "103mm",
            border: "0.45mm solid #000",
            padding: "5mm 5mm 4mm",
            boxSizing: "border-box",
            fontSize: "2.85mm",
            lineHeight: 1.35,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4mm",
            }}
          >
            <b>RA: {state.raCode || "-"}</b>
            <b>LOTE: {state.lote || "-"}</b>
          </div>
          <div style={{ textAlign: "center", fontWeight: 700 }}>
            {state.mantenedora || "ASSUPERO - ENSINO SUPERIOR LTDA"}
          </div>
          <div style={{ textAlign: "center" }}>CNPJ {state.cnpj || "-"}</div>
          <div
            style={{ textAlign: "center", marginTop: "3mm", fontWeight: 700 }}
          >
            UNIVERSIDADE PAULISTA - UNIP
          </div>
          <div
            style={{ textAlign: "center", marginTop: "7mm", fontWeight: 700 }}
          >
            Secretaria Geral
          </div>
          <div style={{ textAlign: "center", fontWeight: 700 }}>
            Departamento de Registro de Diplomas
          </div>

          <div style={{ marginTop: "8mm" }}>
            Diploma registrado sob nº {ph(state.folhaLivro)}, Livro{" "}
            {ph(state.livro)}, em {ph(state.dataEmissao)}.
          </div>

          <div style={{ marginTop: "8mm" }}>
            Processo nº {ph(state.codigoUnico)}
          </div>

          <div style={{ marginTop: "7mm", textAlign: "center" }}>
            {cidadeEmissao}, {ph(state.dataEmissao)}.
          </div>

          <div style={{ height: "18mm" }} />
          <div
            style={{
              borderTop: "0.25mm solid #000",
              width: "58mm",
              margin: "0 auto",
            }}
          />
          <div
            style={{ marginTop: "1mm", textAlign: "center", fontWeight: 700 }}
          >
            {ph(state.secretarioAdjunto)}
          </div>
          <div style={{ textAlign: "center" }}>
            Secretário(a) Geral Adjunto(a)
          </div>
        </div>
      </div>
    </>
  );
}
