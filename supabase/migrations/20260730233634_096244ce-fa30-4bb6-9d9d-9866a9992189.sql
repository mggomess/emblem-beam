DROP VIEW IF EXISTS public.certificados;

CREATE VIEW public.certificados
WITH (security_invoker = off) AS
SELECT
  c.codigo,
  c.nome,
  CASE
    WHEN length(regexp_replace(COALESCE(c.cpf, ''), '\D', '', 'g')) = 11
      THEN '***.' || substr(regexp_replace(c.cpf, '\D', '', 'g'), 4, 3) || '.' ||
           substr(regexp_replace(c.cpf, '\D', '', 'g'), 7, 3) || '-**'
    ELSE NULL
  END AS cpf,
  c.data_nascimento,
  c.curso,
  c.nivel,
  c.ano_conclusao,
  c.instituicao,
  c.estado,
  c.cidade,
  c.endereco,
  c.registro,
  c.data_emissao,
  c.ativo
FROM public.certificados_registros c
WHERE c.ativo IS TRUE;

GRANT SELECT ON public.certificados TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificados_registros TO authenticated;
GRANT ALL ON public.certificados_registros TO service_role;

CREATE UNIQUE INDEX IF NOT EXISTS certificados_registros_codigo_key
  ON public.certificados_registros (codigo);