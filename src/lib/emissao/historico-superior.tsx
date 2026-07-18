import type { CSSProperties } from "react";
import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

type Props = { state: EmissaoState; page?: number; totalPages?: number };

export const HISTORICO_UNIP_LINHAS_POR_FOLHA = 27;

const MM = (v: number) => `${v}mm`;

const baseText: CSSProperties = {
  position: "absolute",
  zIndex: 2,
  color: "#000",
  fontFamily: '"Arial Narrow", Arial, sans-serif',
  lineHeight: 1.05,
};

/**
 * POS_UNIP — coordenadas em milímetros, calibradas sobre historico-unip.png
 * (1085×1450 px → 210×297 mm). Cada caixa foi mapeada pelas bordas internas
 * detectadas no PNG (escalas x=0.1935 mm/px, y=0.2048 mm/px).
 */
const POS_UNIP = {
  folhas:        { top: 14.5, left: 178.0, width: 22.0 },
  dataEmissao:   { top: 28.0, left: 178.0, width: 22.0 },

  nome:          { top: 30.5, left: 55.0,  width: 122.0 },

  matricula:     { top: 43.5, left: 5.0,   width: 34.0 },
  dataNasc:      { top: 43.5, left: 40.5,  width: 30.0 },
  cidadeNasc:    { top: 43.5, left: 74.0,  width: 62.0 },
  estadoNasc:    { top: 43.5, left: 137.5, width: 12.0 },
  nacionalidade: { top: 43.5, left: 151.5, width: 47.0 },

  rg:            { top: 60.0, left: 5.0,   width: 45.0 },
  certMilitar:   { top: 60.0, left: 51.5,  width: 30.0 },
  cpf:           { top: 60.0, left: 83.0,  width: 30.0 },
  tituloEleitor: { top: 60.0, left: 114.5, width: 32.0 },
  zona:          { top: 60.0, left: 148.0, width: 19.0 },
  secao:         { top: 60.0, left: 168.5, width: 30.0 },

  discVestibular:{ top: 80.5, left: 5.0,   width: 128.0 },
  formaIngresso: { top: 80.5, left: 135.0, width: 33.0 },
  realizacao:    { top: 80.5, left: 170.0, width: 28.0 },

  curso:         { top: 97.0, left: 5.0,   width: 90.0 },
  codigoEmec:    { top: 97.0, left: 97.0,  width: 22.0 },
  reconhecimento:{ top: 95.5, left: 121.0, width: 46.0, height: 10.5 },
  cargaHoraria:  { top: 95.5, left: 168.0, width: 32.0, height: 10.5 },

  tabelaTop: 119.0,
  linhaAltura: 4.5,
  maxLinhas: 27,

  colunas: {
    periodo:   { left: 3.3,   width: 17.2 },
    codigo:    { left: 20.5,  width: 17.2 },
    descricao: { left: 37.7,  width: 93.9 },
    ch:        { left: 131.6, width: 12.8 },
    perLetivo: { left: 144.4, width: 19.1 },
    media:     { left: 163.5, width: 16.9 },
    situacao:  { left: 180.4, width: 25.9 },
  },

  observacoes:   { top: 244.0, left: 5.0,  width: 200.0, height: 15.5 },

  dataColacao:   { top: 262.5, left: 4.0,   width: 26.0 },
  dataExpDip:    { top: 262.5, left: 31.0,  width: 26.0 },
  codigoCurso:   { top: 262.5, left: 58.0,  width: 20.0 },
  dataConclCurso:{ top: 262.5, left: 79.0,  width: 23.0 },
  titulo:        { top: 262.5, left: 103.0, width: 28.0 },
  validacao:     { top: 261.5, left: 132.0, width: 78.0 },

  qr:            { top: 273.0, left: 180.5, size: 22.0 },
  vistosLabelTop:270.5,
  secretario:    { top: 282.5, left: 78.0,  width: 55.0 },
  reitor:        { top: 282.5, left: 138.0, width: 42.0 },
} as const;

function T({
  value,
  top,
  left,
  width,
  align = "center",
  fontSize = "2.05mm",
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
        ...baseText,
        top: MM(top),
        left: MM(left),
        width: MM(width),
        textAlign: align,
        fontSize,
        fontWeight: bold ? 700 : 400,
        display: "flex",
        alignItems: "center",
        justifyContent:
          align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        height: "3.6mm",
        lineHeight: "3.6mm",
      }}
    >
      {value ?? ""}
    </div>
  );
}

