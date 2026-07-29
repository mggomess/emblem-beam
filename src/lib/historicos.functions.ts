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

type RpcResult<T> = Promise<{
  data: T | null;
  error: SupabaseErrorLike | null;
}>;

type SupabaseRpcClient = {
  rpc: <T = unknown>(
    functionName: string,
    args: Record<string, unknown>,
  ) => RpcResult<T>;
};

type CertificadoRpcResult = {
  codigo: string;
  nome: string;
  curso: string;
  nivel: string;
  ativo: boolean;
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

function toIsoDate(value?: string | null): string | null {
  if (!value) return null;

  const text = value.trim();
  const brDate = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brDate) {
    return `${brDate[3]}-${brDate[2]}-${brDate[1]}`;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  return null;
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

export const saveHistorico = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => saveSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const hash = await sha256(
      [
        data.verification_uuid,
        data.nome_aluno,
        data.cpf ?? "",
        data.curso ?? "",
        data.instituicao ?? "",
      ].join("|"),
    );

    const { error: historicoError } = await context.supabase
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
        `Não foi possível salvar o histórico: ${historicoError.message}`,
      );
    }

    const anoConclusao =
      Number(
        data.ano_conclusao ??
          data.data_conclusao?.match(/\d{4}/)?.[0] ??
          new Date().getFullYear(),
      ) || new Date().getFullYear();

    const dataNascimento =
      toIsoDate(data.data_nascimento) ??
      new Date().toISOString().slice(0, 10);

    const nivelLabel =
      data.nivel_label ??
      (data.nivel === "medio" ? "Ensino Médio" : "Ensino Superior");

    const certificado = {
      codigo: data.verification_uuid,
      nome: data.nome_aluno,
      cpf: data.cpf ?? "",
      data_nascimento: dataNascimento,
      curso: data.curso ?? "",
      nivel: nivelLabel,
      ano_conclusao: anoConclusao,
      instituicao: data.instituicao ?? data.universidade ?? "",
      estado: data.estado ?? "",
      cidade: data.cidade ?? "",
      endereco: data.endereco ?? "",
      registro: data.numero_registro ?? "",
      data_emissao: new Date().toISOString().slice(0, 10),
      ativo: true,
    };

    const rpcClient = context.supabase as unknown as SupabaseRpcClient;

    const {
      data: certificadoSalvo,
      error: certificadoError,
    } = await rpcClient.rpc<CertificadoRpcResult>(
      "upsert_certificado_publico",
      {
        p_payload: certificado,
      },
    );

    if (certificadoError) {
      console.error(
        "[upsert_certificado_publico]",
        certificadoError,
      );

      throw new Error(
        `Não foi possível salvar o certificado público:\n${formatSupabaseError(
          certificadoError,
        )}`,
      );
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
