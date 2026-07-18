import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

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
});

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const saveHistorico = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => saveSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const hash = await sha256(
      [data.verification_uuid, data.nome_aluno, data.cpf ?? "", data.curso ?? "", data.instituicao ?? ""].join("|"),
    );

    const { error } = await context.supabase.from("historicos").upsert(
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
      { onConflict: "verification_uuid" },
    );
    if (error) throw new Error(error.message);
    return { ok: true, hash };
  });

function maskCpf(cpf: string | null): string | null {
  if (!cpf) return null;
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
}

export const verifyHistorico = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => z.object({ uuid: z.string().uuid() }).parse(raw))
  .handler(async ({ data }) => {
    // Admin client used for read-only public verification (bypasses RLS).
    // Only a fixed, safe projection is returned; CPF is masked.
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: row } = await supabase
      .from("historicos")
      .select("verification_uuid, nome_aluno, cpf, curso, instituicao, data_conclusao, carga_horaria, numero_registro, issued_at, verified, hash, nivel, universidade")
      .eq("verification_uuid", data.uuid)
      .maybeSingle();

    if (!row || !row.verified) return { found: false as const };
    return {
      found: true as const,
      verification_uuid: row.verification_uuid,
      nome_aluno: row.nome_aluno,
      cpf: maskCpf(row.cpf),
      curso: row.curso,
      instituicao: row.instituicao,
      data_conclusao: row.data_conclusao,
      carga_horaria: row.carga_horaria,
      numero_registro: row.numero_registro,
      issued_at: row.issued_at,
      hash: row.hash,
      nivel: row.nivel,
      universidade: row.universidade,
    };
  });
