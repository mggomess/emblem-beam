import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (v: string, fb = "—") =>
  v && v.trim() ? v : <span className="text-neutral-400">{fb}</span>;

/** UNIP — Diploma Tradicional (A4 paisagem). Duas folhas: frente + verso. */
export function DiplomaUnip({ state, onMecChange, draggableMec = true }: Props) {
  return (
    <>
      {/* ============ FOLHA 1 — FRENTE ============ */}
      <div className="doc-sheet a4-landscape font-serif-doc relative">
        {/* Moldura dourada arabesco */}
        <div
          className="pointer-events-none absolute inset-[6mm] border-[6px]"
          style={{
            borderImage:
              "repeating-linear-gradient(45deg, #b8860b 0 6px, #daa520 6px 12px, #8b6914 12px 18px) 20",
          }}
        />
        <div className="pointer-events-none absolute inset-[11mm] border-2 border-[#8b6914]" />
        <div className="pointer-events-none absolute inset-[13mm] border border-[#daa520]/60" />

        {["top-[10mm] left-[10mm]", "top-[10mm] right-[10mm]", "bottom-[10mm] left-[10mm]", "bottom-[10mm] right-[10mm]"].map((pos, i) => (
          <div key={i} className={`pointer-events-none absolute ${pos} size-8 rounded-full border-4 border-[#b8860b]`} />
        ))}

        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]"
          style={{
            backgroundImage: "url(/simbolo.png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "45%",
          }}
        />

        {/* Título centralizado gótico */}
        <div className="relative z-10 mt-[20mm] text-center">
          <div className="font-gothic text-[54px] leading-none text-[#5a3e0a]">Universidade Paulista</div>
          <div className="mt-2 font-cinzel text-xs tracking-[0.5em] text-[#5a3e0a]">DIPLOMA</div>
        </div>

        {/* Corpo serifado centralizado */}
        <div className="relative z-10 mx-auto mt-8 max-w-[220mm] text-center text-[13px] leading-[2.1] text-black">
          <p>O Magnífico Reitor da Universidade Paulista, no uso de suas atribuições, confere a</p>
          <div className="my-3 font-vibes text-[42px] leading-none text-[#5a3e0a]">
            {ph(state.nomeAluno)}
          </div>
          <p>
            portador(a) do CPF nº {ph(state.cpf)}, matrícula {ph(state.matricula)},
            havendo concluído o Curso Superior de
          </p>
          <div className="mt-2 font-cinzel text-[22px] font-bold uppercase tracking-wider text-[#5a3e0a]">
            {ph(state.cursoSuperior)}
          </div>
          <p className="mt-2">
            o título de <b className="uppercase">{ph(state.titulo)}</b>, nos termos da legislação vigente,
            Portaria MEC nº {ph(state.portariaMec)}, Resolução CNE/CP nº {ph(state.resolucao)}.
          </p>
          <p className="mt-2 text-[11px] italic">
            Colação de grau em {ph(state.dataColacao)} — período letivo {ph(state.periodoInicio)} a {ph(state.periodoFim)}.
          </p>
          <p className="mt-3">
            <b>Universidade Paulista, {ph(state.cidadeEmissao)} - {ph(state.uf)}, {ph(state.dataEmissao)}.</b>
          </p>
        </div>

        {/* Rodapé — uma única assinatura centralizada da Reitora */}
        <div className="absolute inset-x-0 bottom-[20mm] z-10 flex justify-center">
          <div className="w-[90mm] text-center">
            <div className="h-14" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[11px] font-bold uppercase">
              {state.reitor || "SANDRA REJANE GOMES MIESSA"}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-700">Reitora</div>
          </div>
        </div>

        <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
      </div>

      {/* ============ FOLHA 2 — VERSO ============ */}
      <div className="doc-sheet a4-landscape font-serif-doc relative bg-white" style={{ pageBreakBefore: "always", breakBefore: "page" }}>
        <div className="grid h-full grid-cols-2 gap-8 p-6">
          {/* Coluna esquerda — Mantenedora */}
          <div className="text-[11px] leading-relaxed">
            <div className="border-b-2 border-[#5a3e0a] pb-1 text-[13px] font-bold uppercase text-[#5a3e0a]">
              Mantenedora
            </div>
            <div className="mt-2 space-y-1">
              <div><b>Razão Social:</b> {state.mantenedora}</div>
              <div><b>CNPJ:</b> {state.cnpj}</div>
              <div><b>Recredenciamento:</b> Portaria MEC nº {ph(state.portariaMec)}</div>
              <div><b>Resolução CNE/CP:</b> {ph(state.resolucao)}</div>
              <div><b>Endereço:</b> {state.enderecoPolo}</div>
            </div>

            <div className="mt-6 border-b-2 border-[#5a3e0a] pb-1 text-[13px] font-bold uppercase text-[#5a3e0a]">
              Dados do Diplomado
            </div>
            <div className="mt-2 space-y-1">
              <div><b>Nome:</b> {ph(state.nomeAluno)}</div>
              <div><b>CPF:</b> {ph(state.cpf)} &nbsp; <b>RG:</b> {ph(state.rg)}</div>
              <div><b>Naturalidade:</b> {ph(state.cidadeNasc)} - {ph(state.estadoNasc)}</div>
              <div><b>Nascimento:</b> {ph(state.dataNasc)} &nbsp; <b>Nacionalidade:</b> {ph(state.nacionalidade)}</div>
              <div><b>Curso:</b> {ph(state.cursoSuperior)} &nbsp; <b>Título:</b> {ph(state.titulo)}</div>
              <div><b>Colação de grau:</b> {ph(state.dataColacao)}</div>
            </div>

            {/* Carimbo circular simulado */}
            <div className="mt-10 flex items-end gap-4">
              <div className="flex size-28 items-center justify-center rounded-full border-4 border-[#5a3e0a] text-center">
                <div className="text-[9px] font-bold uppercase leading-tight text-[#5a3e0a]">
                  Universidade
                  <br />Paulista
                  <br />— UNIP —
                </div>
              </div>
              <div className="text-[10px] text-neutral-700">Carimbo institucional</div>
            </div>
          </div>

          {/* Coluna direita — Secretaria Geral */}
          <div className="rounded-md border-2 border-[#5a3e0a] p-3 text-[11px]">
            <div className="text-center text-[13px] font-bold uppercase text-[#5a3e0a]">
              Secretaria Geral
              <div className="text-[10px] font-normal">Departamento de Registro de Diplomas</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Box label="RA" value={state.raCode} />
              <Box label="LOTE" value={state.lote} />
              <Box label="LIVRO" value={state.livro} />
              <Box label="FOLHA" value={state.folhaLivro} />
            </div>

            <div className="mt-6 space-y-1 text-[10px] leading-relaxed">
              <p>
                Registrado sob as condições acima nos termos da legislação vigente e do
                Regimento Geral desta Universidade.
              </p>
              <p>
                {ph(state.cidadeEmissao)} - {ph(state.uf)}, {ph(state.dataEmissao)}.
              </p>
            </div>

            <div className="mt-12 text-center">
              <div className="mx-auto border-t border-black" />
              <div className="mt-1 text-[10px] font-bold uppercase">{ph(state.secretarioAdjunto)}</div>
              <div className="text-[9px] uppercase tracking-wider text-neutral-700">
                Secretário(a) Geral Adjunto(a)
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#5a3e0a] p-2">
      <div className="text-[8.5px] font-bold uppercase text-[#5a3e0a]">{label}</div>
      <div className="mt-0.5 text-[11px] font-semibold">{value || "—"}</div>
    </div>
  );
}
