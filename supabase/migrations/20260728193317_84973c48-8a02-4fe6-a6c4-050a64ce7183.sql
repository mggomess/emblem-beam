
ALTER TABLE public.certificados RENAME TO certificados_registros;

DROP POLICY IF EXISTS "Public can verify certificados" ON public.certificados_registros;
DROP POLICY IF EXISTS "Certificados são públicos para leitura" ON public.certificados_registros;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='certificados_registros' AND 'anon' = ANY(roles) LOOP
    EXECUTE format('DROP POLICY %I ON public.certificados_registros', pol.policyname);
  END LOOP;
END $$;

REVOKE ALL ON public.certificados_registros FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificados_registros TO authenticated;
GRANT ALL ON public.certificados_registros TO service_role;

CREATE OR REPLACE VIEW public.certificados
WITH (security_invoker = false) AS
SELECT
  c.codigo,
  c.nome,
  CASE
    WHEN length(regexp_replace(coalesce(c.cpf,''), '\D', '', 'g')) = 11
      THEN '***.' || substr(regexp_replace(c.cpf, '\D', '', 'g'), 4, 3)
           || '.' || substr(regexp_replace(c.cpf, '\D', '', 'g'), 7, 3) || '-**'
    ELSE NULL
  END AS cpf,
  c.curso,
  c.nivel,
  c.ano_conclusao,
  c.instituicao,
  c.estado,
  c.cidade,
  c.registro,
  c.data_emissao,
  c.ativo
FROM public.certificados_registros c
WHERE c.ativo IS TRUE;

GRANT SELECT ON public.certificados TO anon, authenticated;
