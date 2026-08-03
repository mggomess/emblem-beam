import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Cache-Control": "public, max-age=30",
};

const codigoSchema = z.string().uuid();

const FIELDS = [
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
].join(",");

export const Route = createFileRoute("/api/public/certificados/$codigo")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ params }) => {
        const parsed = codigoSchema.safeParse(params.codigo);

        if (!parsed.success) {
          return Response.json(
            { found: false, error: "Código inválido." },
            { status: 400, headers: CORS },
          );
        }

        const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
        const key =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ??
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

        if (!url || !key) {
          return Response.json(
            { found: false, error: "Backend não configurado." },
            { status: 500, headers: CORS },
          );
        }

        // View pública `certificados`: CPF já vem mascarado, sem PII bruta.
        const supabase = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data, error } = await supabase
          .from("certificados")
          .select(FIELDS)
          .eq("codigo", parsed.data)
          .limit(1)
          .maybeSingle();

        if (error) {
          return Response.json(
            { found: false, error: "Falha na consulta." },
            { status: 502, headers: CORS },
          );
        }

        if (!data) {
          return Response.json({ found: false }, { status: 404, headers: CORS });
        }

        return Response.json({ found: true, certificado: data }, { headers: CORS });
      },
    },
  },
});
