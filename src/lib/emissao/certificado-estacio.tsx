import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

/** SUB-TEMPLATE 1 — Estácio Certidão de Conclusão (A4 retrato). */
export function CertificadoEstacio({ state, onMecChange, draggableMec = true }: Props) {
  return (
    <div className="doc-sheet a4-portrait font-sans-doc relative">
      {/* Marca d'água central */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]"
        style={{
          backgroundImage: "url(/simbolo.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "60%",
        }}
      />

      {/* Cabeçalho: logo Estácio */}
      <div className="relative z-10 flex items-center justify-between border-b-4 border-[#003b7a] pb-4">
        <div className="flex items-center gap-3">
          {/* Placeholder SVG estilizado Estácio */}
          <svg viewBox="0 0 140 60" className="h-14 w-auto">
            <rect x="0" y="8" width="46" height="44" fill="#003b7a" />
            <polygon points="46,8 62,30 46,52" fill="#e30613" />
            <text x="70" y="34" fontFamily="Arial Black, Arial" fontSize="20" fontWeight="900" fill="#003b7a">
              ESTÁCIO
            </text>
            <text x="70" y="50" fontFamily="Arial" fontSize="8" fill="#003b7a" letterSpacing="2">
              UNIVERSIDADE
            </text>
          </svg>
        </div>
        <div className="text-right text-[10px] text-neutral-600">
          <div className="font-bold uppercase">Universidade Estácio de Sá</div>
          <div>Credenciamento MEC — Portaria {state.portariaMec}</div>
        </div>
      </div>

      {/* Título */}
      <div className="relative z-10 mt-8 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-[#003b7a]">
          Certidão de Conclusão de Curso
        </h1>
        <div className="mx-auto mt-2 h-[2px] w-32 bg-[#e30613]" />
      </div>

      {/* Corpo (Textarea livre) */}
      <div className="relative z-10 mt-10 px-6 text-justify text-[12.5px] leading-relaxed text-black">
        <p className="whitespace-pre-wrap">{state.corpoTextoSuperior}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 text-[11px]">
          <div><b>Aluno(a):</b> {state.nomeAluno}</div>
          <div><b>Matrícula:</b> {state.matricula}</div>
          <div><b>Curso:</b> {state.cursoSuperior}</div>
          <div><b>Título:</b> {state.titulo}</div>
          <div><b>Colação de grau:</b> {state.dataColacao}</div>
          <div><b>Período:</b> {state.periodoInicio} — {state.periodoFim}</div>
        </div>

        <p className="mt-10 text-center">
          {state.cidadeEmissao}, {state.dataEmissao}.
        </p>
      </div>

      {/* Rodapé simples */}
      <div className="absolute inset-x-0 bottom-[20mm] z-10 grid grid-cols-2 gap-10 px-16">
        <div className="text-center">
          <div className="h-14" />
          <div className="border-t border-black" />
          <div className="mt-1 text-[11px] font-bold uppercase">{state.reitor}</div>
          <div className="text-[10px] uppercase">Reitor</div>
        </div>
        <div className="text-center">
          <div className="h-14" />
          <div className="border-t border-black" />
          <div className="mt-1 text-[11px] font-bold uppercase">{state.secretarioGeral}</div>
          <div className="text-[10px] uppercase">Secretário(a) Geral</div>
        </div>
      </div>

      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}
