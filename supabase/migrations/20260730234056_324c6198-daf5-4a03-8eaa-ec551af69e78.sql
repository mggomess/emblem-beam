DROP POLICY IF EXISTS "Autenticados podem inserir certificados" ON public.certificados_registros;
DROP POLICY IF EXISTS "Dono edita certificado" ON public.certificados_registros;
DROP POLICY IF EXISTS "Dono le certificado" ON public.certificados_registros;

CREATE POLICY "Autenticados criam certificados"
  ON public.certificados_registros FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados leem certificados"
  ON public.certificados_registros FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados atualizam certificados"
  ON public.certificados_registros FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);