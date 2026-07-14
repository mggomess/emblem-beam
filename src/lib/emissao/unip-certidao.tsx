import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (v: string, fallback = "—") =>
  v && v.trim() ? v : <span className="text-neutral-400">{fallback}</span>;

/** UNIP — Certidão de Conclusão (A4 Retrato). */
export function UnipCertidao({ state, onMecChange, draggableMec = true }: Props) {
  const base = (state.sedUrlBase || "https://validar.sedu.gov.br").replace(/\/+$/, "");
  const qrValue = state.codigoUnico ? `${base}/validar/${encodeURIComponent(state.codigoUnico)}` : base;

  return (
    <div className="doc-sheet a4-portrait font-serif-doc relative">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]"
        style={{
          backgroundImage: "url(/simbolo.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "55%",
        }}
      />

      {/* Cabeçalho */}
      <div className="relative z-10 flex items-center justify-between border-b-2 border-[#c8102e] pb-3">
        {/* Logo UNIP inclinado (faixas amarela/vermelha) */}
        <svg viewBox="0 0 140 90" className="h-20 w-auto">
          <g transform="rotate(-12 70 45)">
            <rect x="10" y="18" width="120" height="22" fill="#ffcc00" />
            <rect x="10" y="42" width="120" height="22" fill="#c8102e" />
            <text x="24" y="36" fontFamily="Georgia, serif" fontSize="18" fontWeight="900" fill="#c8102e">UNIP</text>
            <text x="24" y="60" fontFamily="Georgia, serif" fontSize="12" fontWeight="900" fill="#ffcc00">PAULISTA</text>
          </g>
        </svg>
        <div className="text-right text-[#c8102e]">
          <div className="text-lg font-bold uppercase tracking-wider">UNIP — UNIVERSIDADE PAULISTA</div>
          <div className="text-[10px] uppercase text-neutral-700">Portaria MEC nº {ph(state.portariaMec)}</div>
        </div>
      </div>

      {/* Título */}
      <div className="relative z-10 mt-6 text-center">
        <h1 className="font-cinzel text-2xl font-bold uppercase tracking-[0.3em] text-[#c8102e]">
          Certidão de Conclusão de Curso
        </h1>
      </div>

      {/* Corpo centralizado */}
      <div className="relative z-10 mx-auto mt-8 max-w-[170mm] text-center text-[13px] leading-[2] text-black">
        <p>
          Certificamos, para os devidos fins, que{" "}
          <b>{ph(state.nomeAluno)}</b>, portador(a) do CPF nº {ph(state.cpf)}, RG nº {ph(state.rg)},
          natural de <b>{ph(state.cidadeNasc)} - {ph(state.estadoNasc)}</b>, matrícula nº{" "}
          {ph(state.matricula)}, concluiu com aproveitamento o Curso de{" "}
          <b>{ph(state.cursoSuperior)}</b>, havendo colado grau em{" "}
          <b>{ph(state.dataColacao)}</b>, fazendo jus ao título de{" "}
          <b>{ph(state.titulo)}</b>, referente ao período letivo de{" "}
          <b>{ph(state.periodoInicio)} a {ph(state.periodoFim)}</b>, nos termos da legislação vigente.
        </p>
        <p className="mt-8">
          <b>
            Universidade Paulista, {ph(state.cidadeEmissao)} - {ph(state.uf)}, {ph(state.dataEmissao)}.
          </b>
        </p>
      </div>

      {/* Rodapé: QR centralizado + assinatura digital direita */}
      <div className="absolute inset-x-0 bottom-[22mm] z-10 grid grid-cols-[1fr_auto_1fr] items-end gap-4 px-10">
        <div />
        <div className="flex flex-col items-center">
          <QRCodeCanvas value={qrValue} size={90} includeMargin level="M" />
          <div className="mt-1 text-center text-[8.5px] font-bold uppercase tracking-wider text-[#0d1b3d]">
            VERIFIQUE A AUTENTICIDADE
            <br />COD: {state.codigoUnico || "—"}
          </div>
        </div>
        <div className="text-right text-[9px] leading-tight text-neutral-800">
          <div className="font-bold">Assinado digitalmente por:</div>
          <div className="break-all">{state.assinaturaDigital}</div>
        </div>
      </div>

      {/* Linha + endereço polo */}
      <div className="absolute inset-x-[15mm] bottom-[10mm] z-10">
        <div className="border-t border-neutral-400" />
        <div className="mt-1 text-center text-[10px] uppercase tracking-wide text-neutral-700">
          {state.enderecoPolo || "—"}
        </div>
      </div>

      <MecStampBlock mec={state.mec} onChange={onMecChange} draggable={draggableMec} />
    </div>
  );
}
