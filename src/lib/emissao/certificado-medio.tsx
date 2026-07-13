import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

/** Certificado — Ensino Médio (modelo oficial SP). A4 retrato. */
export function CertificadoMedio({ state, onMecChange, draggableMec = true }: Props) {
  const brasaoUf = `/estados/brasoes/${state.uf.toLowerCase()}.png`;
  const bandeiraUf = `/estados/bandeiras/${state.uf.toLowerCase()}.png`;

  return (
    <div className="doc-sheet a4-portrait font-serif-doc relative">
      {/* Moldura */}
      <div className="pointer-events-none absolute inset-[8mm] border-[3px] border-double border-[#1D3557]" />
      <div className="pointer-events-none absolute inset-[10mm] border border-[#1D3557]/40" />

      {/* Marca d'água - simbolo/brasão */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]"
        style={{
          backgroundImage: "url(/simbolo.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "55%",
        }}
      />

      {/* Cabeçalho: bandeira esquerda, título centro, brasão direita */}
      <div className="relative z-10 flex items-start justify-between px-4 pt-6">
        <img src={bandeiraUf} alt="" className="h-16 w-auto object-contain" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        <div className="pt-2 text-center">
          <div className="font-cinzel text-xs tracking-widest text-[#1D3557]">SECRETARIA DE ESTADO DA EDUCAÇÃO</div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-black">{state.nomeColegio || "—"}</div>
        </div>
        <img src={brasaoUf} alt="" className="h-16 w-auto object-contain" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
      </div>

      {/* Título */}
      <div className="relative z-10 mt-8 text-center">
        <div className="font-cinzel text-[42px] font-bold tracking-[0.4em] text-[#1D3557]">CERTIFICADO</div>
        <div className="mx-auto mt-1 h-[2px] w-40 bg-[#1D3557]" />
      </div>

      {/* Corpo */}
      <div className="relative z-10 mt-10 px-8 text-justify text-[13px] leading-[1.9] text-black">
        <p>
          O Diretor do <b>{state.nomeColegio || "—"}</b>, nos termos da Lei Federal nº. 9.394/96,
          Decreto Federal 5.104/04. Resoluções CNE/CEB 04/99 e 01/05, Parecer CNE/CEB 11/08,
          indicações CEE 08/2000 e com despacho no Regimento Escolar, confere a{" "}
          <b className="text-[15px]">{state.nomeAluno || "—"}</b> de nacionalidade{" "}
          {state.nacionalidade || "—"}, natural de {state.cidadeNasc || "—"} –{" "}
          {state.estadoNasc || "—"}, nascido(a) {state.dataNasc || "—"}, Certifica o{" "}
          <b>Ensino Médio</b> por haver concluído, no ano de <b>{state.anoConclusao || "—"}</b> e
          outorga-lhe o presente Certificado, a fim de que possa gozar de todos os direitos e
          prerrogativas Legais do País.
        </p>
        <p className="mt-6 text-right">
          {state.cidadeEmissao || "—"}, {state.dataEmissao || "—"}.
        </p>
      </div>

      {/* Rodapé: 2 colunas */}
      <div className="absolute inset-x-0 bottom-[18mm] z-10 grid grid-cols-2 gap-8 px-14">
        <div className="text-center">
          <div className="h-16" />
          <div className="border-t border-black" />
          <div className="mt-1 text-[11px] font-bold uppercase">{state.nomeSecretaria || "—"}</div>
          <div className="text-[10px]">RG: {state.rgSecretaria || "—"}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-700">Secretaria Escolar</div>
        </div>
        <div className="text-right">
          <div className="h-16" />
          <div className="border-t border-black" />
          <div className="mt-1 text-[12px] font-bold uppercase">{state.nomeAluno || "—"}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider">Concluinte</div>
        </div>
      </div>

      {/* Carimbo MEC arrastável */}
      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}
