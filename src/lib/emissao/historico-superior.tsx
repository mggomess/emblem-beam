import type { CSSProperties } from "react";
import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

type Props = {
  state: EmissaoState;
};

const MM = (value: number) => `${value}mm`;

const baseText: CSSProperties = {
  position: "absolute",
  zIndex: 2,
  color: "#000",
  fontFamily: '"Arial Narrow", Arial, sans-serif',
  lineHeight: 1.05,
};

const centered: CSSProperties = {
  ...baseText,
  textAlign: "center",
};

const valueStyle: CSSProperties = {
  ...baseText,
  fontSize: "2.15mm",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

// Posições precisas baseadas no layout UNIP (em milímetros)
const POS = {
  folhas: { top: 13.2, left: 179.6, width: 19.8 },
  dataEmissao: { top: 26.9, left: 178.9, width: 21.2 },

  nome: { top: 27.6, left: 52.8, width: 123.4 },

  matricula: { top: 43.8, left: 7.2, width: 30.4 },
  dataNascimento: { top: 43.8, left: 40.8, width: 28.7 },
  cidadeNascimento: { top: 43.8, left: 73.0, width: 63.0 },
  estadoNascimento: { top: 43.8, left: 138.3, width: 10.8 },
  nacionalidade: { top: 43.8, left: 151.0, width: 48.0 },

  rg: { top: 56.4, left: 7.1, width: 42.6 },
  certificadoMilitar: { top: 56.4, left: 52.0, width: 28.5 },
  cpf: { top: 56.4, left: 83.3, width: 28.3 },
  tituloEleitor: { top: 56.4, left: 114.8, width: 30.0 },
  zona: { top: 56.4, left: 147.5, width: 18.8 },
  secao: { top: 56.4, left: 169.1, width: 29.7 },

  disciplinasVestibular: { top: 70.7, left: 7.2, width: 126.5 },
  formaIngresso: { top: 70.7, left: 137.1, width: 31.5 },
  realizacao: { top: 70.7, left: 171.8, width: 27.4 },

  curso: { top: 87.9, left: 7.4, width: 88.0 },
  codigoEmec: { top: 87.9, left: 98.5, width: 19.8 },
  reconhecimento: { top: 87.9, left: 121.2, width: 42.0 },
  cargaHoraria: { top: 87.9, left: 166.0, width: 33.0 },

  tabelaTop: 109.2,
  linhaAltura: 4.55,

  colunas: {
    periodo: { left: 3.8, width: 17.5 },
    codigo: { left: 21.5, width: 17.5 },
    descricao: { left: 39.1, width: 94.8 },
    ch: { left: 133.8, width: 12.6 },
    perLetivo: { left: 146.5, width: 18.3 },
    media: { left: 164.8, width: 17.4 },
    situacao: { left: 182.3, width: 22.5 },
  },

  observacoes: {
    top: 233.7,
    left: 4.0,
    width: 201.2,
    height: 16.2,
  },

  dataColacao: { top: 259.9, left: 3.7, width: 26.0 },
  dataExpDiploma: { top: 259.9, left: 30.0, width: 25.0 },
  codigoCurso: { top: 259.9, left: 55.6, width: 20.0 },
  dataConclusao: { top: 259.9, left: 76.3, width: 22.0 },
  titulo: { top: 259.9, left: 99.0, width: 26.4 },
  validacao: { top: 259.7, left: 126.0, width: 79.0 },

  vistos: { top: 270.9, left: 78.0, width: 47.0 },
  secretario: { top: 283.0, left: 118.6, width: 38.0 },
  reitor: { top: 283.0, left: 157.8, width: 38.0 },

  qr: { top: 247.4, left: 176.2, size: 19.2 },
};
function TextValue({
  value,
  top,
  left,
  width,
  align = "left",
  fontSize = "2.15mm",
  bold = false,
}: {
  value?: string | number | null;
  top: number;
  left: number;
  width: number;
  align?: "left" | "center" | "right";
  fontSize?: string;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        ...valueStyle,
        top: MM(top),
        left: MM(left),
        width: MM(width),
        textAlign: align,
        fontSize,
        fontWeight: bold ? 700 : 400,
      }}
    >
      {value || "—"}
    </div>
  );
}