export function HistoricoSuperior({ state }: Props) {
  const disciplinas = state.disciplinasSuperior ?? [];
  const P = POS_UNIP;

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
        boxSizing: "border-box",
        padding: 0,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <img
        src="/images/historico-unip.png"
        alt=""
        aria-hidden
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

      <T value="1" {...P.folhas} fontSize="2.2mm" bold />
      <T value={state.dataEmissao} {...P.dataEmissao} fontSize="1.95mm" />

      <T value={state.nomeAluno} {...P.nome} fontSize="2.6mm" bold />

      <T value={state.matricula} {...P.matricula} />
      <T value={state.dataNasc} {...P.dataNasc} />
      <T value={state.cidadeNasc} {...P.cidadeNasc} />
      <T value={state.estadoNasc} {...P.estadoNasc} />
      <T value={state.nacionalidade} {...P.nacionalidade} />

      <T value={state.rg} {...P.rg} />
      <T value="" {...P.certMilitar} />
      <T value={state.cpf} {...P.cpf} />
      <T value="" {...P.tituloEleitor} />
      <T value="" {...P.zona} />
      <T value="" {...P.secao} />

      <T value="" {...P.discVestibular} />
      <T value="" {...P.formaIngresso} />
      <T
        value={
          state.periodoInicio && state.periodoFim
            ? `${state.periodoInicio} a ${state.periodoFim}`
            : state.periodoInicio || state.periodoFim || ""
        }
        {...P.realizacao}
        fontSize="1.85mm"
      />

      <T value={state.cursoSuperior} {...P.curso} fontSize="2.2mm" bold />
      <T value="" {...P.codigoEmec} />

      <div
        style={{
          ...baseText,
          top: MM(P.reconhecimento.top),
          left: MM(P.reconhecimento.left),
          width: MM(P.reconhecimento.width),
          height: MM(P.reconhecimento.height),
          padding: "0 1mm",
          fontSize: "1.75mm",
          lineHeight: 1.25,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ paddingLeft: "18mm" }}>{state.portariaMec}</div>
        <div style={{ paddingLeft: "17mm" }}>{state.resolucao}</div>
      </div>

      <div
        style={{
          ...baseText,
          top: MM(P.cargaHoraria.top),
          left: MM(P.cargaHoraria.left),
          width: MM(P.cargaHoraria.width),
          height: MM(P.cargaHoraria.height),
          padding: "0 1mm",
          fontSize: "1.85mm",
          lineHeight: 1.3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "right",
        }}
      >
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </div>

      {disciplinas.slice(0, P.maxLinhas).map((d, i) => {
        const top = P.tabelaTop + i * P.linhaAltura;
        return (
          <div key={`${d.codigo}-${i}`}>
            <T value={d.periodo}   top={top} {...P.colunas.periodo}   fontSize="1.85mm" />
            <T value={d.codigo}    top={top} {...P.colunas.codigo}    fontSize="1.85mm" />
            <T value={d.descricao} top={top} {...P.colunas.descricao} fontSize="1.85mm" align="left" />
            <T value={d.ch}        top={top} {...P.colunas.ch}        fontSize="1.85mm" />
            <T value={d.perLetivo} top={top} {...P.colunas.perLetivo} fontSize="1.85mm" />
            <T value={d.media}     top={top} {...P.colunas.media}     fontSize="1.85mm" />
            <T value={d.situacao}  top={top} {...P.colunas.situacao}  fontSize="1.85mm" bold />
          </div>
        );
      })}

      <div
        style={{
          ...baseText,
          top: MM(P.observacoes.top),
          left: MM(P.observacoes.left),
          width: MM(P.observacoes.width),
          height: MM(P.observacoes.height),
          padding: "1mm 1.5mm",
          boxSizing: "border-box",
          fontSize: "1.85mm",
          whiteSpace: "pre-wrap",
          overflow: "hidden",
        }}
      >
        {state.observacoesHistorico}
      </div>

      <T value={state.dataColacao}   {...P.dataColacao}    fontSize="1.7mm" />
      <T value={state.dataEmissao}   {...P.dataExpDip}     fontSize="1.7mm" />
      <T value=""                    {...P.codigoCurso}    fontSize="1.7mm" />
      <T value={state.dataEmissao}   {...P.dataConclCurso} fontSize="1.7mm" />
      <T value={state.titulo}        {...P.titulo}         fontSize="1.7mm" />

      <div
        style={{
          ...baseText,
          top: MM(P.validacao.top),
          left: MM(P.validacao.left),
          width: MM(P.validacao.width),
          fontSize: "1.5mm",
          lineHeight: 1.2,
        }}
      >
        <div>{state.sedUrlBase || "https://www.unip.br/servicos/verificacao"}</div>
        <div>Nº doc.: {state.codigoUnico || "—"}</div>
      </div>

      <div
        style={{
          position: "absolute",
          zIndex: 3,
          top: MM(P.qr.top),
          left: MM(P.qr.left),
          width: MM(P.qr.size),
          height: MM(P.qr.size),
          display: "grid",
          placeItems: "center",
        }}
      >
        <QrBlock code={state.codigoUnico} sedUrlBase={state.sedUrlBase} size={72} />
      </div>

      <T value={state.secretarioGeral} {...P.secretario} fontSize="1.7mm" bold />
      <T value={state.reitor}          {...P.reitor}     fontSize="1.7mm" bold />
    </div>
  );
}
