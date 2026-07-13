import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

/** Histórico Escolar — Ensino Superior (Modelo UNIP customizável, com cor temática). */
export function HistoricoSuperior({ state }: { state: EmissaoState }) {
  const cor = state.corTemaHistorico || "#1D3557";

  return (
    <div className="doc-sheet a4-portrait font-sans-doc relative">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]"
        style={{ backgroundImage: "url(/simbolo.png)", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "55%" }}
      />
      <div className="relative z-10">
        {/* Cabeçalho institucional 3 colunas */}
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-2">
          <div className="rounded-md border-2 p-2 text-center" style={{ borderColor: cor }}>
            <div className="text-2xl font-black" style={{ color: cor }}>UNIP</div>
            <div className="text-[8px] uppercase" style={{ color: cor }}>Universidade Paulista</div>
          </div>
          <div className="rounded-md border-2 p-2 text-center text-[10px]" style={{ borderColor: cor }}>
            <div className="font-bold uppercase" style={{ color: cor }}>{state.nomeColegio}</div>
            <div>{state.cidadeEmissao} — {state.uf}</div>
            <div>Portaria MEC nº {state.portariaMec}</div>
          </div>
          <div className="rounded-md border-2 p-2 text-center text-[9px]" style={{ borderColor: cor }}>
            <div className="font-bold" style={{ color: cor }}>Folha 1/1</div>
            <div>Emissão</div>
            <div className="font-bold">{state.dataEmissao}</div>
          </div>
        </div>

        {/* Título */}
        <div className="mt-2 py-1 text-center text-[13px] font-bold uppercase tracking-widest text-white" style={{ background: cor }}>
          Histórico Escolar — Ensino Superior
        </div>

        {/* Nome do aluno banner */}
        <div className="mt-2 rounded-md border-2 p-2 text-center text-[13px] font-bold uppercase" style={{ borderColor: cor, color: cor }}>
          {state.nomeAluno}
        </div>

        {/* Dados pessoais grid */}
        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
          {[
            ["CPF", state.cpf],
            ["RG", state.rg],
            ["Matrícula", state.matricula],
            ["Nascimento", state.dataNasc],
            ["Naturalidade", `${state.cidadeNasc} - ${state.estadoNasc}`],
            ["Nacionalidade", state.nacionalidade],
            ["Curso", state.cursoSuperior],
            ["Título obtido", state.titulo],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md border p-1.5" style={{ borderColor: cor }}>
              <span className="text-[8.5px] font-bold uppercase" style={{ color: cor }}>{k}: </span>
              <span>{v || "—"}</span>
            </div>
          ))}
        </div>

        {/* Tabela de disciplinas */}
        <div className="mt-3 text-center text-[11px] font-bold uppercase" style={{ color: cor }}>
          Relação de Disciplinas
        </div>
        <table className="mt-1 w-full border-collapse text-[9px]">
          <thead className="text-white" style={{ background: cor }}>
            <tr>
              <th className="border border-white/40 p-1">PERÍODO</th>
              <th className="border border-white/40 p-1">CÓDIGO</th>
              <th className="border border-white/40 p-1 text-left">DESCRIÇÃO</th>
              <th className="border border-white/40 p-1">C.H.</th>
              <th className="border border-white/40 p-1">PER. LETIVO</th>
              <th className="border border-white/40 p-1">MÉDIA</th>
              <th className="border border-white/40 p-1">SIT.</th>
            </tr>
          </thead>
          <tbody>
            {state.disciplinasSuperior.map((d, i) => (
              <tr key={i} className={i % 2 ? "bg-neutral-50" : ""}>
                <td className="border p-1 text-center" style={{ borderColor: cor }}>{d.periodo}</td>
                <td className="border p-1 text-center" style={{ borderColor: cor }}>{d.codigo}</td>
                <td className="border p-1" style={{ borderColor: cor }}>{d.descricao}</td>
                <td className="border p-1 text-center" style={{ borderColor: cor }}>{d.ch}</td>
                <td className="border p-1 text-center" style={{ borderColor: cor }}>{d.perLetivo}</td>
                <td className="border p-1 text-center" style={{ borderColor: cor }}>{d.media}</td>
                <td className="border p-1 text-center font-bold" style={{ borderColor: cor }}>{d.situacao}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Observações / colação / legenda / QR */}
        <div className="mt-3 grid grid-cols-[2fr_1fr] gap-2">
          <div className="rounded-md border-2 p-2 text-[9.5px]" style={{ borderColor: cor }}>
            <div className="font-bold uppercase" style={{ color: cor }}>Observações</div>
            <div className="mt-1 whitespace-pre-wrap">{state.observacoesHistorico}</div>
          </div>
          <div className="rounded-md border-2 p-2 text-[9px]" style={{ borderColor: cor }}>
            <div className="font-bold uppercase" style={{ color: cor }}>Colação de Grau</div>
            <div className="mt-1">Data: {state.dataColacao}</div>
            <div>Portaria MEC: {state.portariaMec}</div>
            <div>Resolução: {state.resolucao}</div>
            <div>Período: {state.periodoInicio} — {state.periodoFim}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[2fr_1fr] items-end gap-2">
          <div className="rounded-md border p-2 text-[8.5px]" style={{ borderColor: cor }}>
            <span className="font-bold uppercase" style={{ color: cor }}>Legenda: </span>
            {state.legendaNotas}
          </div>
          <div className="flex justify-center">
            <QrBlock code={state.codigoUnico} sedUrlBase={state.sedUrlBase} size={100} />
          </div>
        </div>

        {/* Assinaturas */}
        <div className="mt-6 grid grid-cols-2 gap-8 px-8">
          <div className="text-center">
            <div className="h-12" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[10px] font-bold uppercase">{state.secretarioGeral}</div>
            <div className="text-[9px] uppercase">Secretário(a) Geral</div>
          </div>
          <div className="text-center">
            <div className="h-12" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[10px] font-bold uppercase">{state.reitor}</div>
            <div className="text-[9px] uppercase">Reitor</div>
          </div>
        </div>
      </div>
    </div>
  );
}
