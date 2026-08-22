CREATE OR REPLACE VIEW public.certificados
WITH (security_invoker = false) AS
SELECT
  codigo,
  nome,
  CASE
    WHEN length(regexp_replace(COALESCE(cpf, ''), '\D', '', 'g')) >= 11 THEN
      '***.' ||
      substr(right(regexp_replace(cpf, '\D', '', 'g'), 11), 4, 3) || '.' ||
      substr(right(regexp_replace(cpf, '\D', '', 'g'), 11), 7, 3) || '-**'
    WHEN length(regexp_replace(COALESCE(cpf, ''), '\D', '', 'g')) >= 5 THEN
      '***.' || substr(regexp_replace(cpf, '\D', '', 'g'), 4, 3) || '.***-**'
    ELSE NULL
  END AS cpf,
  data_nascimento,
  curso,
  nivel,
  ano_conclusao,
  instituicao,
  estado,
  cidade,
  endereco,
  registro,
  data_emissao,
  ativo
FROM public.certificados_registros c
WHERE ativo IS TRUE;

GRANT SELECT ON public.certificados TO anon, authenticated;
NOTIFY pgrst, 'reload schema';