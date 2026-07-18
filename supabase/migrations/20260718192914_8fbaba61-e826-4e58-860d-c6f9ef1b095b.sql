
CREATE TABLE IF NOT EXISTS public.certificados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  nome text NOT NULL DEFAULT '',
  cpf text NOT NULL DEFAULT '',
  data_nascimento date NOT NULL DEFAULT CURRENT_DATE,
  curso text NOT NULL DEFAULT '',
  nivel text NOT NULL DEFAULT 'Ensino Superior',
  ano_conclusao integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::int,
  instituicao text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT '',
  cidade text NOT NULL DEFAULT '',
  endereco text NOT NULL DEFAULT '',
  registro text NOT NULL DEFAULT '',
  data_emissao date NOT NULL DEFAULT CURRENT_DATE,
  ativo boolean NOT NULL DEFAULT true,
  owner_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.certificados TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificados TO authenticated;
GRANT ALL ON public.certificados TO service_role;

ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Consulta pública de certificados" ON public.certificados;
CREATE POLICY "Consulta pública de certificados"
  ON public.certificados FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Autenticados podem inserir certificados" ON public.certificados;
CREATE POLICY "Autenticados podem inserir certificados"
  ON public.certificados FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Dono edita certificado" ON public.certificados;
CREATE POLICY "Dono edita certificado"
  ON public.certificados FOR UPDATE TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Dono remove certificado" ON public.certificados;
CREATE POLICY "Dono remove certificado"
  ON public.certificados FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

CREATE INDEX IF NOT EXISTS certificados_codigo_idx ON public.certificados(codigo);

DROP TRIGGER IF EXISTS trg_certificados_updated_at ON public.certificados;
CREATE TRIGGER trg_certificados_updated_at
  BEFORE UPDATE ON public.certificados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
