import type { CSSProperties, ReactNode } from "react";
import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

type Props = { state: EmissaoState; page?: number; totalPages?: number };

export const HISTORICO_UNIP_LINHAS_POR_FOLHA = 27;

const BLUE = "#0d6fbf";
const LABEL_BG = "#e6f2fb";
const LABEL_COLOR = "#0d6fbf";

const boxBase: CSSProperties = {
  border: `1.2px solid ${BLUE}`,
  borderRadius: 6,
  position: "relative",
  background: "#fff",
  boxSizing: "border-box",
};

function Field({
  label,
  value,
  style,
  valueStyle,
  labelAlign = "center",
}: {
  label: string;
  value?: ReactNode;
  style?: CSSProperties;
  valueStyle?: CSSProperties;
  labelAlign?: "left" | "center" | "right";
}) {
  return (
    <div style={{ ...boxBase, padding: "3.4mm 1.6mm 1mm", minHeight: "10mm", ...style }}>
      <div
        style={{
          position: "absolute",
          top: -1.7,
          left: 4,
          background: LABEL_BG,
          color: LABEL_COLOR,
          padding: "0 3px",
          fontSize: "1.9mm",
          fontWeight: 700,
          letterSpacing: 0.2,
          textAlign: labelAlign,
          lineHeight: 1.1,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "2.1mm",
          color: "#000",
          fontWeight: 500,
          minHeight: "3mm",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...valueStyle,
        }}
      >
        {value ?? "\u00a0"}
      </div>
    </div>
  );
}

