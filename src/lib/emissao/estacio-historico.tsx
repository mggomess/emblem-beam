import type { CSSProperties } from "react";
import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

type Props = { state: EmissaoState; page?: number; totalPages?: number };

export const HISTORICO_ESTACIO_LINHAS_POR_FOLHA = 32;

const GRAY_BAR = "#d6d6d6";
const HEAD_BAR = "#e8ecf5";
const BORDER = "#000";

function LabelValue({ label, value, style }: { label: string; value?: string; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", gap: "1mm", alignItems: "baseline", fontSize: "2.1mm", ...style }}>
      <span style={{ fontWeight: 400 }}>{label}</span>
      <span style={{ fontWeight: 600, borderBottom: "0.4px dotted #999", flex: 1, minHeight: "2.8mm" }}>{value || "\u00a0"}</span>
    </div>
  );
}

export function EstacioHistoricoSuperior({ state, page = 0, totalPages }: Props) {
  const all = state.disciplinasSuperior ?? [];
  const per = HISTORICO_ESTACIO_LINHAS_POR_FOLHA;
  const computedTotal = Math.max(1, Math.ceil(all.length / per) || 1);
  const total = totalPages ?? computedTotal;
  const offset = page * per;
  const disciplinas = all.slice(offset, offset + per);
  const linhasVazias = per - disciplinas.length;

  return (
    <div
      className="doc-sheet a4-portrait"
      style={{
        position: "relative",
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        background: "#fff",
        color: "#000",
        boxSizing: "border-box",
        padding: "7mm 8mm 6mm",
        fontFamily: "Arial, Helvetica, sans-serif",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Marca d'água Estácio */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          opacity: 0.08,
          fontSize: "40mm",
          color: "#1ea3d6",
          fontWeight: 700,
          fontStyle: "italic",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        Estácio
      </div>

      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "35mm 1fr 35mm", alignItems: "start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}>
          <div style={{ width: "14mm", height: "14mm", background: "#1ea3d6", transform: "rotate(45deg)", position: "relative" }}>
            <div style={{ position: "absolute", inset: "3mm", background: "#fff" }} />
            <div style={{ position: "absolute", inset: "5mm", background: "#1ea3d6" }} />
          </div>
          <div style={{ fontSize: "8mm", fontWeight: 700, fontStyle: "italic", color: "#111" }}>Estácio</div>
        </div>
        <div style={{ textAlign: "center", fontSize: "2.6mm", fontWeight: 700, paddingTop: "2mm" }}>
          <div>MINISTÉRIO DA EDUCAÇÃO</div>
          <div>SECRETARIA DE EDUCAÇÃO TECNOLÓGICA</div>
          <div>UNIVERSIDADE ESTÁCIO DE SÁ</div>
        </div>
        <div style={{ fontSize: "2.4mm", textAlign: "right", paddingTop: "8mm" }}>
          Folha: <span style={{ borderBottom: "1px solid #000", padding: "0 2mm" }}>{page + 1}</span>/
          <span style={{ borderBottom: "1px solid #000", padding: "0 2mm" }}>{total}</span>
        </div>
      </div>

      {/* HISTÓRICO ESCOLAR bordered */}
      <div style={{ border: `1px solid ${BORDER}`, marginTop: "3mm", padding: "1.2mm", textAlign: "center", fontSize: "3mm", fontWeight: 700 }}>
        HISTÓRICO ESCOLAR
      </div>

      {/* Nome / Matrícula / Situação */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 55mm 55mm", gap: "3mm", marginTop: "2mm" }}>
        <LabelValue label="Nome:" value={state.nomeAluno} />
        <LabelValue label="Matrícula:" value={state.matricula} />
        <LabelValue label="Situação:" value="Ativo" />
      </div>

      {/* Dados Pessoais banner */}
      <div style={{ background: GRAY_BAR, textAlign: "center", fontWeight: 700, padding: "1mm", marginTop: "2mm", fontSize: "2.4mm" }}>
        Dados Pessoais
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6mm", marginTop: "1.5mm" }}>
        <div>
          <LabelValue label="CPF:" value={state.cpf} />
          <LabelValue label="RG/RNE/CNH:" value={state.rg} />
          <LabelValue label="País:" value="BRASIL" />
          <LabelValue label="Naturalidade:" value={state.cidadeNasc} />
        </div>
        <div>
          <LabelValue label="Data de Nasc.:" value={state.dataNasc} />
          <LabelValue label="Data Emissão:" value={state.dataEmissao} />
          <LabelValue label="Nacionalidade:" value={state.nacionalidade} />
        </div>
      </div>

      {/* Dados Acadêmicos banner */}
      <div style={{ background: GRAY_BAR, textAlign: "center", fontWeight: 700, padding: "1mm", marginTop: "2mm", fontSize: "2.4mm" }}>
        Dados Acadêmicos
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6mm", marginTop: "1.5mm" }}>
        <div>
          <LabelValue label="Data de Matrícula:" value={state.periodoInicio} />
          <LabelValue label="Curso:" value={state.cursoSuperior} />
        </div>
        <div>
          <LabelValue label="Expedição do Diploma:" value={state.dataEmissao} />
          <LabelValue label="Periodicidade:" value="Semestral" />
        </div>
      </div>
      <div style={{ marginTop: "1.5mm" }}>
        <LabelValue label="Autorização:" value={state.portariaMec} />
        <LabelValue label="Reconhecimento:" value={state.resolucao || state.reconhecimentoPortaria} />
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: "2mm", paddingTop: "1.5mm", display: "grid", gridTemplateColumns: "1fr 1fr 35mm", gap: "4mm" }}>
        <LabelValue label="Processo Seletivo:" value={state.formaIngresso} />
        <LabelValue label="Ano/Semestre:" value={state.mesAnoVestibular || `${state.periodoInicio} - ${state.periodoFim}`} />
        <LabelValue label="Início:" value={state.periodoInicio} />
      </div>

      {/* Tabela */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "2mm",
          fontSize: "1.9mm",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "9%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "44%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "11%" }} />
        </colgroup>
        <thead>
          <tr style={{ background: HEAD_BAR }}>
            {["Período\nAcadêmico", "Código", "Disciplinas", "Tipo", "Carga\nHorária", "Grau", "Situação\nFinal"].map((h) => (
              <th
                key={h}
                style={{
                  border: `1px solid ${BORDER}`,
                  padding: "1mm 0.5mm",
                  fontWeight: 400,
                  fontSize: "1.9mm",
                  whiteSpace: "pre-line",
                  lineHeight: 1.1,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((d, i) => (
            <tr key={`d-${offset + i}`} style={{ height: "4.5mm" }}>
              <td style={estCell("center")}>{d.periodo}</td>
              <td style={estCell("center")}>{d.codigo}</td>
              <td style={estCell("left")}>{d.descricao}</td>
              <td style={estCell("center")}>{d.perLetivo || "OB"}</td>
              <td style={estCell("center")}>{d.ch}</td>
              <td style={estCell("center")}>{d.media}</td>
              <td style={{ ...estCell("center"), fontWeight: 700 }}>{d.situacao}</td>
            </tr>
          ))}
          {Array.from({ length: linhasVazias }).map((_, i) => (
            <tr key={`e-${i}`} style={{ height: "4.5mm" }}>
              {Array.from({ length: 7 }).map((_, j) => (
                <td key={j} style={estCell("center")}>&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Observações */}
      {state.observacoesHistorico && (
        <div style={{ marginTop: "2mm", border: `1px solid ${BORDER}`, padding: "1.5mm", fontSize: "1.8mm", minHeight: "10mm", whiteSpace: "pre-wrap" }}>
          <b>Observações: </b>{state.observacoesHistorico}
        </div>
      )}

      {/* Rodapé */}
      <div style={{ position: "absolute", bottom: "8mm", left: "8mm", right: "8mm", display: "grid", gridTemplateColumns: "60mm 1fr 30mm", gap: "3mm", alignItems: "end" }}>
        <div style={{ border: `1px solid ${BORDER}`, padding: "2mm", textAlign: "center", fontSize: "2.2mm", fontWeight: 700 }}>
          FACULDADE ESTÁCIO<br />
          {(state.cidadeEmissao || "BELO HORIZONTE").toUpperCase()} - {state.uf}
        </div>
        <div style={{ textAlign: "center", fontSize: "1.7mm", lineHeight: 1.4 }}>
          <div>Autenticidade: {state.sedUrlBase || "https://validar.sedu.gov.br"}/verificar/{state.codigoUnico || "—"}</div>
          <div>Nº do documento: <b>{state.codigoUnico || "—"}</b></div>
          <div style={{ marginTop: "3mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6mm" }}>
            <div style={{ borderTop: "1px solid #000", paddingTop: 1 }}>{state.secretarioGeral} — Secretário Geral</div>
            <div style={{ borderTop: "1px solid #000", paddingTop: 1 }}>{state.reitor} — Reitor</div>
          </div>
        </div>
        <div style={{ display: "grid", placeItems: "center" }}>
          <QrBlock code={state.codigoUnico} sedUrlBase={state.sedUrlBase} size={78} />
        </div>
      </div>
    </div>
  );
}

function estCell(align: "left" | "center" | "right"): CSSProperties {
  return {
    border: `1px solid ${BORDER}`,
    padding: "0.6mm 1mm",
    textAlign: align,
    verticalAlign: "middle",
  };
}