export function HistoricoSuperior({ state }: Props) {
  const disciplinas = state.disciplinasSuperior ?? [];
  const maxLinhas = 25;

  return (
    <>
      <style>{`
        @page historico-unip-page {
          size: A4 portrait;
          margin: 0;
        }

        .historico-unip-a4 {
          page: historico-unip-page;
          position: relative !important;
          width: 210mm !important;
          min-width: 210mm !important;
          max-width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
          flex: 0 0 210mm !important;
          aspect-ratio: 210 / 297 !important;
          overflow: hidden !important;
          transform: none !important;
          box-sizing: border-box !important;
          page-break-before: always;
          page-break-after: always;
          break-before: page;
          break-after: page;
          break-inside: avoid;
        }

        @media print {
          .historico-unip-a4 {
            width: 210mm !important;
            min-width: 210mm !important;
            max-width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            transform: none !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      <div
        className="doc-sheet a4-portrait historico-unip-a4"
        style={{
          position: "relative",
          width: "210mm",
          minWidth: "210mm",
          maxWidth: "210mm",
          height: "297mm",
          minHeight: "297mm",
          maxHeight: "297mm",
          flex: "0 0 210mm",
          overflow: "hidden",
          background: "#fff",
          color: "#000",
          boxSizing: "border-box",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Imagem de fundo do histórico UNIP */}
        <img
          src="/images/historico-unip.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            width: "210mm",
            height: "297mm",
            objectFit: "fill",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        {/* TOPO DIREITO */}
        <TextValue value="1" {...POS.folhas} align="center" fontSize="2.1mm" />
        <TextValue
          value={state.dataEmissao}
          {...POS.dataEmissao}
          align="center"
          fontSize="1.95mm"
        />

        {/* NOME - destaque central */}
        <TextValue
          value={state.nomeAluno}
          {...POS.nome}
          align="center"
          fontSize="2.55mm"
          bold
        />

        {/* SEÇÃO 1: Dados Básicos */}
        <TextValue value={state.matricula} {...POS.matricula} fontSize="2.0mm" />
        <TextValue
          value={state.dataNasc}
          {...POS.dataNascimento}
          align="center"
          fontSize="2.0mm"
        />
        <TextValue
          value={state.cidadeNasc}
          {...POS.cidadeNascimento}
          align="center"
          fontSize="2.0mm"
        />
        <TextValue
          value={state.estadoNasc}
          {...POS.estadoNascimento}
          align="center"
          fontSize="2.0mm"
        />
        <TextValue
          value={state.nacionalidade}
          {...POS.nacionalidade}
          align="center"
          fontSize="2.0mm"
        />

        {/* SEÇÃO 2: Documentos */}
        <TextValue value={state.rg} {...POS.rg} fontSize="2.0mm" />
        <TextValue value="" {...POS.certificadoMilitar} align="center" fontSize="2.0mm" />
        <TextValue value={state.cpf} {...POS.cpf} align="center" fontSize="2.0mm" />
        <TextValue value="" {...POS.tituloEleitor} align="center" fontSize="2.0mm" />
        <TextValue value="" {...POS.zona} align="center" fontSize="2.0mm" />
        <TextValue value="" {...POS.secao} align="center" fontSize="2.0mm" />

        {/* SEÇÃO 3: Ingresso */}
        <TextValue value="" {...POS.disciplinasVestibular} align="center" fontSize="2.0mm" />
        <TextValue value="" {...POS.formaIngresso} align="center" fontSize="2.0mm" />
        <TextValue
          value={
            state.periodoInicio && state.periodoFim
              ? `${state.periodoInicio} a ${state.periodoFim}`
              : ""
          }
          {...POS.realizacao}
          align="center"
          fontSize="1.85mm"
        />

        {/* SEÇÃO 4: Curso */}
        <TextValue
          value={state.cursoSuperior}
          {...POS.curso}
          align="center"
          fontSize="2.2mm"
          bold
        />
        <TextValue value="" {...POS.codigoEmec} align="center" fontSize="2.0mm" />
        <TextValue
          value={
            [state.portariaMec, state.resolucao]
              .filter(Boolean)
              .join(" | ")
          }
          {...POS.reconhecimento}
          align="center"
          fontSize="1.75mm"
        />
        <TextValue value="" {...POS.cargaHoraria} align="center" fontSize="1.8mm" />

        {/* TABELA DE DISCIPLINAS */}
        {disciplinas.slice(0, maxLinhas).map((disciplina, index) => {
          const top = POS.tabelaTop + index * POS.linhaAltura;

          return (
            <div key={`${disciplina.codigo}-${index}`}>
              <TextValue
                value={disciplina.periodo}
                top={top}
                {...POS.colunas.periodo}
                align="center"
                fontSize="1.85mm"
              />
              <TextValue
                value={disciplina.codigo}
                top={top}
                {...POS.colunas.codigo}
                align="center"
                fontSize="1.85mm"
              />
              <TextValue
                value={disciplina.descricao}
                top={top}
                {...POS.colunas.descricao}
                fontSize="1.85mm"
              />
              <TextValue
                value={disciplina.ch}
                top={top}
                {...POS.colunas.ch}
                align="center"
                fontSize="1.85mm"
              />
              <TextValue
                value={disciplina.perLetivo}
                top={top}
                {...POS.colunas.perLetivo}
                align="center"
                fontSize="1.85mm"
              />
              <TextValue
                value={disciplina.media}
                top={top}
                {...POS.colunas.media}
                align="center"
                fontSize="1.85mm"
              />
              <TextValue
                value={disciplina.situacao}
                top={top}
                {...POS.colunas.situacao}
                align="center"
                fontSize="1.85mm"
                bold
              />
            </div>
          );
        })}

        {/* OBSERVAÇÕES */}
        <div
          style={{
            ...baseText,
            top: MM(POS.observacoes.top),
            left: MM(POS.observacoes.left),
            width: MM(POS.observacoes.width),
            height: MM(POS.observacoes.height),
            padding: "1.8mm 2.2mm",
            boxSizing: "border-box",
            fontSize: "1.85mm",
            whiteSpace: "pre-wrap",
            overflow: "hidden",
          }}
        >
          {state.observacoesHistorico}
        </div>

        {/* RODAPÉ - Datas e Informações */}
        <TextValue
          value={state.dataColacao}
          {...POS.dataColacao}
          align="center"
          fontSize="1.6mm"
        />
        <TextValue
          value={state.dataEmissao}
          {...POS.dataExpDiploma}
          align="center"
          fontSize="1.6mm"
        />
        <TextValue value="" {...POS.codigoCurso} align="center" fontSize="1.6mm" />
        <TextValue
          value={state.dataEmissao}
          {...POS.dataConclusao}
          align="center"
          fontSize="1.6mm"
        />
        <TextValue value={state.titulo} {...POS.titulo} align="center" fontSize="1.6mm" />

        {/* Bloco de Validação */}
        <div
          style={{
            ...baseText,
            top: MM(POS.validacao.top),
            left: MM(POS.validacao.left),
            width: MM(POS.validacao.width),
            fontSize: "1.45mm",
            lineHeight: 1.15,
          }}
        >
          <div>A autenticidade deste documento pode ser verificada em:</div>
          <div>{state.sedUrlBase || "https://www.unip.br/servicos/verificacao"}</div>
          <div>Número do documento: {state.codigoUnico || "—"}</div>
        </div>

        {/* QR Code */}
        <div
          style={{
            position: "absolute",
            zIndex: 3,
            top: MM(POS.qr.top),
            left: MM(POS.qr.left),
            width: MM(POS.qr.size),
            height: MM(POS.qr.size),
            display: "grid",
            placeItems: "center",
          }}
        >
          <QrBlock
            code={state.codigoUnico}
            sedUrlBase={state.sedUrlBase}
            size={74}
          />
        </div>

        {/* Assinaturas */}
        <div
          style={{
            ...centered,
            top: MM(POS.vistos.top),
            left: MM(POS.vistos.left),
            width: MM(POS.vistos.width),
            fontSize: "1.55mm",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Vistos
        </div>

        <div
          style={{
            ...centered,
            top: MM(POS.secretario.top),
            left: MM(POS.secretario.left),
            width: MM(POS.secretario.width),
            fontSize: "1.65mm",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {state.secretarioGeral || "—"}
        </div>

        <div
          style={{
            ...centered,
            top: MM(POS.reitor.top),
            left: MM(POS.reitor.left),
            width: MM(POS.reitor.width),
            fontSize: "1.65mm",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {state.reitor || "—"}
        </div>
      </div>
    </>
  );
}