export function HistoricoSuperior({ state, page = 0, totalPages }: Props) {
  const all = state.disciplinasSuperior ?? [];
  const per = HISTORICO_UNIP_LINHAS_POR_FOLHA;
  const computedTotal = Math.max(1, Math.ceil(all.length / per) || 1);
  const total = totalPages ?? computedTotal;
  const offset = page * per;
  const disciplinas = all.slice(offset, offset + per);
  const linhasVazias = per - disciplinas.length;

  const chCumprida = (state.disciplinasSuperior || [])
    .filter((d) => ["AP", "AE", "DS"].includes(d.situacao))
    .reduce((sum, d) => sum + (parseInt(d.ch, 10) || 0), 0);

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
        padding: "5mm 5mm 4mm",
        fontFamily: "Arial, Helvetica, sans-serif",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Header row: logo + title + folhas */}
      <div style={{ display: "grid", gridTemplateColumns: "42mm 1fr 30mm", gap: "2mm", alignItems: "stretch" }}>
        <div style={{ ...boxBase, display: "grid", placeItems: "center", padding: "2mm" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ fontFamily: "Arial Black, sans-serif", fontSize: "10mm", color: "#f7c400", WebkitTextStroke: "0.4px #000" }}>
              UNIP
            </div>
          </div>
          <div style={{ background: "#c60c1e", color: "#fff", fontSize: "1.9mm", padding: "0.4mm 3mm", fontWeight: 700, letterSpacing: 1, marginTop: 1 }}>
            UNIVERSIDADE PAULISTA
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6mm", letterSpacing: "4mm", fontWeight: 400 }}>
          HISTÓRICO ESCOLAR
        </div>
        <Field label="FOLHAS DE" value={`${page + 1} / ${total}`} valueStyle={{ textAlign: "center" }} />
      </div>

      {/* Nome + Data emissão */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 40mm", gap: "2mm", marginTop: "2mm" }}>
        <Field label="NOME" value={state.nomeAluno} valueStyle={{ fontWeight: 700 }} />
        <Field label="DATA DE EMISSÃO" value={state.dataEmissao} valueStyle={{ textAlign: "center" }} />
      </div>

      {/* Dados civis linha 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "30mm 40mm 1fr 20mm 45mm", gap: "2mm", marginTop: "2mm" }}>
        <Field label="MATRÍCULA" value={state.matricula} />
        <Field label="DATA DE NASCIMENTO" value={state.dataNasc} valueStyle={{ textAlign: "center" }} />
        <Field label="CIDADE DE NASCIMENTO" value={state.cidadeNasc} />
        <Field label="ESTADO" value={state.estadoNasc} valueStyle={{ textAlign: "center" }} />
        <Field label="NACIONALIDADE (PAÍS)" value={state.nacionalidade} />
      </div>

      {/* Dados civis linha 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "40mm 30mm 30mm 30mm 20mm 1fr", gap: "2mm", marginTop: "2mm" }}>
        <Field label="NÚMERO DE IDENTIDADE (RG)" value={state.rg} />
        <Field label="CERTIFICADO MILITAR" value={state.certificadoMilitar} />
        <Field label="CPF" value={state.cpf} />
        <Field label="TÍTULO DE ELEITOR" value={state.tituloEleitor} />
        <Field label="ZONA" value={state.zonaEleitoral} valueStyle={{ textAlign: "center" }} />
        <Field label="SEÇÃO" value={state.secaoEleitoral} valueStyle={{ textAlign: "center" }} />
      </div>

      {/* Vestibular */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 35mm 30mm", gap: "2mm", marginTop: "2mm" }}>
        <Field label="DISCIPLINAS DO VESTIBULAR" value={state.disciplinasVestibular} />
        <Field label="FORMA INGRESSO" value={state.formaIngresso} />
        <Field label="REALIZAÇÃO MÊS / ANO" value={state.mesAnoVestibular} valueStyle={{ textAlign: "center" }} />
      </div>

      {/* Curso */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 30mm 55mm 40mm", gap: "2mm", marginTop: "2mm" }}>
        <Field label="NOME DO CURSO" value={state.cursoSuperior} valueStyle={{ fontWeight: 700 }} />
        <Field label="COD. e-MEC" value={state.codigoEmec} valueStyle={{ textAlign: "center" }} />
        <div style={{ ...boxBase, padding: "3.4mm 2mm 1mm", minHeight: "12mm" }}>
          <div
            style={{
              position: "absolute",
              top: -1.7,
              left: 4,
              background: LABEL_BG,
              color: LABEL_COLOR,
              padding: "0 3px",
              fontSize: "1.9mm",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            RECONHECIMENTO
          </div>
          <div style={{ fontSize: "1.8mm", lineHeight: 1.35 }}>
            <div><b>PORT/DECRETO:</b> {state.reconhecimentoPortaria || state.portariaMec}</div>
            <div><b>PUBLIC.D.O.U.:</b> {state.publicacaoDou}</div>
          </div>
        </div>
        <div style={{ ...boxBase, padding: "3.4mm 2mm 1mm", minHeight: "12mm" }}>
          <div
            style={{
              position: "absolute",
              top: -1.7,
              left: 4,
              background: LABEL_BG,
              color: LABEL_COLOR,
              padding: "0 3px",
              fontSize: "1.9mm",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            CARGA HORÁRIA
          </div>
          <div style={{ fontSize: "1.9mm", lineHeight: 1.4 }}>
            <div><b>EXIGIDA:</b> {state.chExigida ? `${state.chExigida}h` : ""}</div>
            <div><b>CUMPRIDA:</b> {chCumprida ? `${chCumprida}h` : ""}</div>
          </div>
        </div>
      </div>

      {/* Tabela de disciplinas */}
      <div style={{ marginTop: "3mm", border: `1.2px solid ${BLUE}`, borderRadius: 4 }}>
        <div
          style={{
            textAlign: "center",
            fontSize: "3mm",
            letterSpacing: "2mm",
            padding: "1mm",
            borderBottom: `1.2px solid ${BLUE}`,
            background: LABEL_BG,
            color: LABEL_COLOR,
            fontWeight: 700,
          }}
        >
          RELAÇÃO DE DISCIPLINAS
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "1.85mm",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "46%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "11%" }} />
          </colgroup>
          <thead>
            <tr style={{ color: LABEL_COLOR, fontWeight: 700, textTransform: "uppercase" }}>
              {["Período", "Código", "Descrição", "C.H.", "Per. Letivo", "Média", "Situação"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    borderRight: i < 6 ? `1px solid ${BLUE}` : undefined,
                    borderBottom: `1px solid ${BLUE}`,
                    padding: "0.8mm 1mm",
                    fontSize: "1.9mm",
                    background: "#fff",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((d, i) => (
              <tr key={`d-${offset + i}`} style={{ height: "4.4mm" }}>
                <td style={cellStyle("center")}>{d.periodo}</td>
                <td style={cellStyle("center")}>{d.codigo}</td>
                <td style={cellStyle("left")}>{d.descricao}</td>
                <td style={cellStyle("center")}>{d.ch}</td>
                <td style={cellStyle("center")}>{d.perLetivo}</td>
                <td style={cellStyle("center")}>{d.media}</td>
                <td style={{ ...cellStyle("center"), fontWeight: 700 }}>{d.situacao}</td>
              </tr>
            ))}
            {Array.from({ length: linhasVazias }).map((_, i) => (
              <tr key={`e-${i}`} style={{ height: "4.4mm" }}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} style={cellStyle("center")}>&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Observações */}
      <div style={{ marginTop: "2mm", ...boxBase, padding: "3.4mm 2mm 1.5mm", minHeight: "16mm" }}>
        <div
          style={{
            position: "absolute",
            top: -1.7,
            left: 4,
            background: LABEL_BG,
            color: LABEL_COLOR,
            padding: "0 3px",
            fontSize: "1.9mm",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          OBSERVAÇÕES
        </div>
        <div style={{ fontSize: "1.85mm", whiteSpace: "pre-wrap", lineHeight: 1.3 }}>
          {state.observacoesHistorico}
        </div>
      </div>

      {/* Rodapé - datas e validação */}
      <div style={{ display: "grid", gridTemplateColumns: "28mm 28mm 22mm 26mm 32mm 1fr", gap: "1.5mm", marginTop: "2mm" }}>
        <Field label="DATA COLAÇÃO DE GRAU" value={state.dataColacao} valueStyle={{ textAlign: "center", fontSize: "1.8mm" }} />
        <Field label="DATA EXP. DO DIPLOMA" value={state.dataEmissao} valueStyle={{ textAlign: "center", fontSize: "1.8mm" }} />
        <Field label="CÓDIGO DO CURSO" value={state.codigoEmec} valueStyle={{ textAlign: "center", fontSize: "1.8mm" }} />
        <Field label="DATA CONCL. CURSO" value={state.dataEmissao} valueStyle={{ textAlign: "center", fontSize: "1.8mm" }} />
        <Field label="TÍTULO" value={state.titulo} valueStyle={{ textAlign: "center", fontSize: "1.8mm" }} />
        <div style={{ ...boxBase, padding: "1.5mm 2mm", fontSize: "1.6mm", lineHeight: 1.3 }}>
          <div>A autenticidade deste documento pode ser verificada em:</div>
          <div style={{ color: LABEL_COLOR }}>{state.sedUrlBase || "https://www.unip.br/servicos/verificacao"}</div>
          <div>Número do documento: <b>{state.codigoUnico || "—"}</b></div>
        </div>
      </div>

      {/* Legenda + vistos + QR */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 55mm 25mm", gap: "1.5mm", marginTop: "2mm" }}>
        <div style={{ ...boxBase, padding: "2mm 3mm", fontSize: "1.8mm", lineHeight: 1.35 }}>
          <div style={{ fontWeight: 700, fontSize: "2.1mm" }}>LEGENDA:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "4mm" }}>
            <div><b>AP</b> - APROVADO</div>
            <div><b>RM</b> - REPROVADO POR MÉDIA</div>
            <div><b>DP</b> - DISPENSADO</div>
            <div><b>AE</b> - APROVEITAMENTO DE ESTUDOS</div>
            <div><b>FF</b> - REPROVADO POR FALTAS</div>
            <div><b>EX</b> - EXTRA CURRICULAR</div>
            <div>&nbsp;</div>
            <div><b>AC</b> - AGUARDANDO COMPLEMENTO</div>
            <div>&nbsp;</div>
            <div><b>NC</b> - NÃO CURSADA</div>
          </div>
        </div>
        <div style={{ ...boxBase, padding: "3.4mm 2mm 1mm", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: -1.7,
              left: 4,
              background: LABEL_BG,
              color: LABEL_COLOR,
              padding: "0 3px",
              fontSize: "1.9mm",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            VISTOS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3mm", marginTop: "3mm", fontSize: "1.7mm", textAlign: "center" }}>
            <div>
              <div style={{ borderTop: "1px solid #000", paddingTop: 1 }}>{state.secretarioGeral}</div>
              <div style={{ fontWeight: 700 }}>Secretário Geral</div>
            </div>
            <div>
              <div style={{ borderTop: "1px solid #000", paddingTop: 1 }}>{state.reitor}</div>
              <div style={{ fontWeight: 700 }}>Reitor</div>
            </div>
          </div>
        </div>
        <div style={{ ...boxBase, display: "grid", placeItems: "center", padding: "1mm" }}>
          <QrBlock code={state.codigoUnico} sedUrlBase={state.sedUrlBase} size={78} />
        </div>
      </div>
    </div>
  );
}

function cellStyle(align: "left" | "center" | "right"): CSSProperties {
  return {
    borderRight: `1px solid ${BLUE}`,
    borderBottom: `1px solid #d4e6f5`,
    padding: "0.6mm 1mm",
    textAlign: align,
    verticalAlign: "middle",
    color: "#000",
  };
}
