import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const saveSchema = z.object({
  verification_uuid: z.string().uuid(),
  nivel: z.string().default("superior"),
  universidade: z.string().nullish(),
  nome_aluno: z.string().min(1),
  cpf: z.string().nullish(),
  curso: z.string().nullish(),
  instituicao: z.string().nullish(),
  data_conclusao: z.string().nullish(),
  carga_horaria: z.string().nullish(),
  numero_registro: z.string().nullish(),
  data_nascimento: z.string().nullish(),
  ano_conclusao: z.union([z.string(), z.number()]).nullish(),
  estado: z.string().nullish(),
  cidade: z.string().nullish(),
  endereco: z.string().nullish(),
  nivel_label: z.string().nullish(),
});

type SupabaseErrorLike = {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

type CertificadoRegistro = {
  id?: string;
  codigo: string;
  nome: string | null;
  cpf: string | null;
  curso: string | null;
  nivel: string | null;
  ano_conclusao: number | null;
  instituicao: string | null;
  estado: string | null;
  cidade: string | null;
  registro: string | null;
};

type CertificadoPublico = {
  codigo: string;
  nome: string;
  cpf: string | null;
  curso: string | null;
  ano_conclusao: number | null;
  instituicao: string | null;
  estado: string | null;
  cidade: string | null;
  registro: string | null;
  data_emissao: string;
  ativo: boolean;
};

async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function maskCpf(cpf: string | null): string | null {
  if (!cpf) return null;

  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) {
    return cpf;
  }

  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
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

function textoOuNull(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

export const saveHistorico = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => saveSchema.parse(raw))
  .handler(async ({ data, context }) => {
    // O cast evita erro de tipagem caso os tipos gerados do Supabase
    // ainda não contenham a tabela certificados_registros.
    const supabase = context.supabase as unknown as SupabaseClient;

    const hash = await sha256(
      [
        data.verification_uuid,
        data.nome_aluno,
        data.cpf ?? "",
        data.curso ?? "",
        data.instituicao ?? "",
      ].join("|"),
    );

    // 1. Salva o histórico privado do usuário autenticado.
    const { error: historicoError } = await supabase
      .from("historicos")
      .upsert(
        {
          verification_uuid: data.verification_uuid,
          owner_id: context.userId,
          nivel: data.nivel,
          universidade: data.universidade ?? null,
          nome_aluno: data.nome_aluno,
          cpf: data.cpf ?? null,
          curso: data.curso ?? null,
          instituicao: data.instituicao ?? null,
          data_conclusao: data.data_conclusao ?? null,
          carga_horaria: data.carga_horaria ?? null,
          numero_registro: data.numero_registro ?? null,
          hash,
          verified: true,
        },
        {
          onConflict: "verification_uuid",
        },
      );

    if (historicoError) {
      console.error("[historicos upsert]", historicoError);

      throw new Error(
        `Não foi possível salvar o histórico:\n${formatSupabaseError(
          historicoError,
        )}`,
      );
    }

    const anoConclusao = getAnoConclusao(
      data.ano_conclusao,
      data.data_conclusao,
    );

    const nivelLabel =
      textoOuNull(data.nivel_label) ??
      (data.nivel === "medio" ? "Ensino Médio" : "Ensino Superior");

    // Somente colunas confirmadas na tabela real public.certificados_registros.
    const certificadoPayload: CertificadoRegistro = {
      codigo: data.verification_uuid,
      nome: textoOuNull(data.nome_aluno),
      cpf: textoOuNull(data.cpf),
      curso: textoOuNull(data.curso),
      nivel: nivelLabel,
      ano_conclusao: anoConclusao,
      instituicao:
        textoOuNull(data.instituicao) ?? textoOuNull(data.universidade),
      estado: textoOuNull(data.estado)?.toUpperCase() ?? null,
      cidade: textoOuNull(data.cidade),
      registro: textoOuNull(data.numero_registro),
    };

    // 2. Procura o certificado público pelo código.
    const { data: existenteRaw, error: buscaError } = await supabase
      .from("certificados_registros")
      .select("id")
      .eq("codigo", certificadoPayload.codigo)
      .limit(1)
      .maybeSingle();

    if (buscaError) {
      console.error("[certificados_registros select]", buscaError);

      throw new Error(
        `Não foi possível consultar o certificado público:\n${formatSupabaseError(
          buscaError,
        )}`,
      );
    }

    const existente = existenteRaw as { id: string } | null;
    let certificadoSalvo: CertificadoRegistro | null = null;

    // 3. Atualiza quando já existe ou insere quando ainda não existe.
    if (existente?.id) {
      const { data: atualizado, error: atualizacaoError } = await supabase
        .from("certificados_registros")
        .update(certificadoPayload)
        .eq("id", existente.id)
        .select(
          "id,codigo,nome,cpf,curso,nivel,ano_conclusao,instituicao,estado,cidade,registro",
        )
        .single();

      if (atualizacaoError) {
        console.error("[certificados_registros update]", atualizacaoError);

        throw new Error(
          `Não foi possível atualizar o certificado público:\n${formatSupabaseError(
            atualizacaoError,
          )}`,
        );
      }

      certificadoSalvo = atualizado as CertificadoRegistro;
    } else {
      const { data: inserido, error: insercaoError } = await supabase
        .from("certificados_registros")
        .insert(certificadoPayload)
        .select(
          "id,codigo,nome,cpf,curso,nivel,ano_conclusao,instituicao,estado,cidade,registro",
        )
        .single();

      if (insercaoError) {
        console.error("[certificados_registros insert]", insercaoError);

        throw new Error(
          `Não foi possível inserir o certificado público:\n${formatSupabaseError(
            insercaoError,
          )}`,
        );
      }

      certificadoSalvo = inserido as CertificadoRegistro;
    }

    if (!certificadoSalvo) {
      throw new Error(
        "O banco não retornou os dados do certificado público salvo.",
      );
    }

    return {
      ok: true,
      hash,
      verification_uuid: data.verification_uuid,
      nivel: nivelLabel,
      certificado: certificadoSalvo,
    };
  });

export const verifyHistorico = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z
      .object({
        uuid: z.string().uuid(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const supabaseUrl =
      process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;

    const publicKey =
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !publicKey) {
      throw new Error(
        "As variáveis SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY não estão configuradas.",
      );
    }

    // A leitura pública continua usando a VIEW public.certificados.
    const query =
      `${supabaseUrl}/rest/v1/certificados` +
      `?codigo=eq.${encodeURIComponent(data.uuid)}` +
      "&select=codigo,nome,cpf,curso,ano_conclusao,instituicao,estado,cidade,registro,data_emissao,ativo" +
      "&limit=1";

    const response = await fetch(query, {
      headers: {
        apikey: publicKey,
        Authorization: `Bearer ${publicKey}`,
      },
    });

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        `Erro ao consultar certificado público: ${message}`,
      );
    }

    const rows = (await response.json()) as CertificadoPublico[];
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
      curso: row.curso,
      instituicao: row.instituicao,
      data_conclusao: row.ano_conclusao
        ? String(row.ano_conclusao)
        : null,
      carga_horaria: null,
      numero_registro: row.registro,
      issued_at: row.data_emissao,
      hash: "",
      nivel: "certificado",
      universidade: null,
    };
  });
