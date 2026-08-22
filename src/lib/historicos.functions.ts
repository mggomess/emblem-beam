import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ============================================================
 * Validação dos dados recebidos
 * ============================================================ */

const saveSchema = z.object({
  verification_uuid: z.string().uuid(),

  nivel: z.string().default("superior"),
  nivel_label: z.string().nullish(),

  universidade: z.string().nullish(),
  instituicao: z.string().nullish(),

  nome_aluno: z.string().min(1),
  cpf: z.string().nullish(),
  data_nascimento: z.string().nullish(),

  curso: z.string().nullish(),
  data_conclusao: z.string().nullish(),
  ano_conclusao: z.union([z.string(), z.number()]).nullish(),
  carga_horaria: z.string().nullish(),

  numero_registro: z.string().nullish(),

  estado: z.string().nullish(),
  cidade: z.string().nullish(),
  endereco: z.string().nullish(),
});

/* ============================================================
 * Tipos
 * ============================================================ */

type SupabaseErrorLike = {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

type CertificadoPublico = {
  codigo: string;
  nome: string;
  cpf: string | null;
  data_nascimento: string | null;
  curso: string | null;
  nivel: string | null;
  ano_conclusao: number | null;
  instituicao: string | null;
  estado: string | null;
  cidade: string | null;
  endereco: string | null;
  registro: string | null;
  data_emissao: string;
  ativo: boolean;
};

/* ============================================================
 * Funções auxiliares
 * ============================================================ */

async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function maskCpf(cpf: string | null): string | null {
  if (!cpf) {
    return null;
  }

  const digits = cpf.replace(/\D/g, "");

  if (digits.length >= 11) {
    const d = digits.slice(-11);
    return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
  }

  if (digits.length >= 5) {
    return `***.${digits.slice(3, 6)}.***-**`;
  }

  return cpf;
}

function formatSupabaseError(error: SupabaseErrorLike): string {
  return JSON.stringify(
    {
      code: error.code ?? null,
      details: error.details ?? null,
      hint: error.hint ?? null,
      message: error.message,
    },
    null,
    2,
  );
}

function getAnoConclusao(
  anoConclusao: string | number | null | undefined,
  dataConclusao: string | null | undefined,
): number {
  const anoInformado =
    anoConclusao ?? dataConclusao?.match(/\d{4}/)?.[0] ?? null;

  const ano = Number(anoInformado);

  if (Number.isInteger(ano) && ano >= 1900 && ano <= 2200) {
    return ano;
  }

  return new Date().getFullYear();
}

function textoOuNull(
  value: string | null | undefined,
): string | null {
  const text = value?.trim();

  return text ? text : null;
}

/** Normaliza datas (dd/mm/aaaa ou ISO) para o formato aceito pelo banco. */
function toIsoDate(
  value: string | null | undefined,
): string | null {
  const text = textoOuNull(value);
  if (!text) return null;

  const br = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);

  return null;
}


/* ============================================================
 * Salvar histórico e certificado público
 * ============================================================ */

