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

const POS = {
  nome: { top: 27.1, left: 53.5, width: 121.2, height: 7.2 },
  folhas: { top: 12.5, left: 179.2, width: 20.6, height: 8.1 },
  dataEmissao: { top: 26.0, left: 179.0, width: 21.0, height: 8.0 },

  matricula: { top: 42.6, left: 7.4, width: 31.7 },
  dataNascimento: { top: 42.6, left: 41.7, width: 29.4 },
  cidadeNascimento: { top: 42.6, left: 74.1, width: 61.5 },
  estadoNascimento: { top: 42.6, left: 137.2, width: 11.5 },
  nacionalidade: { top: 42.6, left: 151.0, width: 49.0 },

  rg: { top: 55.2, left: 7.3, width: 42.5 },
  certificadoMilitar: { top: 55.2, left: 52.2, width: 28.7 },
  cpf: { top: 55.2, left: 83.5, width: 28.7 },
  tituloEleitor: { top: 55.2, left: 114.9, width: 30.3 },
  zona: { top: 55.2, left: 147.7, width: 19.2 },
  secao: { top: 55.2, left: 169.5, width: 30.3 },

  disciplinasVestibular: { top: 69.4, left: 7.5, width: 126.4 },
  formaIngresso: { top: 69.4, left: 137.0, width: 31.9 },
  realizacao: { top: 69.4, left: 172.0, width: 27.7 },

  curso: { top: 86.9, left: 7.5, width: 88.7 },
  codigoEmec: { top: 86.9, left: 98.8, width: 20.6 },
  reconhecimento: { top: 86.9, left: 122.0, width: 41.4 },
  cargaHoraria: { top: 86.9, left: 166.2, width: 33.8 },

  tabelaTop: 108.1,
  linhaAltura: 4.75,
  colunas: {
    periodo: { left: 3.9, width: 17.7 },
    codigo: { left: 21.6, width: 17.6 },
    descricao: { left: 39.2, width: 94.4 },
    ch: { left: 133.6, width: 13.0 },
    perLetivo: { left: 146.6, width: 18.5 },
    media: { left: 165.1, width: 17.8 },
    situacao: { left: 182.9, width: 23.0 },
  },

  observacoes: { top: 232.5, left: 4.3, width: 201.5, height: 17.0 },

  dataColacao: { top: 259.1, left: 3.8, width: 26.1 },
  dataExpDiploma: { top: 259.1, left: 30.1, width: 25.2 },
  codigoCurso: { top: 259.1, left: 55.7, width: 20.6 },
  dataConclusao: { top: 259.1, left: 76.5, width: 22.4 },
  titulo: { top: 259.1, left: 99.2, width: 26.7 },
  validacao: { top: 259.1, left: 126.3, width: 79.2 },

  vistos: { top: 270.3, left: 78.0, width: 47.0 },
  secretario: { top: 283.4, left: 119.0, width: 38.0 },
  reitor: { top: 283.4, left: 158.0, width: 38.0 },
  qr: { top: 247.2, left: 176.6, size: 19.5 },
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
    <div
      className="doc-sheet a4-portrait"
      style={{
        position: "relative",
        width: "210mm",
        height: "297mm",
        overflow: "hidden",
        background: "#fff",
        color: "#000",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
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

      <TextValue
        value={state.nomeAluno}
        {...POS.nome}
        align="center"
        fontSize="2.55mm"
        bold
      />

      <TextValue value="1" {...POS.folhas} align="center" fontSize="2.1mm" />
      <TextValue
        value={state.dataEmissao}
        {...POS.dataEmissao}
        align="center"
        fontSize="1.95mm"
      />

      <TextValue value={state.matricula} {...POS.matricula} />
      <TextValue value={state.dataNasc} {...POS.dataNascimento} align="center" />
      <TextValue value={state.cidadeNasc} {...POS.cidadeNascimento} align="center" />
      <TextValue value={state.estadoNasc} {...POS.estadoNascimento} align="center" />
      <TextValue value={state.nacionalidade} {...POS.nacionalidade} align="center" />

      <TextValue value={state.rg} {...POS.rg} />
      <TextValue value="" {...POS.certificadoMilitar} align="center" />
      <TextValue value={state.cpf} {...POS.cpf} align="center" />
      <TextValue value="" {...POS.tituloEleitor} align="center" />
      <TextValue value="" {...POS.zona} align="center" />
      <TextValue value="" {...POS.secao} align="center" />

      <TextValue value="" {...POS.disciplinasVestibular} align="center" />
      <TextValue value="" {...POS.formaIngresso} align="center" />
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

      <TextValue
        value={state.cursoSuperior}
        {...POS.curso}
        align="center"
        fontSize="2.2mm"
        bold
      />
      <TextValue value="" {...POS.codigoEmec} align="center" />
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
      <TextValue
        value=""
        {...POS.cargaHoraria}
        align="center"
        fontSize="1.8mm"
      />

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
  );
}
