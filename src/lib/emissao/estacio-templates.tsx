import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (v: string, fb = "—") =>
  v && v.trim() ? v : <span className="text-neutral-400">{fb}</span>;

/** Logo Estácio — losango azul-marinho estilizado. */
function EstacioLogo({ className = "h-14 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 70" className={className}>
      <g>
        <rect x="4" y="10" width="40" height="40" transform="rotate(45 24 30)" fill="#002B49" />
        <rect x="14" y="20" width="20" height="20" transform="rotate(45 24 30)" fill="#fff" />
      </g>
      <text x="60" y="34" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="900" fill="#002B49" letterSpacing="1">
        Estácio
      </text>
      <text x="60" y="50" fontFamily="Arial, sans-serif" fontSize="9" fill="#002B49" letterSpacing="3">
        UNIVERSIDADE
      </text>
    </svg>
  );
}

/** Estácio — Certidão de Conclusão (A4 retrato). Fundo branco puro. */
export function EstacioCertidaoRetrato({ state, onMecChange, draggableMec = true }: Props) {
  return (
    <div className="doc-sheet a4-portrait font-sans-doc relative bg-white">
      {/* Cabeçalho azul-marinho */}
      <div className="relative z-10 flex items-center justify-between border-b-4 border-[#002B49] pb-4">
        <EstacioLogo className="h-16 w-auto" />
        <div className="text-right text-[10px] text-[#002B49]">
          <div className="text-sm font-bold uppercase">Universidade Estácio de Sá</div>
          <div>Credenciamento MEC — Portaria {state.portariaMec || "—"}</div>
        </div>
      </div>

      <div className="relative z-10 mt-10 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-[0.3em] text-[#002B49]">
          Certidão de Conclusão de Curso
        </h1>
        <div className="mx-auto mt-2 h-[2px] w-32 bg-[#002B49]" />
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-[170mm] text-center text-[13px] leading-[2] text-black">
        {state.corpoTextoSuperior ? (
          <p className="whitespace-pre-wrap text-justify">{state.corpoTextoSuperior}</p>
        ) : (
          <p>
            Certificamos que <b>{ph(state.nomeAluno)}</b>, portador(a) do CPF nº {ph(state.cpf)},
            matrícula nº {ph(state.matricula)}, concluiu o curso de{" "}
            <b>{ph(state.cursoSuperior)}</b>, fazendo jus ao título de <b>{ph(state.titulo)}</b>,
            período letivo <b>{ph(state.periodoInicio)} a {ph(state.periodoFim)}</b>, colação em{" "}
            <b>{ph(state.dataColacao)}</b>.
          </p>
        )}
        <p className="mt-8">
          <b>{ph(state.cidadeEmissao)} - {ph(state.uf)}, {ph(state.dataEmissao)}.</b>
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-[22mm] z-10 grid grid-cols-2 gap-10 px-20">
        <div className="text-center">
          <div className="h-14" />
          <div className="border-t border-black" />
          <div className="mt-1 text-[11px] font-bold uppercase">{ph(state.reitor)}</div>
          <div className="text-[10px] uppercase text-[#002B49]">Reitor(a)</div>
        </div>
        <div className="text-center">
          <div className="h-14" />
          <div className="border-t border-black" />
          <div className="mt-1 text-[11px] font-bold uppercase">{ph(state.secretarioGeral)}</div>
          <div className="text-[10px] uppercase text-[#002B49]">Secretário(a) Geral</div>
        </div>
      </div>

      <div className="absolute inset-x-[15mm] bottom-[10mm] z-10">
        <div className="border-t border-[#002B49]/40" />
        <div className="mt-1 text-center text-[10px] uppercase tracking-wide text-[#002B49]">
          {state.enderecoPolo || "—"}
        </div>
      </div>

      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}

/** Estácio — Diploma Paisagem. Moldura azul dupla + Brasão da República. */
export function EstacioDiplomaPaisagem({ state, onMecChange, draggableMec = true }: Props) {
  return (
    <div className="doc-sheet a4-landscape font-serif-doc relative bg-white">
      {/* Moldura geométrica dupla azul */}
      <div className="pointer-events-none absolute inset-[8mm] border-2 border-[#002B49]" />
      <div className="pointer-events-none absolute inset-[11mm] border border-[#002B49]" />
      <div className="pointer-events-none absolute inset-[14mm] border border-[#002B49]/40" />

      {/* Brasão da República topo esquerdo */}
      <img
        src="/estados/brasoes/br.png"
        alt=""
        className="absolute left-[20mm] top-[18mm] z-10 h-14 w-auto object-contain"
        onError={(e) => (e.currentTarget.style.visibility = "hidden")}
      />

      {/* Logo Estácio topo direito */}
      <div className="absolute right-[20mm] top-[18mm] z-10">
        <EstacioLogo className="h-14 w-auto" />
      </div>

      {/* Título */}
      <div className="relative z-10 mt-[28mm] text-center">
        <div className="font-cinzel text-[38px] font-bold uppercase tracking-[0.2em] text-[#002B49]">
          Diploma
        </div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.4em] text-[#002B49]">Universidade Estácio de Sá</div>
      </div>

      {/* Corpo */}
      <div className="relative z-10 mx-auto mt-6 max-w-[230mm] text-center text-[13px] leading-[2] text-black">
        <p>O Reitor da Universidade Estácio de Sá, no uso de suas atribuições, confere a</p>
        <div className="my-3 font-cinzel text-[32px] font-bold uppercase text-[#002B49]">
          {ph(state.nomeAluno)}
        </div>
        <p>
          portador(a) do CPF nº {ph(state.cpf)}, o grau de <b>{ph(state.titulo)}</b> em{" "}
          <b>{ph(state.cursoSuperior)}</b>, colação de grau em <b>{ph(state.dataColacao)}</b>,
          Portaria MEC nº {ph(state.portariaMec)}.
        </p>
        <p className="mt-4">
          <b>{ph(state.cidadeEmissao)} - {ph(state.uf)}, {ph(state.dataEmissao)}.</b>
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-[20mm] z-10 grid grid-cols-3 gap-6 px-24">
        {[
          { label: "Reitor(a)", name: state.reitor },
          { label: "Diplomado(a)", name: state.nomeAluno },
          { label: "Secretário(a) Geral", name: state.secretarioGeral },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="h-12" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[10px] font-bold uppercase">{ph(s.name)}</div>
            <div className="text-[9px] uppercase tracking-wider text-[#002B49]">{s.label}</div>
          </div>
        ))}
      </div>

      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}
