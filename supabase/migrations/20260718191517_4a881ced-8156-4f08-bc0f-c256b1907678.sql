
CREATE TABLE public.historicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verification_uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nivel TEXT NOT NULL DEFAULT 'superior',
  universidade TEXT,
  nome_aluno TEXT NOT NULL,
  cpf TEXT,
  curso TEXT,
  instituicao TEXT,
  data_conclusao TEXT,
  carga_horaria TEXT,
  numero_registro TEXT,
  hash TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.historicos TO authenticated;
GRANT ALL ON public.historicos TO service_role;

ALTER TABLE public.historicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own historicos"
  ON public.historicos FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE TRIGGER update_historicos_updated_at
  BEFORE UPDATE ON public.historicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX historicos_owner_idx ON public.historicos(owner_id);
