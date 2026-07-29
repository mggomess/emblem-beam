-- ============================================================
-- TABELA DE CERTIFICADOS PÚBLICOS
-- Compatível com banco novo ou tabela já existente
-- ============================================================

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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- GARANTE AS COLUNAS QUANDO A TABELA JÁ EXISTE
-- CREATE TABLE IF NOT EXISTS não adiciona colunas faltantes
-- ============================================================

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS codigo text;

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS nome text NOT NULL DEFAULT '';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS cpf text NOT NULL DEFAULT '';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS data_nascimento date NOT NULL DEFAULT CURRENT_DATE;

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS curso text NOT NULL DEFAULT '';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS nivel text NOT NULL DEFAULT 'Ensino Superior';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS ano_conclusao integer
  NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::int;

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS instituicao text NOT NULL DEFAULT '';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS estado text NOT NULL DEFAULT '';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS cidade text NOT NULL DEFAULT '';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS endereco text NOT NULL DEFAULT '';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS registro text NOT NULL DEFAULT '';

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS data_emissao date NOT NULL DEFAULT CURRENT_DATE;

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS ativo boolean NOT NULL DEFAULT true;

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.certificados
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ============================================================
-- CÓDIGO ÚNICO
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS certificados_codigo_unique
  ON public.certificados (codigo);

CREATE INDEX IF NOT EXISTS certificados_codigo_idx
  ON public.certificados (codigo);

-- ============================================================
-- PERMISSÕES
-- ============================================================

GRANT SELECT ON public.certificados TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.certificados
  TO authenticated;

GRANT ALL
  ON public.certificados
  TO service_role;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Consulta pública de certificados"
  ON public.certificados;

DROP POLICY IF EXISTS "Autenticados podem inserir certificados"
  ON public.certificados;

DROP POLICY IF EXISTS "Dono edita certificado"
  ON public.certificados;

DROP POLICY IF EXISTS "Dono remove certificado"
  ON public.certificados;

DROP POLICY IF EXISTS "Usuário autenticado insere certificado"
  ON public.certificados;

DROP POLICY IF EXISTS "Usuário autenticado atualiza certificado"
  ON public.certificados;

DROP POLICY IF EXISTS "Usuário autenticado remove certificado"
  ON public.certificados;

-- O público só consegue consultar certificados ativos.
CREATE POLICY "Consulta pública de certificados"
  ON public.certificados
  FOR SELECT
  TO anon, authenticated
  USING (ativo IS TRUE);

-- Usuários autenticados podem inserir.
CREATE POLICY "Usuário autenticado insere certificado"
  ON public.certificados
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Não utiliza owner_id porque essa coluna não existe
-- na estrutura atual do seu banco.
CREATE POLICY "Usuário autenticado atualiza certificado"
  ON public.certificados
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuário autenticado remove certificado"
  ON public.certificados
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- FUNÇÃO E TRIGGER DE UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_certificados_updated_at
  ON public.certificados;

CREATE TRIGGER trg_certificados_updated_at
  BEFORE UPDATE ON public.certificados
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Atualiza o cache de schema utilizado pela API do Supabase.
NOTIFY pgrst, 'reload schema';
