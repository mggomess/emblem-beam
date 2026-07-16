import type { ReactNode } from "react";
import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (value?: string | null, fallback = "-"): ReactNode =>
  value?.trim() ? value : <span style={{ opacity: 0.55 }}>{fallback}</span>;

const bodyFont = '"Times New Roman", Times, serif';
const oldEnglishFont = '"OldEnglishLocal", "Old English Text MT", "OldEnglishTextMT", serif';

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
        @font-face {
          font-family: "OldEnglishLocal";
          src: local("Old English Text MT"), local("OldEnglishTextMT");
          font-style: normal;
          font-weight: 400;
          font-display: swap;
        }

        .unip-old-english {
          font-family: "OldEnglishLocal", "Old English Text MT", "OldEnglishTextMT", serif !important;
          font-weight: 400 !important;
          font-style: normal !important;
          letter-spacing: 0 !important;
          text-transform: none !important;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }

          .doc-sheet.a4-landscape {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            break-after: page;
            page-break-after: always;
          }
        }
      `}</style>

      <div
        className="doc-sheet a4-landscape relative overflow-hidden bg-white"
        style={{
          width: "297mm",
          height: "210mm",
          position: "relative",
          overflow: "hidden",
          background: "#fff",
          fontFamily: bodyFont,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <img
          src="/images/fundo-unip.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Título, rebaixado para não encostar na moldura */}
        <div
          className="unip-old-english"
          style={{
            position: "absolute",
            top: "15.5mm",
            left: "58mm",
            width: "181mm",
            textAlign: "center",
            fontSize: "31px",
            lineHeight: 1,
            color: "#000",
            whiteSpace: "nowrap",
          }}
        >
          Universidade Paulista
        </div>

        {/* Corpo principal, deslocado para baixo */}
        <div
          style={{
            position: "absolute",
            top: "58mm",
            left: "61mm",
            width: "175mm",
            textAlign: "center",
            color: "#000",
            fontFamily: bodyFont,
            fontSize: "10.2px",
            lineHeight: 1.38,
          }}
        >
          <p style={{ margin: 0 }}>
            A Reitora da Universidade Paulista, no uso de suas atribuições
          </p>
          <p style={{ margin: "2px 0 0" }}>
            e tendo em vista a conclusão do Curso Superior de {ph(state.cursoSuperior)},
          </p>
          <p style={{ margin: "2px 0 0" }}>
            na data de {ph(state.dataColacao)}, e a Colação de Grau na data de {ph(state.dataColacao)},
          </p>
          <p style={{ margin: "2px 0 0" }}>confere o título de</p>

          <div
            className="unip-old-english"
            style={{
              marginTop: "4px",
              fontSize: "21px",
              lineHeight: 1.05,
              whiteSpace: "nowrap",
            }}
          >
            {ph(state.titulo)} em {ph(state.cursoSuperior)} a
          </div>

          <div
            className="unip-old-english"
            style={{
              marginTop: "5px",
              fontSize: "27px",
              lineHeight: 1.05,
              whiteSpace: "nowrap",
            }}
          >
            {ph(state.nomeAluno)}
          </div>

          <p style={{ margin: "8px 0 0" }}>
            {ph(state.nacionalidade, "brasileiro(a)")}, natural de {naturalidade || "-"}, nascido(a) em {ph(state.dataNasc)},
          </p>
          <p style={{ margin: "1px 0 0" }}>
            RG nº {ph(state.rg)} e CPF nº {ph(state.cpf)},
          </p>
          <p style={{ margin: "8px 0 0" }}>e outorga-lhe o presente Diploma,</p>
          <p style={{ margin: "1px 0 0" }}>
            a fim de que possa gozar de todos os direitos e prerrogativas legais.
          </p>

          <div
            className="unip-old-english"
            style={{
              marginTop: "8px",
              fontSize: "16px",
              lineHeight: 1.05,
            }}
          >
            {ph(state.cidadeEmissao, "São Paulo")}, {ph(state.dataEmissao)}.
          </div>
        </div>

        {/* Assinatura */}
        <div
          style={{
            position: "absolute",
            top: "170mm",
            left: "99mm",
            width: "99mm",
            textAlign: "center",
            color: "#000",
            fontFamily: bodyFont,
          }}
        >
          <div style={{ width: "58mm", height: "8mm", margin: "0 auto", borderBottom: "0.3mm solid #000" }} />
          <div style={{ marginTop: "1.2mm", fontSize: "8px", fontWeight: 700, lineHeight: 1 }}>
            {state.reitor || "SANDRA REJANE GOMES MIESSA"}
          </div>
          <div style={{ marginTop: "0.8mm", fontSize: "7.5px", lineHeight: 1 }}>Reitora</div>
        </div>

        {/* Validação */}
        <div
          style={{
            position: "absolute",
            right: "50mm",
            bottom: "20mm",
            width: "38mm",
            textAlign: "left",
            color: "#000",
            fontFamily: bodyFont,
            fontSize: "6.6px",
            lineHeight: 1.15,
          }}
        >
          <div>Documento digital</div>
          <div>Código de validação:</div>
          <div style={{ fontWeight: 700, wordBreak: "break-all" }}>{ph(state.codigoUnico)}</div>
        </div>

        <div style={{ display: "none" }} aria-hidden="true">
          <MecStampBlock
            mec={state.mec}
            onChange={onMecChange}
            draggable={draggableMec}
          />
        </div>
      </div>
    </>
  );
}
