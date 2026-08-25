-- Backfill: atribui registros sem dono ao único usuário existente (admin)
UPDATE public.certificados_registros cr
SET owner_id = (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)
WHERE cr.owner_id IS NULL;

ALTER TABLE public.certificados_registros
  ALTER COLUMN owner_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Autenticados leem certificados" ON public.certificados_registros;
DROP POLICY IF EXISTS "Autenticados atualizam certificados" ON public.certificados_registros;
DROP POLICY IF EXISTS "Autenticados criam certificados" ON public.certificados_registros;

CREATE POLICY "Dono le certificados"
  ON public.certificados_registros
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Dono cria certificados"
  ON public.certificados_registros
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Dono atualiza certificados"
  ON public.certificados_registros
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());