import type { CSSProperties, ReactNode } from "react";
import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

const PAGE_W = 1085;
const PAGE_H = 1450;

const pxX = (value: number) => `${(value / PAGE_W) * 100}%`;
const pxY = (value: number) => `${(value / PAGE_H) * 100}%`;

const absoluteText: CSSProperties = {
  position: "absolute",
  zIndex: 2,
  margin: 0,
  color: "#111",
  lineHeight: 1.1,
  overflow: "hidden",
  boxSizing: "border-box",
};

const valueOrDash = (value?: string | null): ReactNode =>
  value?.trim() ? value : "—";

/** Histórico Escolar UNIP, com imagem fixa de fundo e dados dinâmicos sobrepostos. */
export function HistoricoSuperior({ state }: { state: EmissaoState }) {
  const disciplinas = state.disciplinasSuperior ?? [];

  return (
    <div
      className="doc-sheet a4-portrait relative overflow-hidden bg-white font-sans-doc"
      style={{
        position: "relative",
        width: "210mm",
        height: "297mm",
        padding: 0,
        overflow: "hidden",
        backgroundColor: "#fff",
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
          width: "100%",
          height: "100%",
          objectFit: "fill",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Folhas e data de emissão */}
      <div
        style={{
          ...absoluteText,
          top: pxY(66),
          left: pxX(912),
          width: pxX(95),
          height: pxY(27),
          textAlign: "center",
          fontSize: "2.45mm",
          fontWeight: 600,
        }}
      >
        1/1
      </div>

      <div
        style={{
          ...absoluteText,
          top: pxY(111),
          left: pxX(908),
          width: pxX(99),
          height: pxY(28),
          textAlign: "center",
          fontSize: "2.35mm",
          fontWeight: 600,
        }}
      >
        {valueOrDash(state.dataEmissao)}
      </div>

      {/* Nome */}
      <div
        style={{
          ...absoluteText,
          top: pxY(122),
          left: pxX(286),
          width: pxX(608),
          height: pxY(30),
          textAlign: "center",
          fontSize: "3.05mm",
          fontWeight: 700,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {valueOrDash(state.nomeAluno)}
      </div>

      {/* Dados superiores */}
      <FieldText x={34} y={189} w={142} h={26} value={state.matricula} />
      <FieldText x={194} y={189} w={145} h={26} value={state.dataNasc} />
      <FieldText x={359} y={189} w={334} h={26} value={state.cidadeNasc} />
      <FieldText x={708} y={189} w={64} h={26} value={state.estadoNasc} />
      <FieldText x={786} y={189} w={221} h={26} value={state.nacionalidade} />

      <FieldText x={34} y={257} w={214} h={26} value={state.rg} />
      <FieldText x={265} y={257} w={143} h={26} value={undefined} />
      <FieldText x={423} y={257} w={139} h={26} value={state.cpf} />
      <FieldText x={580} y={257} w={172} h={26} value={undefined} />
      <FieldText x={770} y={257} w={105} h={26} value={undefined} />
      <FieldText x={891} y={257} w={116} h={26} value={undefined} />

      <FieldText x={34} y={336} w={656} h={27} value={undefined} />
      <FieldText x={707} y={336} w={167} h={27} value={undefined} />
      <FieldText x={892} y={336} w={115} h={27} value={undefined} />

      <FieldText x={34} y={408} w={461} h={39} value={state.cursoSuperior} align="left" />
      <FieldText x={511} y={408} w={95} h={39} value={undefined} />

      <div
        style={{
          ...absoluteText,
          top: pxY(406),
          left: pxX(621),
          width: pxX(229),
          height: pxY(50),
          fontSize: "2.35mm",
          lineHeight: 1.25,
          padding: "0.4mm 1mm",
        }}
      >
        <div>{valueOrDash(state.portariaMec)}</div>
        <div>{valueOrDash(state.resolucao)}</div>
      </div>

      <div
        style={{
          ...absoluteText,
          top: pxY(407),
          left: pxX(866),
          width: pxX(140),
          height: pxY(52),
          fontSize: "2.35mm",
          lineHeight: 1.35,
          padding: "0.4mm 1mm",
        }}
      >
        <div>Exigida: {valueOrDash(String(state.cargaHorariaExigida ?? ""))}</div>
        <div>Cumprida: {valueOrDash(String(state.cargaHorariaCumprida ?? ""))}</div>
      </div>

      {/* Disciplinas */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          top: pxY(566),
          left: pxX(31),
          width: pxX(975),
          height: pxY(560),
          overflow: "hidden",
        }}
      >
        {disciplinas.slice(0, 38).map((d, index) => (
          <div
            key={`${d.codigo}-${index}`}
            style={{
              display: "grid",
              gridTemplateColumns: "72px 89px 493px 67px 96px 89px 115px",
              minHeight: "14px",
              alignItems: "center",
              fontSize: "2.15mm",
              lineHeight: 1.05,
              color: "#111",
              marginBottom: "1px",
            }}
          >
            <span style={{ textAlign: "center" }}>{d.periodo}</span>
            <span style={{ textAlign: "center" }}>{d.codigo}</span>
            <span style={{ textAlign: "left", paddingLeft: "1.5mm" }}>{d.descricao}</span>
            <span style={{ textAlign: "center" }}>{d.ch}</span>
            <span style={{ textAlign: "center" }}>{d.perLetivo}</span>
            <span style={{ textAlign: "center" }}>{d.media}</span>
            <span style={{ textAlign: "center", fontWeight: 700 }}>{d.situacao}</span>
          </div>
        ))}
      </div>

      {/* Observações */}
      <div
        style={{
          ...absoluteText,
          top: pxY(1176),
          left: pxX(24),
          width: pxX(976),
          height: pxY(80),
          fontSize: "2.35mm",
          lineHeight: 1.2,
          whiteSpace: "pre-wrap",
          padding: "1mm 1.5mm",
        }}
      >
        {state.observacoesHistorico}
      </div>

      {/* Rodapé */}
      <FieldText x={28} y={1298} w={118} h={25} value={state.dataColacao} />
      <FieldText x={155} y={1298} w={115} h={25} value={state.dataEmissao} />
      <FieldText x={282} y={1298} w={99} h={25} value={undefined} />
      <FieldText x={395} y={1298} w={106} h={25} value={state.dataColacao} />
      <FieldText x={511} y={1298} w={128} h={25} value={state.titulo} />

      <div
        style={{
          position: "absolute",
          zIndex: 3,
          top: pxY(1256),
          left: pxX(873),
          width: pxX(105),
          height: pxY(105),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <QrBlock code={state.codigoUnico} sedUrlBase={state.sedUrlBase} size={84} />
      </div>

      <div
        style={{
          ...absoluteText,
          top: pxY(1374),
          left: pxX(440),
          width: pxX(170),
          height: pxY(26),
          textAlign: "center",
          fontSize: "2.15mm",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {valueOrDash(state.secretarioGeral)}
      </div>

      <div
        style={{
          ...absoluteText,
          top: pxY(1374),
          left: pxX(724),
          width: pxX(170),
          height: pxY(26),
          textAlign: "center",
          fontSize: "2.15mm",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {valueOrDash(state.reitor)}
      </div>
    </div>
  );
}

type FieldTextProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  value?: string | null;
  align?: "left" | "center" | "right";
};

function FieldText({ x, y, w, h, value, align = "center" }: FieldTextProps) {
  return (
    <div
      style={{
        ...absoluteText,
        top: pxY(y),
        left: pxX(x),
        width: pxX(w),
        height: pxY(h),
        display: "flex",
        alignItems: "center",
        justifyContent:
          align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        textAlign: align,
        fontSize: "2.45mm",
        fontWeight: 600,
        padding: align === "left" ? "0 1.5mm" : "0 0.8mm",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {valueOrDash(value)}
    </div>
  );
}
