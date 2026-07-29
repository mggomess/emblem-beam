import type { EmissaoState } from "./types";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (v: string, fallback = "—") =>
  v && v.trim() ? v : <span className="text-neutral-400">{fallback}</span>;

/** Certificado — Ensino Médio em paisagem, alinhado ao modelo da aba Certificados. */
export function CertificadoMedio({ state }: Props) {
  const brasaoUf = `/estados/brasoes/${state.uf.toLowerCase()}.png`;
  const bandeiraUf = `/estados/bandeiras/${state.uf.toLowerCase()}.png`;
  const localData = `${ph(state.cidadeEmissao)}, ${ph(state.dataEmissao)}`;

  return (
    <div className="doc-sheet a4-landscape font-serif-doc relative overflow-hidden bg-white text-black">
      <div className="pointer-events-none absolute inset-[8mm] border-[3px] border-double border-[#1D3557]" />
      <div className="pointer-events-none absolute inset-[10mm] border border-[#1D3557]/40" />

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.1]"
        style={{
          backgroundImage: `url(${brasaoUf})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "36%",
        }}
      />

      <div className="relative z-10 flex h-full flex-col px-[16mm] py-[14mm]">
        <div className="grid grid-cols-[34mm_1fr_34mm] items-start gap-[6mm]">
          <div className="flex justify-start">
            <img
              src={bandeiraUf}
              alt=""
              className="h-[18mm] w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>
          <div className="pt-[2mm] text-center">
            <div className="font-cinzel text-[3.1mm] tracking-[0.7mm] text-[#1D3557]">
              SECRETARIA DE ESTADO DA EDUCAÇÃO
            </div>
            <div className="mt-[1mm] text-[2.6mm] uppercase tracking-[0.3mm] text-black">
              {ph(state.nomeColegio)}
            </div>
            <div className="mt-[1.5mm] text-[2.5mm] text-black">
              {ph(state.uf)} — {ph(state.cidadeEmissao)}
            </div>
          </div>
          <div className="flex justify-end">
            <img
              src={brasaoUf}
              alt=""
              className="h-[18mm] w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>
        </div>

        <div className="mt-[6mm] text-center">
          <div className="font-cinzel text-[11mm] font-bold tracking-[4mm] text-[#1D3557]">CERTIFICADO</div>
          <div className="mx-auto mt-[1mm] h-[0.45mm] w-[40mm] bg-[#1D3557]" />
        </div>

        <div className="mx-auto mt-[8mm] max-w-[240mm] text-center text-[3.3mm] leading-[1.9] text-black">
          <p>
            {ph(state.nomeColegio)}, com fundamento na Lei Federal nº 9.394/96, Decreto Federal
            5.104/04, Resoluções CNE/CEB 04/99 e 01/05, Parecer CNE/CEB 11/08 e indicações CEE
            08/2000, confere o presente certificado ao(à) aluno(a):
          </p>

          <p className="mt-[5mm] text-[6.2mm] font-bold uppercase tracking-[0.4mm] text-black">
            {ph(state.nomeAluno)}
          </p>

          <p className="mt-[4mm] px-[10mm] text-[3.3mm] leading-[1.9]">
            de nacionalidade {ph(state.nacionalidade)}, natural de {ph(state.cidadeNasc)} — {ph(state.estadoNasc)},
            nascido(a) em {ph(state.dataNasc)}, por haver concluído o <b>Ensino Médio</b> no ano de <b>{ph(state.anoConclusao)}</b>,
            para que possa gozar de todos os direitos e prerrogativas legais.
          </p>

          <p className="mt-[8mm] text-[3.2mm] italic">{localData}</p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-[14mm] px-[12mm] pb-[6mm]">
          <div className="text-center">
            <div className="h-[13mm]" />
            <div className="border-t border-black" />
            <div className="mt-[1mm] text-[3mm] font-bold uppercase">{ph(state.nomeSecretaria)}</div>
            <div className="text-[2.6mm]">RG: {ph(state.rgSecretaria)}</div>
            <div className="text-[2.5mm] uppercase tracking-[0.2mm] text-neutral-700">Secretaria Escolar</div>
          </div>
          <div className="text-center">
            <div className="h-[13mm]" />
            <div className="border-t border-black" />
            <div className="mt-[1mm] text-[3mm] font-bold uppercase">{ph(state.nomeAluno)}</div>
            <div className="text-[2.6mm] font-bold uppercase tracking-[0.2mm]">Concluinte</div>
          </div>
        </div>
      </div>
    </div>
  );
}
