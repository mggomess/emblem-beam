import type { CSSProperties } from "react";
import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

type Props = { state: EmissaoState; page?: number; totalPages?: number };

export const HISTORICO_ESTACIO_LINHAS_POR_FOLHA = 40;

const MM = (v: number) => `${v}mm`;

const baseText: CSSProperties = {
  position: "absolute",
  zIndex: 2,
  color: "#000",
  fontFamily: "Arial, Helvetica, sans-serif",
  lineHeight: 1.05,
};

/**
 * POS_ESTACIO — coordenadas em milímetros, calibradas sobre historico-estacio.png
 * (1086×1448 px → 210×297 mm). Escalas: x=0.1934 mm/px, y=0.2051 mm/px.
 * As colunas foram extraídas das bordas verticais da grade (x=20,116,213,
 * 869,942,993,1063 px) e as linhas da tabela do intervalo y=562→1329 (≈29 px
 * por linha ≈ 5,95 mm).
 */
const POS_ESTACIO = {
  folha:         { top: 20.0, left: 183.0, width: 24.0 },

  nome:          { top: 41.0, left: 15.0,  width: 60.0 },
  matricula:     { top: 41.0, left: 92.0,  width: 45.0 },
  situacao:      { top: 41.0, left: 152.0, width: 55.0 },

  cpf:           { top: 54.4, left: 15.0,  width: 60.0 },
  rg:            { top: 59.4, left: 25.0,  width: 60.0 },
  pais:          { top: 64.5, left: 15.0,  width: 60.0 },
  naturalidade:  { top: 69.5, left: 25.0,  width: 55.0 },

  dataNasc:      { top: 54.4, left: 147.0, width: 55.0 },
  dataEmissao:   { top: 59.4, left: 147.0, width: 55.0 },
  nacionalidade: { top: 64.5, left: 147.0, width: 55.0 },

  dataMatricula: { top: 81.5, left: 33.0,  width: 55.0 },
  curso:         { top: 87.0, left: 15.0,  width: 130.0 },
  expDiploma:    { top: 81.5, left: 158.0, width: 50.0 },
  periodicidade: { top: 87.0, left: 148.0, width: 60.0 },
  autorizacao:   { top: 95.0, left: 25.0,  width: 180.0 },
  reconhecimento:{ top: 100.0,left: 27.0,  width: 180.0 },

  procSeletivo:  { top: 107.5, left: 32.0, width: 130.0 },
  anoSemestre:   { top: 107.5, left: 130.0,width: 65.0 },
  inicio:        { top: 107.5, left: 190.0,width: 20.0 },

  tabelaTop: 118.5,
  linhaAltura: 5.95,
  maxLinhas: 40,

  colunas: {
    periodo:   { left: 3.9,   width: 18.6 },
    codigo:    { left: 22.5,  width: 18.7 },
    descricao: { left: 41.2,  width: 126.9 },
    perLetivo: { left: 168.1, width: 14.1 },
    ch:        { left: 182.2, width: 9.9 },
    media:     { left: 192.1, width: 6.8 },
    situacao:  { left: 198.9, width: 6.8 },
  },

  observacoes:   { top: 276.5, left: 42.0, width: 100.0, height: 12.0 },

  dataColacao:   { top: 279.0, left: 44.0, width: 30.0 },
  dataExpDip:    { top: 279.0, left: 76.0, width: 30.0 },
  codigoCurso:   { top: 279.0, left: 108.0,width: 22.0 },
  dataConclCurso:{ top: 279.0, left: 131.0,width: 22.0 },
  titulo:        { top: 285.0, left: 44.0, width: 60.0 },
  validacao:     { top: 285.0, left: 108.0,width: 65.0 },

  qr:            { top: 277.5, left: 178.0, size: 20.0 },

  secretario:    { top: 291.5, left: 44.0,  width: 70.0 },
  reitor:        { top: 291.5, left: 120.0, width: 70.0 },
} as const;