export const saveHistorico = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => saveSchema.parse(raw))
  .handler(async ({ data, context }) => {
    /*
     * O Supabase recebido pelo middleware deve conter a sessão
     * do usuário autenticado.
     */
    const supabase =
      context.supabase as unknown as SupabaseClient;

    const nomeAluno = data.nome_aluno.trim();

    const instituicao =
      textoOuNull(data.instituicao) ??
      textoOuNull(data.universidade);

    const anoConclusao = getAnoConclusao(
      data.ano_conclusao,
      data.data_conclusao,
    );

    const nivelLabel =
      textoOuNull(data.nivel_label) ??
      (data.nivel === "medio"
        ? "Ensino Médio"
        : "Ensino Superior");

    const hash = await sha256(
      [
        data.verification_uuid,
        nomeAluno,
        data.cpf ?? "",
        data.curso ?? "",
        instituicao ?? "",
      ].join("|"),
    );

    /* --------------------------------------------------------
     * 1. Salvar o histórico privado
     * -------------------------------------------------------- */

    const { error: historicoError } = await supabase
      .from("historicos")
      .upsert(
        {
          verification_uuid: data.verification_uuid,
          owner_id: context.userId,

          nivel: data.nivel,
          universidade: data.universidade ?? null,

          nome_aluno: nomeAluno,
          cpf: textoOuNull(data.cpf),
          curso: textoOuNull(data.curso),
          instituicao,

          data_conclusao: textoOuNull(data.data_conclusao),
          carga_horaria: textoOuNull(data.carga_horaria),
          numero_registro: textoOuNull(data.numero_registro),

          hash,
          verified: true,
        },
        {
          onConflict: "verification_uuid",
        },
      );

    if (historicoError) {
      console.error(
        "[historicos upsert]",
        historicoError,
      );

      throw new Error(
        `Não foi possível salvar o histórico:\n${formatSupabaseError(
          historicoError,
        )}`,
      );
    }

    /* --------------------------------------------------------
     * 2. Montar o registro público
     *
     * codigo recebe exatamente o verification_uuid usado pelo QR.
     * -------------------------------------------------------- */

    const dataNascimento = toIsoDate(data.data_nascimento);

    const certificadoPayload = {
      codigo: data.verification_uuid,

      nome: nomeAluno,
      cpf: textoOuNull(data.cpf) ?? "",
      ...(dataNascimento ? { data_nascimento: dataNascimento } : {}),

      curso: textoOuNull(data.curso) ?? "",
      nivel: nivelLabel,
      ano_conclusao: anoConclusao,

      instituicao: instituicao ?? "",

      estado:
        textoOuNull(data.estado)?.toUpperCase() ?? "",

      cidade: textoOuNull(data.cidade) ?? "",
      endereco: textoOuNull(data.endereco) ?? "",

      registro: textoOuNull(data.numero_registro) ?? "",

      data_emissao: new Date().toISOString().slice(0, 10),
      ativo: true,
      owner_id: context.userId,
    };


    /* --------------------------------------------------------
     * 3. Salvar em public.certificados_registros
     *
     * A view pública public.certificados lê desta tabela
     * mascarando o CPF.
     * -------------------------------------------------------- */

    const { error: certificadoError } = await supabase
      .from("certificados_registros")
      .upsert(certificadoPayload, {
        onConflict: "codigo",
        ignoreDuplicates: false,
      });

    if (certificadoError) {
      console.error(
        "[certificados upsert]",
        certificadoError,
      );

      throw new Error(
        `Não foi possível salvar o certificado para consulta pública:\n${formatSupabaseError(
          certificadoError,
        )}`,
      );
    }

    const certificadoSalvo: CertificadoPublico = {
      ...certificadoPayload,
      data_nascimento: dataNascimento,
      cpf: maskCpf(certificadoPayload.cpf),
    };



    return {
      ok: true,
      hash,

      verification_uuid: data.verification_uuid,
      nivel: nivelLabel,

      certificado: certificadoSalvo,
    };
  });

/* ============================================================
 * Consultar certificado público
 * ============================================================ */

export const verifyHistorico = createServerFn({
  method: "GET",
})
  .inputValidator((raw: unknown) =>
    z
      .object({
        uuid: z.string().uuid(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const supabaseUrl =
      process.env.SUPABASE_URL ??
      process.env.VITE_SUPABASE_URL;

    const publicKey =
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !publicKey) {
      throw new Error(
        "As variáveis SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY não estão configuradas.",
      );
    }

    const normalizedSupabaseUrl =
      supabaseUrl.replace(/\/+$/, "");

    /*
     * Consulta pública diretamente em public.certificados
     * usando certificados.codigo = verification_uuid.
     */
    const query =
      `${normalizedSupabaseUrl}/rest/v1/certificados` +
      `?codigo=eq.${encodeURIComponent(data.uuid)}` +
      "&select=" +
      [
        "codigo",
        "nome",
        "cpf",
        "data_nascimento",
        "curso",
        "nivel",
        "ano_conclusao",
        "instituicao",
        "estado",
        "cidade",
        "endereco",
        "registro",
        "data_emissao",
        "ativo",
      ].join(",") +
      "&limit=1";

    const response = await fetch(query, {
      method: "GET",
      headers: {
        apikey: publicKey,
        Authorization: `Bearer ${publicKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        `Erro ao consultar certificado público: ${message}`,
      );
    }

    const rows =
      (await response.json()) as CertificadoPublico[];

    const row = rows[0];

    if (!row || !row.ativo) {
      return {
        found: false as const,
      };
    }

    return {
      found: true as const,

      verification_uuid: row.codigo,

      nome_aluno: row.nome,
      cpf: maskCpf(row.cpf),
      data_nascimento: row.data_nascimento,

      curso: row.curso,
      nivel: row.nivel ?? "certificado",

      instituicao: row.instituicao,
      universidade: row.instituicao,

      data_conclusao:
        row.ano_conclusao !== null
          ? String(row.ano_conclusao)
          : null,

      ano_conclusao: row.ano_conclusao,
      carga_horaria: null,

      numero_registro: row.registro,

      estado: row.estado,
      cidade: row.cidade,
      endereco: row.endereco,

      issued_at: row.data_emissao,

      hash: "",
    };
  });
