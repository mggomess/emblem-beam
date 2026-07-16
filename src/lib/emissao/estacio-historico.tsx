import type { ReactNode } from "react";
import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

const ph = (v: string, fb = "—") =>
  v && v.trim() ? v : <span className="text-neutral-400">{fb}</span>;

function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-[28px] border px-2.5 py-1.5 ${className}`}
      style={{ borderColor: "#4d4d43" }}
    >
      <span className="mr-1 text-[8px] font-bold uppercase tracking-wide text-[#4d4d43]">
        {label}:
      </span>
      <span className="text-[9.5px] text-black">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="relative -mb-px ml-3 w-fit bg-[#f8f7ef] px-2 text-[9px] font-bold uppercase tracking-wide text-[#3f4035]">
      {children}
    </div>
  );
}

/** Histórico Escolar, Estácio, Ensino Superior. */
export function EstacioHistoricoSuperior({ state }: { state: EmissaoState }) {
  const border = "#4d4d43";
  const olive = "#4b4c3d";
  const paper = "#f8f7ef";

  return (
    <div
      className="doc-sheet a4-portrait font-sans-doc relative overflow-hidden"
      style={{
        backgroundColor: paper,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Marca d'água */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[49%] z-0 select-none text-[84px] font-bold uppercase"
        style={{
          color: olive,
          opacity: 0.03,
          transform: "translate(-50%, -50%) rotate(-18deg)",
          whiteSpace: "nowrap",
        }}
      >
        ESTÁCIO
      </div>

      <div className="relative z-10 px-[11mm] pb-[10mm] pt-[9mm]">
        {/* Cabeçalho institucional */}
        <div
          className="grid grid-cols-[110px_1fr_120px] items-center border p-3.5"
          style={{ borderColor: border }}
        >
          <div className="flex items-center justify-center">
            <img
              src="/simbolo.png"
              alt="Brasão institucional"
              className="h-[78px] w-[78px] object-contain"
            />
          </div>

          <div className="px-3 text-center leading-tight">
            <div className="text-[10px] uppercase tracking-wide">
              Ministério da Educação
            </div>

            <div
              className="mt-1 text-[15px] font-bold uppercase tracking-[0.08em]"
              style={{ color: olive }}
            >
              Universidade Estácio de Sá
            </div>

            <div className="mt-1.5 text-[11px] font-bold uppercase">
              Histórico Escolar
            </div>

            <div className="text-[8.5px] font-semibold uppercase tracking-wide">
              Ensino Superior
            </div>

            <div className="mt-1 text-[8.5px]">
              {ph(state.cidadeEmissao)} - {ph(state.uf)}
            </div>

            <div className="text-[8.5px]">
              Portaria MEC nº {ph(state.portariaMec)}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <svg viewBox="0 0 120 78" className="h-[72px] w-[110px]">
              <g>
                <rect
                  x="11"
                  y="10"
                  width="38"
                  height="38"
                  transform="rotate(45 30 29)"
                  fill="#6dbfb2"
                />
                <rect
                  x="20"
                  y="19"
                  width="20"
                  height="20"
                  transform="rotate(45 30 29)"
                  fill="#f8f7ef"
                />
              </g>
              <text
                x="56"
                y="39"
                fontFamily="Arial, sans-serif"
                fontSize="18"
                fontWeight="900"
                fill={olive}
              >
                Estácio
              </text>
            </svg>

            <div className="mt-1 text-[8px] font-bold uppercase" style={{ color: olive }}>
              Folha 1 de 1
            </div>
          </div>
        </div>

        {/* Dados acadêmicos */}
        <div className="mt-3">
          <SectionTitle>Dados acadêmicos</SectionTitle>

          <div className="border p-2.5" style={{ borderColor: border }}>
            <div className="grid grid-cols-2 gap-1.5">
              <Field
                label="Curso"
                value={ph(state.cursoSuperior)}
                className="col-span-2"
              />
              <Field label="Título conferido" value={ph(state.titulo)} />
              <Field label="Matrícula" value={ph(state.matricula)} />
              <Field label="Período inicial" value={ph(state.periodoInicio)} />
              <Field label="Período final" value={ph(state.periodoFim)} />
              <Field label="Data da colação" value={ph(state.dataColacao)} />
              <Field label="Data da emissão" value={ph(state.dataEmissao)} />
            </div>
          </div>
        </div>

        {/* Dados pessoais */}
        <div className="mt-3">
          <SectionTitle>Dados pessoais</SectionTitle>

          <div className="border p-2.5" style={{ borderColor: border }}>
            <div className="grid grid-cols-2 gap-1.5">
              <Field
                label="Nome completo"
                value={ph(state.nomeAluno)}
                className="col-span-2"
              />
              <Field label="CPF" value={ph(state.cpf)} />
              <Field label="RG" value={ph(state.rg)} />
              <Field label="Data de nascimento" value={ph(state.dataNasc)} />
              <Field label="Nacionalidade" value={ph(state.nacionalidade)} />
              <Field
                label="Naturalidade"
                value={
                  `${state.cidadeNasc || ""}${
                    state.estadoNasc ? ` - ${state.estadoNasc}` : ""
                  }` || "—"
                }
                className="col-span-2"
              />
            </div>
          </div>
        </div>

        {/* Grade curricular */}
        <div className="mt-3">
          <SectionTitle>Componentes curriculares</SectionTitle>

          <div className="border" style={{ borderColor: border }}>
            <table className="w-full table-fixed border-collapse text-[8px]">
              <colgroup>
                <col style={{ width: "8%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "50%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>

              <thead>
                <tr className="text-white" style={{ backgroundColor: olive }}>
                  <th className="border border-white/30 p-1">PERÍODO</th>
                  <th className="border border-white/30 p-1">CÓDIGO</th>
                  <th className="border border-white/30 p-1 text-left">
                    DISCIPLINA
                  </th>
                  <th className="border border-white/30 p-1">C.H.</th>
                  <th className="border border-white/30 p-1">NOTA</th>
                  <th className="border border-white/30 p-1">FREQ.</th>
                  <th className="border border-white/30 p-1">SIT.</th>
                </tr>
              </thead>

              <tbody>
                {state.disciplinasSuperior.length > 0 ? (
                  state.disciplinasSuperior.map((d, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f1f0e8",
                      }}
                    >
                      <td
                        className="border p-1 text-center"
                        style={{ borderColor: border }}
                      >
                        {d.periodo || "—"}
                      </td>

                      <td
                        className="border p-1 text-center"
                        style={{ borderColor: border }}
                      >
                        {d.codigo || "—"}
                      </td>

                      <td className="border p-1" style={{ borderColor: border }}>
                        {d.descricao || "—"}
                      </td>

                      <td
                        className="border p-1 text-center"
                        style={{ borderColor: border }}
                      >
                        {d.ch || "—"}
                      </td>

                      <td
                        className="border p-1 text-center"
                        style={{ borderColor: border }}
                      >
                        {d.media || "—"}
                      </td>

                      <td
                        className="border p-1 text-center"
                        style={{ borderColor: border }}
                      >
                        {d.perLetivo || "—"}
                      </td>

                      <td
                        className="border p-1 text-center font-bold"
                        style={{ borderColor: border }}
                      >
                        {d.situacao || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  Array.from({ length: 9 }).map((_, i) => (
                    <tr key={i}>
                      <td className="h-[22px] border" style={{ borderColor: border }} />
                      <td className="border" style={{ borderColor: border }} />
                      <td className="border" style={{ borderColor: border }} />
                      <td className="border" style={{ borderColor: border }} />
                      <td className="border" style={{ borderColor: border }} />
                      <td className="border" style={{ borderColor: border }} />
                      <td className="border" style={{ borderColor: border }} />
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Observações e validação */}
        <div className="mt-3 grid grid-cols-[1fr_122px] gap-3">
          <div>
            <SectionTitle>Observações e legenda</SectionTitle>

            <div
              className="min-h-[108px] border p-2.5 text-[8.5px] leading-relaxed"
              style={{ borderColor: border }}
            >
              <div>
                <span className="font-bold uppercase" style={{ color: olive }}>
                  Observações:
                </span>{" "}
                {state.observacoesHistorico || "—"}
              </div>

              <div className="mt-2">
                <span className="font-bold uppercase" style={{ color: olive }}>
                  Legenda:
                </span>{" "}
                {state.legendaNotas || "—"}
              </div>
            </div>
          </div>

          <div>
            <SectionTitle>Validação</SectionTitle>

            <div
              className="flex min-h-[108px] flex-col items-center justify-center border p-2"
              style={{ borderColor: border }}
            >
              <QrBlock
                code={state.codigoUnico}
                sedUrlBase={state.sedUrlBase}
                size={80}
              />

              <div className="mt-1 text-center text-[7px] font-bold uppercase">
                Verifique a autenticidade
              </div>

              <div className="mt-1 max-w-full break-all text-center text-[6.5px] leading-tight">
                {state.codigoUnico || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Assinaturas */}
        <div className="mt-7 grid grid-cols-2 gap-16 px-8">
          <div className="text-center">
            <div className="h-8" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[9px] font-bold uppercase">
              {ph(state.secretarioGeral)}
            </div>
            <div className="text-[8px] uppercase">Secretário(a) Geral</div>
          </div>

          <div className="text-center">
            <div className="h-8" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[9px] font-bold uppercase">
              {ph(state.reitor)}
            </div>
            <div className="text-[8px] uppercase">Reitor(a)</div>
          </div>
        </div>

        {/* Rodapé */}
        <div
          className="mt-6 grid grid-cols-3 items-end border-t pt-2 text-[7.5px]"
          style={{ borderColor: border }}
        >
          <div>
            Emitido em {ph(state.cidadeEmissao)} - {ph(state.uf)}
            <br />
            {ph(state.dataEmissao)}
          </div>

          <div className="text-center">
            Documento assinado digitalmente
          </div>

          <div className="text-right font-bold uppercase">Página 1 de 1</div>
        </div>
      </div>
    </div>
  );
}
