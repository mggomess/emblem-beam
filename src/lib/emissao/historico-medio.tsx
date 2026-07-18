import type { EmissaoState } from "./types";
import { QrBlock } from "./qr-block";

/** Histórico Escolar — Ensino Médio (Modelo SP com matriz BNCC). */
export function HistoricoMedio({ state }: { state: EmissaoState; page?: number; totalPages?: number }) {
  const brasaoUf = `/estados/brasoes/${state.uf.toLowerCase()}.png`;

  return (
    <div className="doc-sheet a4-portrait font-sans-doc relative">
      {/* Marca d'água */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]"
        style={{ backgroundImage: "url(/simbolo.png)", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "55%" }}
      />

      <div className="relative z-10">
        {/* Caixa Unidade de Ensino */}
        <div className="flex items-start gap-3 border-2 border-black p-2">
          <img src={brasaoUf} alt="" className="h-14 w-14 object-contain" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
          <div className="flex-1 text-center">
            <div className="text-[10px] font-bold uppercase">Secretaria de Estado da Educação</div>
            <div className="text-[13px] font-bold uppercase">{state.nomeColegio}</div>
            <div className="text-[9px]">
              Autorizado pelo Parecer CEE nº 11/08 — Resolução CNE/CEB 04/99 — Decreto Federal 5.104/04
            </div>
            <div className="text-[9px]">{state.cidadeEmissao} — {state.uf}</div>
          </div>
        </div>

        {/* Título */}
        <div className="mt-3 border border-black bg-black py-1 text-center text-[13px] font-bold uppercase tracking-widest text-white">
          Histórico Escolar do Ensino Médio
        </div>

        {/* Dados do aluno */}
        <div className="mt-2 grid grid-cols-2 gap-0 border border-black text-[10px]">
          <Row label="Aluno(a)" value={state.nomeAluno} />
          <Row label="Nacionalidade" value={state.nacionalidade} />
          <Row label="Natural de" value={`${state.cidadeNasc} - ${state.estadoNasc}`} />
          <Row label="Nascimento" value={state.dataNasc} />
          <Row label="CPF" value={state.cpf} />
          <Row label="RG" value={state.rg} />
          <Row label="Matrícula" value={state.matricula} />
          <Row label="Ano de conclusão" value={state.anoConclusao} />
        </div>

        {/* Matriz BNCC */}
        <table className="mt-3 w-full border-collapse border border-black text-[9.5px]">
          <thead className="bg-neutral-200 text-center">
            <tr>
              <th rowSpan={2} className="border border-black p-1 w-[24%]">ÁREA / COMPONENTE</th>
              <th rowSpan={2} className="border border-black p-1 w-[26%]">DISCIPLINA</th>
              <th colSpan={3} className="border border-black p-1">SÉRIES / NOTAS</th>
            </tr>
            <tr>
              <th className="border border-black p-1">1ª SÉRIE</th>
              <th className="border border-black p-1">2ª SÉRIE</th>
              <th className="border border-black p-1">3ª SÉRIE</th>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr>
              <td rowSpan={9} className="border border-black p-1 align-middle font-bold uppercase [writing-mode:vertical-rl] rotate-180">
                Base Nacional Comum
              </td>
              {state.disciplinasBNCC.slice(0, 1).map((d, i) => <Cells key={i} d={d} />)}
            </tr>
            {state.disciplinasBNCC.slice(1, 9).map((d, i) => (
              <tr key={i}>
                <Cells d={d} />
              </tr>
            ))}
            <tr>
              <td rowSpan={4} className="border border-black p-1 align-middle font-bold uppercase [writing-mode:vertical-rl] rotate-180">
                Parte Diversificada
              </td>
              {state.disciplinasBNCC.slice(9, 10).map((d, i) => <Cells key={i} d={d} />)}
            </tr>
            {state.disciplinasBNCC.slice(10).map((d, i) => (
              <tr key={i}>
                <Cells d={d} />
              </tr>
            ))}
            <tr className="bg-neutral-100 font-bold">
              <td colSpan={2} className="border border-black p-1 text-right">Carga Horária Anual</td>
              <td colSpan={3} className="border border-black p-1 text-center">{state.cargaHorariaAnual}</td>
            </tr>
            <tr className="bg-neutral-100 font-bold">
              <td colSpan={2} className="border border-black p-1 text-right">Dias Letivos</td>
              <td colSpan={3} className="border border-black p-1 text-center">{state.diasLetivos}</td>
            </tr>
            <tr className="bg-neutral-100 font-bold">
              <td colSpan={2} className="border border-black p-1 text-right">% de Faltas</td>
              <td colSpan={3} className="border border-black p-1 text-center">{state.faltasPct}</td>
            </tr>
            <tr className="bg-neutral-100 font-bold">
              <td colSpan={2} className="border border-black p-1 text-right">Resultado Final</td>
              <td colSpan={3} className="border border-black p-1 text-center uppercase">{state.resultadoFinal}</td>
            </tr>
          </tbody>
        </table>

        {/* Frase de conclusão */}
        <div className="mt-3 border border-black p-2 text-[10.5px] leading-relaxed">
          Certificamos que o(a) aluno(a) <b>{state.nomeAluno}</b> concluiu o Ensino Médio em{" "}
          <b>{state.anoConclusao}</b> nesta Unidade Escolar, com aproveitamento e frequência regular,
          conforme registros acadêmicos. Emitido em {state.cidadeEmissao}, {state.dataEmissao}.
        </div>

        {/* QR + rodapé */}
        <div className="mt-6 grid grid-cols-3 items-end gap-4">
          <div className="text-center">
            <div className="h-14" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[10px] font-bold uppercase">{state.nomeSecretaria}</div>
            <div className="text-[9px]">Assinatura da Secretaria Escolar</div>
          </div>
          <div className="flex justify-center">
            <QrBlock code={state.codigoUnico} sedUrlBase={state.sedUrlBase} size={110} />
          </div>
          <div className="text-center">
            <div className="h-14" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[10px] font-bold uppercase">Diretor(a) Escolar</div>
            <div className="text-[9px]">Assinatura do Diretor Escolar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] border-b border-black last:border-b-0">
      <div className="border-r border-black bg-neutral-100 p-1 font-bold uppercase">{label}</div>
      <div className="p-1">{value || "—"}</div>
    </div>
  );
}

function Cells({ d }: { d: { nome: string; s1: string; s2: string; s3: string } }) {
  return (
    <>
      <td className="border border-black p-1 text-left">{d.nome}</td>
      <td className="border border-black p-1">{d.s1}</td>
      <td className="border border-black p-1">{d.s2}</td>
      <td className="border border-black p-1">{d.s3}</td>
    </>
  );
}
