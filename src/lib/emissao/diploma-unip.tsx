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

const FONT = '"Old English Text MT", "Cloister Black", serif';

const POS = {
  titulo: { top: 8.2, left: 21, width: 58, size: 5.8 },
  introducao: { top: 28.6, left: 22, width: 56, size: 1.82 },
  curso: { top: 40.2, left: 19, width: 62, size: 3.8 },
  aluno: { top: 46.8, left: 16, width: 68, size: 4.9 },
  dados: { top: 55.4, left: 20, width: 60, size: 1.9 },
  outorga: { top: 64.0, left: 20, width: 60, size: 1.9 },
  data: { top: 72.7, left: 25, width: 50, size: 2.55 },
  assinatura: { top: 79.0, left: 36, width: 28 },
  validacao: { top: 84.0, left: 73.2, width: 17.2 },
};

const abs = (top: number, left: number, width: number): CSSProperties => ({
  position: "absolute",
  top: `${top}%`,
  left: `${left}%`,
  width: `${width}%`,
  zIndex: 2,
  boxSizing: "border-box",
});

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

        .unip-diploma-page {
          height: 100%;
          width: auto;
          max-width: 100%;
          aspect-ratio: 1086 / 850;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          background: white;
          color: #000;
          font-family: ${FONT};
          container-type: inline-size;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        @media print {
          .unip-diploma-page {
            height: 100% !important;
            width: auto !important;
            max-width: 100% !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <section
        className="doc-sheet a4-landscape relative overflow-hidden bg-white"
        style={{
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          fontFamily: FONT,
        }}
      >
        <div className="unip-diploma-page">
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

          <div
            style={{
              ...abs(POS.titulo.top, POS.titulo.left, POS.titulo.width),
              fontSize: `${POS.titulo.size}cqw`,
              lineHeight: 0.9,
              textAlign: "center",
              whiteSpace: "nowrap",
              fontWeight: 400,
            }}
          >
            Universidade Paulista
          </div>

          <div
            style={{
              ...abs(POS.introducao.top, POS.introducao.left, POS.introducao.width),
              fontSize: `${POS.introducao.size}cqw`,
              lineHeight: 1.28,
              textAlign: "center",
            }}
          >
            <div>A Reitora da Universidade Paulista, no uso de suas atribuições</div>
            <div style={{ marginTop: "0.55%" }}>
              e tendo em vista a conclusão do Curso Superior de {ph(state.cursoSuperior)},
            </div>
            <div style={{ marginTop: "0.55%" }}>
              na data de {ph(state.dataConclusao || state.dataColacao)}, e a Colação de Grau na data de {ph(state.dataColacao)}, confere o título de
            </div>
          </div>

          <div
            style={{
              ...abs(POS.curso.top, POS.curso.left, POS.curso.width),
              fontSize: `${POS.curso.size}cqw`,
              lineHeight: 1,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {ph(state.titulo)} em {ph(state.cursoSuperior)} a
          </div>

          <div
            style={{
              ...abs(POS.aluno.top, POS.aluno.left, POS.aluno.width),
              fontSize: `${POS.aluno.size}cqw`,
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
              ...abs(POS.dados.top, POS.dados.left, POS.dados.width),
              fontSize: `${POS.dados.size}cqw`,
              lineHeight: 1.25,
              textAlign: "center",
            }}
          >
            <div>
              {ph(state.nacionalidade, "brasileiro(a)")}, natural de {naturalidade || "-"}, nascido(a) em {ph(state.dataNasc)},
            </div>
            <div style={{ marginTop: "0.65%" }}>
              RG nº {ph(state.rg)} e CPF nº {ph(state.cpf)}
            </div>
          </div>

          <div
            style={{
              ...abs(POS.outorga.top, POS.outorga.left, POS.outorga.width),
              fontSize: `${POS.outorga.size}cqw`,
              lineHeight: 1.25,
              textAlign: "center",
            }}
          >
            <div>e outorga-lhe o presente Diploma,</div>
            <div style={{ marginTop: "0.65%" }}>
              a fim de que possa gozar de todos os direitos e prerrogativas legais.
            </div>
          </div>

          <div
            style={{
              ...abs(POS.data.top, POS.data.left, POS.data.width),
              fontSize: `${POS.data.size}cqw`,
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {ph(state.cidadeEmissao, "São Paulo")}, {ph(state.dataEmissao)}.
          </div>

          <div
            style={{
              ...abs(POS.assinatura.top, POS.assinatura.left, POS.assinatura.width),
              textAlign: "center",
            }}
          >
            <div style={{ height: "5.2cqw", borderBottom: "1px solid #000" }} />
            <div style={{ marginTop: "0.55cqw", fontSize: "1.35cqw", lineHeight: 1 }}>
              {state.reitor || "SANDRA REJANE GOMES MIESSA"}
            </div>
            <div style={{ marginTop: "0.22cqw", fontSize: "1.15cqw", lineHeight: 1 }}>
              Reitora
            </div>
          </div>

          <div
            style={{
              ...abs(POS.validacao.top, POS.validacao.left, POS.validacao.width),
              fontSize: "0.92cqw",
              lineHeight: 1.1,
              textAlign: "left",
            }}
          >
            <div>Documento digital</div>
            <div style={{ marginTop: "0.2cqw" }}>Código de validação:</div>
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
      </section>
    </>
  );
}
