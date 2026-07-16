import type { CSSProperties, ReactNode } from "react";
import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (value?: string | null, fallback = "-"): ReactNode =>
  value?.trim() ? value : <span style={{ color: "#777" }}>{fallback}</span>;

const FONT_GOTHIC = '"Old English Text MT", "Cloister Black", "UnifrakturMaguntia", serif';
const FONT_BODY = '"Times New Roman", Times, serif';

const PAGE = {
  width: 297,
  height: 210,
};

const POS = {
  title: { top: 16.5, left: 54, width: 189, size: 15.5 },
  body: { top: 55.5, left: 57, width: 183, size: 3.1 },
  degree: { top: 78.2, left: 48, width: 201, size: 7.1 },
  student: { top: 91.5, left: 42, width: 213, size: 8.3 },
  identity: { top: 109.5, left: 55, width: 187, size: 3.2 },
  grant: { top: 126.3, left: 54, width: 189, size: 3.2 },
  date: { top: 144.3, left: 62, width: 173, size: 4.7 },
  signature: { top: 158.5, left: 104, width: 89 },
  validation: { top: 169.5, left: 211, width: 53 },
};

const mm = (value: number): string => `${value}mm`;

function absoluteStyle(top: number, left: number, width: number): CSSProperties {
  return {
    position: "absolute",
    top: mm(top),
    left: mm(left),
    width: mm(width),
    zIndex: 2,
  };
}

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

          .unip-diploma-page {
            margin: 0 !important;
            box-shadow: none !important;
            break-after: page;
            page-break-after: always;
          }
        }
      `}</style>

      <section
        className="unip-diploma-page"
        style={{
          position: "relative",
          width: mm(PAGE.width),
          height: mm(PAGE.height),
          overflow: "hidden",
          background: "#fff",
          color: "#000",
          fontFamily: FONT_BODY,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          boxSizing: "border-box",
        }}
      >
        <img
          src="/images/fundo-unip.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        <header
          style={{
            ...absoluteStyle(POS.title.top, POS.title.left, POS.title.width),
            fontFamily: FONT_GOTHIC,
            fontSize: mm(POS.title.size),
            lineHeight: 0.92,
            fontWeight: 400,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          Universidade Paulista
        </header>

        <main
          style={{
            ...absoluteStyle(POS.body.top, POS.body.left, POS.body.width),
            fontFamily: FONT_BODY,
            fontSize: mm(POS.body.size),
            lineHeight: 1.32,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>
            A Reitora da Universidade Paulista, no uso de suas atribuições
          </p>
          <p style={{ margin: "1.1mm 0 0" }}>
            e tendo em vista a conclusão do Curso Superior de {ph(state.cursoSuperior)},
          </p>
          <p style={{ margin: "1.1mm 0 0" }}>
            na data de {ph(state.dataConclusao || state.dataColacao)}, e a Colação de Grau na data de {ph(state.dataColacao)}, confere o título de
          </p>
        </main>

        <div
          style={{
            ...absoluteStyle(POS.degree.top, POS.degree.left, POS.degree.width),
            fontFamily: FONT_GOTHIC,
            fontSize: mm(POS.degree.size),
            lineHeight: 1,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {ph(state.titulo)} em {ph(state.cursoSuperior)} a
        </div>

        <div
          style={{
            ...absoluteStyle(POS.student.top, POS.student.left, POS.student.width),
            fontFamily: FONT_GOTHIC,
            fontSize: mm(POS.student.size),
            lineHeight: 1,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {ph(state.nomeAluno)}
        </div>

        <div
          style={{
            ...absoluteStyle(POS.identity.top, POS.identity.left, POS.identity.width),
            fontSize: mm(POS.identity.size),
            lineHeight: 1.35,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>
            {ph(state.nacionalidade, "brasileiro(a)")}, natural de {naturalidade || "-"}, nascido(a) em {ph(state.dataNasc)},
          </p>
          <p style={{ margin: "1.1mm 0 0" }}>
            RG nº {ph(state.rg)} e CPF nº {ph(state.cpf)}
          </p>
        </div>

        <div
          style={{
            ...absoluteStyle(POS.grant.top, POS.grant.left, POS.grant.width),
            fontSize: mm(POS.grant.size),
            lineHeight: 1.4,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>e outorga-lhe o presente Diploma,</p>
          <p style={{ margin: "1.2mm 0 0" }}>
            a fim de que possa gozar de todos os direitos e prerrogativas legais.
          </p>
        </div>

        <div
          style={{
            ...absoluteStyle(POS.date.top, POS.date.left, POS.date.width),
            fontFamily: FONT_GOTHIC,
            fontSize: mm(POS.date.size),
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          {ph(state.cidadeEmissao, "São Paulo")}, {ph(state.dataEmissao)}.
        </div>

        <div
          style={{
            ...absoluteStyle(POS.signature.top, POS.signature.left, POS.signature.width),
            textAlign: "center",
            fontFamily: FONT_BODY,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              height: "12mm",
              borderBottom: "0.25mm solid #000",
            }}
          />
          <div
            style={{
              marginTop: "1.2mm",
              fontSize: "2.45mm",
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {state.reitor || "SANDRA REJANE GOMES MIESSA"}
          </div>
          <div style={{ marginTop: "0.7mm", fontSize: "2.25mm", lineHeight: 1 }}>
            Reitora
          </div>
        </div>

        <aside
          style={{
            ...absoluteStyle(POS.validation.top, POS.validation.left, POS.validation.width),
            fontSize: "2.1mm",
            lineHeight: 1.25,
            textAlign: "left",
          }}
        >
          <div>Documento digital</div>
          <div style={{ marginTop: "0.8mm" }}>Código de validação:</div>
          <div style={{ fontWeight: 700, overflowWrap: "anywhere" }}>
            {ph(state.codigoUnico)}
          </div>
        </aside>

        <div style={{ display: "none" }} aria-hidden="true">
          <MecStampBlock
            mec={state.mec}
            onChange={onMecChange}
            draggable={draggableMec}
          />
        </div>
      </section>
    </>
  );
}
