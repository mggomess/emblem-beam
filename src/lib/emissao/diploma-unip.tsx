import type { ReactNode } from "react";
import type { EmissaoState } from "./types";
import { MecStampBlock } from "./mec-stamp";

type Props = {
  state: EmissaoState;
  onMecChange: (m: EmissaoState["mec"]) => void;
  draggableMec?: boolean;
};

const ph = (value?: string | null, fallback = "-"): ReactNode =>
  value?.trim() ? value : <span className="text-neutral-400">{fallback}</span>;

/*
 * A fonte da imagem de referência é semelhante a Old English Text MT.
 * Em computadores que não possuam essa fonte, o navegador usa os fallbacks.
 */
const diplomaFont =
  '"Old English Text MT", "Cloister Black", "UnifrakturCook", "UnifrakturMaguntia", serif';
const bodyFont = '"Arial Narrow", "Times New Roman", Times, serif';
const registrationFont = '"Times New Roman", Times, serif';

export function DiplomaUnip({
  state,
  onMecChange,
  draggableMec = true,
}: Props) {
  const naturalidade = [state.cidadeNasc, state.estadoNasc]
    .filter((item) => item?.trim())
    .join(" - ");

  return (
    <>
      {/* FOLHA 1, FRENTE */}
      <section
        className="doc-sheet a4-landscape relative overflow-hidden bg-white text-black"
        style={{
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          fontFamily: bodyFont,
        }}
      >
        <img
          src="/images/fundo-unip.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
          style={{ objectFit: "fill" }}
        />

        <header
          className="absolute z-10 whitespace-nowrap text-center"
          style={{
            top: "8.8%",
            left: "20%",
            right: "20%",
            fontFamily: diplomaFont,
            fontSize: "42px",
            lineHeight: 0.95,
            fontWeight: 400,
            letterSpacing: "-0.8px",
          }}
        >
          Universidade Paulista
        </header>

        <main
          className="absolute z-10 text-center"
          style={{
            top: "24.5%",
            left: "23%",
            right: "23%",
            fontFamily: bodyFont,
            fontSize: "10px",
            lineHeight: 1.23,
            fontStretch: "condensed",
          }}
        >
          <p className="m-0">
            A Reitora da Universidade Paulista, no uso de suas atribuições
          </p>

          <p className="m-0 mt-[2px]">
            e tendo em vista a conclusão do Curso Superior de {ph(state.cursoSuperior)},
          </p>

          <p className="m-0 mt-[2px]">
            na data de {ph(state.dataColacao)}, e a Colação de Grau na data de{" "}
            {ph(state.dataColacao)}, confere o título de
          </p>

          <div
            className="mt-[11px]"
            style={{
              fontFamily: diplomaFont,
              fontSize: "23px",
              lineHeight: 1,
              letterSpacing: "-0.25px",
            }}
          >
            {ph(state.titulo)} em {ph(state.cursoSuperior)} a
          </div>

          <div
            className="mt-[9px]"
            style={{
              fontFamily: diplomaFont,
              fontSize: "29px",
              lineHeight: 1,
              letterSpacing: "-0.4px",
            }}
          >
            {ph(state.nomeAluno)}
          </div>

          <p className="m-0 mt-[12px]">
            {ph(state.nacionalidade, "brasileiro(a)")}, natural de{" "}
            {naturalidade || "-"}, nascido(a) em {ph(state.dataNasc)},
          </p>

          <p className="m-0 mt-[2px]">
            RG nº {ph(state.rg)} e CPF nº {ph(state.cpf)},
          </p>

          <p className="m-0 mt-[10px]">e outorga-lhe o presente Diploma,</p>

          <p className="m-0 mt-[2px]">
            a fim de que possa gozar de todos os direitos e prerrogativas legais.
          </p>

          <p className="m-0 mt-[12px]">
            {ph(state.cidadeEmissao, "São Paulo")}, {ph(state.dataEmissao)}.
          </p>
        </main>

        <div
          className="absolute z-10 text-center"
          style={{
            left: "37.2%",
            width: "25.6%",
            top: "72.2%",
            fontFamily: registrationFont,
          }}
        >
          <div className="mx-auto h-[28px] w-[82%] border-b border-black" />
          <div className="mt-[4px] text-[8px] font-bold uppercase leading-none">
            {state.reitor || "SANDRA REJANE GOMES MIESSA"}
          </div>
          <div className="mt-[2px] text-[7.5px] leading-none">Reitora</div>
        </div>

        <div
          className="absolute z-10 text-left"
          style={{
            right: "9.6%",
            bottom: "10.2%",
            width: "19.5%",
            fontFamily: registrationFont,
            fontSize: "6.6px",
            lineHeight: 1.12,
          }}
        >
          <div>Documento digital</div>
          <div className="mt-[1px]">Código de validação:</div>
          <div className="break-all font-bold">{ph(state.codigoUnico)}</div>
        </div>

        <div className="hidden" aria-hidden="true">
          <MecStampBlock
            mec={state.mec}
            onChange={onMecChange}
            draggable={draggableMec}
          />
        </div>
      </section>

      {/* FOLHA 2, VERSO */}
      <section
        className="doc-sheet a4-landscape relative overflow-hidden bg-white text-black"
        style={{
          pageBreakBefore: "always",
          breakBefore: "page",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          fontFamily: registrationFont,
        }}
      >
        <div
          className="absolute text-center"
          style={{
            left: "9.2%",
            top: "25.5%",
            width: "45%",
            fontSize: "10px",
            lineHeight: 1.42,
          }}
        >
          <div className="font-bold uppercase">{state.mantenedora || "ASSUPERO - ENSINO SUPERIOR LTDA"}</div>
          <div>CNPJ {state.cnpj || "06.099.229/0001-01"}</div>

          <div className="mt-[26px]">Universidade Paulista - UNIP e-MEC 322</div>

          <div className="mt-[26px]">
            Recredenciada pela Portaria MEC nº {ph(state.portariaMec)}, publicada no Diário Oficial da União.
          </div>

          <div className="mt-[34px]">Curso Superior de {ph(state.cursoSuperior)}</div>

          <div className="mt-[26px]">e-MEC {ph(state.resolucao)}</div>
        </div>

        <div
          className="absolute"
          style={{
            right: "8.2%",
            top: "21.5%",
            width: "36.8%",
            height: "57.5%",
            border: "1.4px solid #111",
            fontSize: "9px",
            lineHeight: 1.22,
            padding: "12px 14px",
          }}
        >
          <div className="flex justify-between text-[9px] font-bold">
            <span>RA: {ph(state.raCode)}</span>
            <span>LOTE: {ph(state.lote)}</span>
          </div>

          <div className="mt-[8px] text-center font-bold uppercase">
            {state.mantenedora || "ASSUPERO - ENSINO SUPERIOR LTDA"}
          </div>
          <div className="text-center">CNPJ {state.cnpj || "06.099.229/0001-01"}</div>
          <div className="mt-[7px] text-center font-bold">UNIVERSIDADE PAULISTA - UNIP e-MEC 322</div>

          <p className="mt-[10px] text-center">
            Recredenciada pela Portaria MEC nº {ph(state.portariaMec)}, publicada no Diário Oficial da União.
          </p>

          <div className="mt-[14px] text-center font-bold">
            Secretaria Geral
            <br />
            Departamento de Registro de Diplomas
          </div>

          <p className="mt-[14px]">
            Diploma registrado sob nº {ph(state.folhaLivro)}, Livro {ph(state.livro)}, em{" "}
            {ph(state.dataEmissao)}, por delegação de competência do Ministério da Educação,
            nos termos da legislação vigente.
          </p>

          <p className="mt-[10px]">Processo nº {ph(state.codigoUnico)}</p>

          <p className="mt-[12px] text-center">
            {ph(state.cidadeEmissao, "São Paulo")}, {ph(state.dataEmissao)}.
          </p>

          <div className="absolute bottom-[24px] left-[18%] right-[18%] text-center">
            <div className="h-[34px] border-b border-black" />
            <div className="mt-[3px] text-[8px] font-bold uppercase">
              {ph(state.secretarioAdjunto)}
            </div>
            <div className="text-[7.5px]">Secretário Geral Adjunto</div>
          </div>
        </div>

        <div
          className="absolute text-center"
          style={{
            right: "9.5%",
            bottom: "7.2%",
            width: "12%",
            fontSize: "7px",
            lineHeight: 1.15,
          }}
        >
          <div className="mx-auto flex h-[70px] w-[70px] items-center justify-center border border-black text-[7px]">
            QR CODE
          </div>
          <div className="mt-[3px] break-all">{ph(state.codigoUnico)}</div>
        </div>
      </section>
    </>
  );
}