function T({
  value,
  top,
  left,
  width,
  align = "left",
  fontSize = "2.0mm",
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
        height: "4mm",
        lineHeight: "4mm",
      }}
    >
      {value ?? ""}
    </div>
  );
}

export function EstacioHistoricoSuperior({ state, page = 0, totalPages }: Props) {
  const P = POS_ESTACIO;
  const all = state.disciplinasSuperior ?? [];
  const per = P.maxLinhas;
  const computedTotal = Math.max(1, Math.ceil(all.length / per) || 1);
  const total = totalPages ?? computedTotal;
  const offset = page * per;
  const disciplinas = all.slice(offset, offset + per);

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
        src="/images/historico-estacio.png"
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

      <T value={`${page + 1}/${total}`} {...P.folha} align="center" fontSize="2.0mm" />

      <T value={state.nomeAluno} {...P.nome} bold />
      <T value={state.matricula} {...P.matricula} />
      <T value="" {...P.situacao} />

      <T value={state.cpf} {...P.cpf} />
      <T value={state.rg} {...P.rg} />
      <T value="BRASIL" {...P.pais} />
      <T value={state.cidadeNasc} {...P.naturalidade} />

      <T value={state.dataNasc} {...P.dataNasc} />
      <T value={state.dataEmissao} {...P.dataEmissao} />
      <T value={state.nacionalidade} {...P.nacionalidade} />

      <T value="" {...P.dataMatricula} />
      <T value={state.cursoSuperior} {...P.curso} bold />
      <T value={state.dataEmissao} {...P.expDiploma} />
      <T value="Semestral" {...P.periodicidade} />
      <T value={state.portariaMec} {...P.autorizacao} fontSize="1.85mm" />
      <T value={state.resolucao} {...P.reconhecimento} fontSize="1.85mm" />

      <T value="" {...P.procSeletivo} />
      <T
        value={
          state.periodoInicio && state.periodoFim
            ? `${state.periodoInicio} - ${state.periodoFim}`
            : state.periodoInicio || state.periodoFim || ""
        }
        {...P.anoSemestre}
      />
      <T value={state.periodoInicio} {...P.inicio} align="center" />

      {disciplinas.slice(0, P.maxLinhas).map((d, i) => {
        const top = P.tabelaTop + i * P.linhaAltura;
        return (
          <div key={`${d.codigo}-${i}`}>
            <T value={d.periodo}   top={top} {...P.colunas.periodo}   align="center" fontSize="1.75mm" />
            <T value={d.codigo}    top={top} {...P.colunas.codigo}    align="center" fontSize="1.75mm" />
            <T value={d.descricao} top={top} {...P.colunas.descricao} align="left"   fontSize="1.75mm" />
            <T value={d.perLetivo} top={top} {...P.colunas.perLetivo} align="center" fontSize="1.75mm" />
            <T value={d.ch}        top={top} {...P.colunas.ch}        align="center" fontSize="1.75mm" />
            <T value={d.media}     top={top} {...P.colunas.media}     align="center" fontSize="1.75mm" />
            <T value={d.situacao}  top={top} {...P.colunas.situacao}  align="center" fontSize="1.75mm" bold />
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
          padding: "0.8mm 1.2mm",
          boxSizing: "border-box",
          fontSize: "1.8mm",
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
      <T value={state.titulo}        {...P.titulo}         fontSize="1.7mm" bold />

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
        <div>{state.sedUrlBase || "https://validar.sedu.gov.br"}</div>
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
        <QrBlock code={state.codigoUnico} sedUrlBase={state.sedUrlBase} size={68} />
      </div>

      <T value={state.secretarioGeral} {...P.secretario} align="center" fontSize="1.7mm" bold />
      <T value={state.reitor}          {...P.reitor}     align="center" fontSize="1.7mm" bold />
    </div>
  );
}
