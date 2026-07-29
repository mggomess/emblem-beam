BEGIN;

-- Mantém a tabela protegida por RLS
ALTER TABLE public.certificados_registros
ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas e conflitantes somente desta tabela
DO $$
DECLARE
  politica RECORD;
BEGIN
  FOR politica IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'certificados_registros'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.certificados_registros',
      politica.policyname
    );
  END LOOP;
END
$$;

-- Limpa permissões antigas
REVOKE ALL
ON TABLE public.certificados_registros
FROM anon, authenticated;

-- Site público de consulta pode somente consultar
GRANT SELECT
ON TABLE public.certificados_registros
TO anon, authenticated;

-- Usuário logado no site emissor pode inserir e atualizar
GRANT INSERT, UPDATE
ON TABLE public.certificados_registros
TO authenticated;

-- Necessário caso a tabela use ID serial/sequence
GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO authenticated;

-- Consulta pública pelo QR Code
CREATE POLICY "consulta_publica_certificados"
ON public.certificados_registros
AS PERMISSIVE
FOR SELECT
TO anon, authenticated
USING (true);

-- Emissão somente para usuário logado
CREATE POLICY "emissao_autenticada_certificados"
ON public.certificados_registros
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Necessário caso o código use upsert
CREATE POLICY "atualizacao_autenticada_certificados"
ON public.certificados_registros
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

NOTIFY pgrst, 'reload schema';

COMMIT;
