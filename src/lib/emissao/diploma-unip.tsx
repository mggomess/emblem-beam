import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

/** SUB-TEMPLATE 2 — UNIP Diploma Tradicional (A4 paisagem, moldura dourada). */
export function DiplomaUnip({ state, onMecChange, draggableMec = true }: Props) {
  return (
    <div className="doc-sheet a4-landscape font-serif-doc relative">
      {/* Moldura dourada dupla com arabescos simulados */}
      <div
        className="pointer-events-none absolute inset-[6mm] border-[6px]"
        style={{
          borderImage:
            "repeating-linear-gradient(45deg, #b8860b 0 6px, #daa520 6px 12px, #8b6914 12px 18px) 20",
        }}
      />
      <div className="pointer-events-none absolute inset-[11mm] border-2 border-[#8b6914]" />
      <div className="pointer-events-none absolute inset-[13mm] border border-[#daa520]/60" />

      {/* Cantos dourados */}
      {["top-[10mm] left-[10mm]", "top-[10mm] right-[10mm]", "bottom-[10mm] left-[10mm]", "bottom-[10mm] right-[10mm]"].map((pos, i) => (
        <div key={i} className={`pointer-events-none absolute ${pos} size-8 rounded-full border-4 border-[#b8860b]`} />
      ))}

      {/* Marca d'água */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]"
        style={{
          backgroundImage: "url(/simbolo.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "45%",
        }}
      />

      {/* Cabeçalho: selo à esquerda, título centro, logo UNIP à direita */}
      <div className="relative z-10 mt-4 flex items-start justify-between px-14">
        {/* Selo dourado circular */}
        <div className="mt-2 flex size-24 items-center justify-center rounded-full border-4 border-[#8b6914] bg-gradient-to-br from-[#f5deb3] to-[#daa520] shadow-inner">
          <div className="text-center">
            <div className="font-cinzel text-[9px] font-bold text-[#5a3e0a]">UNIVERSITAS</div>
            <div className="font-cinzel text-[16px] font-bold text-[#5a3e0a]">UNIP</div>
            <div className="font-cinzel text-[7px] text-[#5a3e0a]">EST. 1972</div>
          </div>
        </div>

        <div className="mt-2 text-center">
          <div className="font-gothic text-[46px] leading-none text-[#5a3e0a]">Universidade Paulista</div>
          <div className="mt-2 font-cinzel text-xs tracking-[0.4em] text-[#5a3e0a]">DIPLOMA</div>
        </div>

        {/* Logo UNIP vermelha/amarela */}
        <svg viewBox="0 0 120 80" className="h-20 w-auto">
          <rect x="4" y="8" width="60" height="64" fill="#c8102e" />
          <text x="10" y="52" fontFamily="Georgia, serif" fontSize="34" fontWeight="900" fill="#ffcc00">UNIP</text>
          <text x="70" y="30" fontFamily="Georgia, serif" fontSize="9" fill="#c8102e" fontWeight="bold">UNIVERSIDADE</text>
          <text x="70" y="42" fontFamily="Georgia, serif" fontSize="9" fill="#c8102e" fontWeight="bold">PAULISTA</text>
        </svg>
      </div>

      {/* Corpo centralizado */}
      <div className="relative z-10 mx-auto mt-6 max-w-[220mm] text-center leading-loose text-black">
        <p className="text-[13px]">O Magnífico Reitor da Universidade Paulista, no uso de suas atribuições, confere a</p>
        <div className="my-3 font-vibes text-[42px] leading-none text-[#5a3e0a]">
          {state.nomeAluno}
        </div>
        <p className="text-[12px]">
          portador(a) do CPF nº {state.cpf}, matrícula {state.matricula},
          havendo concluído o Curso Superior de
        </p>
        <div className="mt-2 font-cinzel text-[22px] font-bold uppercase tracking-wider text-[#5a3e0a]">
          {state.cursoSuperior}
        </div>
        <p className="mt-2 text-[12px]">
          o título de <b className="uppercase">{state.titulo}</b>, nos termos da legislação vigente,
          Portaria MEC nº {state.portariaMec}, Resolução CNE/CP nº {state.resolucao}.
        </p>
        <p className="mt-2 text-[11px] italic">
          Colação de grau realizada em {state.dataColacao} — período letivo de {state.periodoInicio} a {state.periodoFim}.
        </p>
        <p className="mt-3 text-[11px]">
          {state.cidadeEmissao}, {state.dataEmissao}.
        </p>
      </div>

      {/* Rodapé — 3 assinaturas */}
      <div className="absolute inset-x-0 bottom-[16mm] z-10 grid grid-cols-3 gap-6 px-24">
        {[
          { label: "Reitor", name: state.reitor },
          { label: "Diplomado(a)", name: state.nomeAluno },
          { label: "Secretário(a) Geral", name: state.secretarioGeral },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="h-12" />
            <div className="border-t border-black" />
            <div className="mt-1 text-[10px] font-bold uppercase">{s.name}</div>
            <div className="text-[9px] uppercase tracking-wider text-neutral-700">{s.label}</div>
          </div>
        ))}
      </div>

      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}
