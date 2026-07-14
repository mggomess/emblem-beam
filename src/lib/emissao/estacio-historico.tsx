import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

const ph = (v: string, fb = "—") =>
  v && v.trim() ? v : <span className="text-neutral-400">{fb}</span>;

/** Histórico Escolar — Estácio (identidade azul-marinho, sem UNIP/ASSUPERO). */
export function EstacioHistoricoSuperior({ state }: { state: EmissaoState }) {
  const cor = "#002B49";
  return (
    <div className="doc-sheet a4-portrait font-sans-doc relative bg-white">
      <div className="relative z-10">
        {/* Cabeçalho */}
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-2">
          <div className="rounded-md border-2 p-2 text-center" style={{ borderColor: cor }}>
            <svg viewBox="0 0 80 40" className="mx-auto h-8">
              <rect x="6" y="6" width="28" height="28" transform="rotate(45 20 20)" fill={cor} />
              <text x="42" y="22" fontFamily="Arial" fontSize="12" fontWeight="900" fill={cor}>Estácio</text>
            </svg>
          </div>
          <div className="rounded-md border-2 p-2 text-center text-[10px]" style={{ borderColor: cor }}>
            <div className="font-bold uppercase" style={{ color: cor }}>Universidade Estácio de Sá</div>
            <div>{ph(state.cidadeEmissao)} — {ph(state.uf)}</div>
            <div>Portaria MEC nº {ph(state.portariaMec)}</div>
          </div>
          <div className="rounded-md border-2 p-2 text-center text-[9px]" style={{ borderColor: cor }}>
            <div className="font-bold" style={{ color: cor }}>Folha 1/1</div>
            <div>Emissão</div>
            <div className="font-bold">{ph(state.dataEmissao)}</div>
          </div>
        </div>

        <div className="mt-2 py-1 text-center text-[13px] font-bold uppercase tracking-widest text-white" style={{ background: cor }}>
          Histórico Escolar — Ensino Superior
        </div>

        <div className="mt-2 rounded-md border-2 p-2 text-center text-[13px] font-bold uppercase" style={{ borderColor: cor, color: cor }}>
          {ph(state.nomeAluno)}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
          {[
            ["CPF", state.cpf],
            ["RG", state.rg],
            ["Matrícula", state.matricula],
            ["Nascimento", state.dataNasc],
            ["Naturalidade", `${state.cidadeNasc} - ${state.estadoNasc}`.replace(/^ - $/, "")],
            ["Nacionalidade", state.nacionalidade],
            ["Curso", state.cursoSuperior],
            ["Título", state.titulo],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md border p-1.5" style={{ borderColor: cor }}>
              <span className="text-[8.5px] font-bold uppercase" style={{ color: cor }}>{k}: </span>
              <span>{v || "—"}</span>
            </div>
          ))}
        </div>

        <table className="mt-3 w-full border-collapse text-[9px]">
          <thead className="text-white" style={{ background: cor }}>
            <tr>
              <th className="border border-white/40 p-1">PER.</th>
              <th className="border border-white/40 p-1">CÓD.</th>
              <th className="border border-white/40 p-1 text-left">DESCRIÇÃO</th>
              <th className="border border-white/40 p-1">C.H.</th>
              <th className="border border-white/40 p-1">P.L.</th>
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

        <div className="mt-3 grid grid-cols-[2fr_1fr] items-end gap-3">
          <div className="rounded-md border p-2 text-[9px]" style={{ borderColor: cor }}>
            <span className="font-bold uppercase" style={{ color: cor }}>Observações: </span>
            {state.observacoesHistorico || "—"}
            <div className="mt-2">
              <span className="font-bold uppercase" style={{ color: cor }}>Legenda: </span>
              {state.legendaNotas}
            </div>
          </div>
          <div className="flex justify-center">
            <QrBlock code={state.codigoUnico} sedUrlBase={state.sedUrlBase} size={100} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-10 px-8">
          <div className="text-center">
            <div className="h-12" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[10px] font-bold uppercase">{ph(state.secretarioGeral)}</div>
            <div className="text-[9px] uppercase">Secretário(a) Geral</div>
          </div>
          <div className="text-center">
            <div className="h-12" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[10px] font-bold uppercase">{ph(state.reitor)}</div>
            <div className="text-[9px] uppercase">Reitor(a)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
