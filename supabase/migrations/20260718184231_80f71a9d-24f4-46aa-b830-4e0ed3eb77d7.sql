
-- 1) Extend courses with institutional metadata
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS universidade text,
  ADD COLUMN IF NOT EXISTS codigo_emec text,
  ADD COLUMN IF NOT EXISTS reconhecimento_portaria text,
  ADD COLUMN IF NOT EXISTS publicacao_dou text,
  ADD COLUMN IF NOT EXISTS forma_ingresso text,
  ADD COLUMN IF NOT EXISTS ch_exigida integer;

-- 2) curriculum_matrices — shared catalog
CREATE TABLE IF NOT EXISTS public.curriculum_matrices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  universidade text NOT NULL,
  curso text NOT NULL,
  versao text NOT NULL DEFAULT '2024',
  carga_horaria integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (universidade, curso, versao)
);

GRANT SELECT ON public.curriculum_matrices TO authenticated;
GRANT ALL ON public.curriculum_matrices TO service_role;

ALTER TABLE public.curriculum_matrices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "curriculum_matrices readable by authenticated"
  ON public.curriculum_matrices FOR SELECT
  TO authenticated USING (true);

CREATE TRIGGER curriculum_matrices_updated
  BEFORE UPDATE ON public.curriculum_matrices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) curriculum_disciplines
CREATE TABLE IF NOT EXISTS public.curriculum_disciplines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  matrix_id uuid NOT NULL REFERENCES public.curriculum_matrices(id) ON DELETE CASCADE,
  ordem integer NOT NULL DEFAULT 0,
  periodo text NOT NULL,
  codigo text NOT NULL,
  nome text NOT NULL,
  carga_horaria integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS curriculum_disciplines_matrix_idx
  ON public.curriculum_disciplines(matrix_id, ordem);

GRANT SELECT ON public.curriculum_disciplines TO authenticated;
GRANT ALL ON public.curriculum_disciplines TO service_role;

ALTER TABLE public.curriculum_disciplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "curriculum_disciplines readable by authenticated"
  ON public.curriculum_disciplines FOR SELECT
  TO authenticated USING (true);

-- 4) Seed base matrices for the 20 UNIP + 20 ESTACIO courses.
-- Insert one matrix per (university, course) with an empty carga horária stub.
DO $$
DECLARE
  v_uni text;
  v_curso text;
  v_id uuid;
  cursos text[] := ARRAY[
    'Administração','Análise e Desenvolvimento de Sistemas','Arquitetura e Urbanismo',
    'Biomedicina','Ciência da Computação','Ciências Contábeis','Direito',
    'Educação Física','Enfermagem','Engenharia Civil','Engenharia da Computação',
    'Engenharia de Produção','Engenharia Elétrica','Engenharia Mecânica',
    'Farmácia','Nutrição','Odontologia','Pedagogia','Psicologia','Sistemas de Informação'
  ];
  unis text[] := ARRAY['UNIP','ESTACIO'];
BEGIN
  FOREACH v_uni IN ARRAY unis LOOP
    FOREACH v_curso IN ARRAY cursos LOOP
      INSERT INTO public.curriculum_matrices (universidade, curso, versao, carga_horaria)
      VALUES (v_uni, v_curso, '2024', 3200)
      ON CONFLICT (universidade, curso, versao) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- 5) Seed disciplinas completas para 4 cursos-âncora (aplicado a ambas as universidades)
DO $$
DECLARE
  m_id uuid;
  v_uni text;
  unis text[] := ARRAY['UNIP','ESTACIO'];

  -- Pedagogia (30 disciplinas)
  ped_data text[][] := ARRAY[
    ['1','PED101','Fundamentos da Educação','80'],
    ['1','PED102','Psicologia do Desenvolvimento','80'],
    ['1','PED103','Filosofia da Educação','60'],
    ['1','PED104','Sociologia da Educação','60'],
    ['1','PED105','História da Educação','60'],
    ['2','PED201','Didática Geral','80'],
    ['2','PED202','Metodologia Científica','60'],
    ['2','PED203','Psicologia da Aprendizagem','80'],
    ['2','PED204','Currículo e Avaliação','60'],
    ['3','PED301','Alfabetização e Letramento','80'],
    ['3','PED302','Educação Infantil','80'],
    ['3','PED303','Ensino de Matemática','60'],
    ['3','PED304','Ensino de Ciências','60'],
    ['4','PED401','Ensino de Língua Portuguesa','80'],
    ['4','PED402','Ensino de História e Geografia','80'],
    ['4','PED403','Educação Especial e Inclusiva','60'],
    ['4','PED404','Libras','60'],
    ['5','PED501','Gestão Escolar','80'],
    ['5','PED502','Políticas Públicas em Educação','60'],
    ['5','PED503','Estágio Supervisionado I','100'],
    ['5','PED504','Tecnologias na Educação','60'],
    ['6','PED601','Estágio Supervisionado II','100'],
    ['6','PED602','Educação de Jovens e Adultos','60'],
    ['6','PED603','Coordenação Pedagógica','60'],
    ['6','PED604','Ética e Legislação Educacional','60'],
    ['7','PED701','Estágio Supervisionado III','120'],
    ['7','PED702','Projeto de TCC','60'],
    ['7','PED703','Educação e Diversidade Cultural','60'],
    ['8','PED801','TCC','120'],
    ['8','PED802','Atividades Complementares','200']
  ];

  -- Direito (30 disciplinas)
  dir_data text[][] := ARRAY[
    ['1','DIR101','Introdução ao Estudo do Direito','80'],
    ['1','DIR102','Teoria Geral do Estado','60'],
    ['1','DIR103','Ciência Política','60'],
    ['1','DIR104','Sociologia Jurídica','60'],
    ['1','DIR105','Filosofia do Direito','60'],
    ['2','DIR201','Direito Constitucional I','80'],
    ['2','DIR202','Direito Civil I','80'],
    ['2','DIR203','Direito Penal I','80'],
    ['2','DIR204','Economia','60'],
    ['3','DIR301','Direito Constitucional II','80'],
    ['3','DIR302','Direito Civil II','80'],
    ['3','DIR303','Direito Penal II','80'],
    ['3','DIR304','Hermenêutica Jurídica','60'],
    ['4','DIR401','Direito Administrativo','80'],
    ['4','DIR402','Direito Civil III','80'],
    ['4','DIR403','Direito Processual Civil I','80'],
    ['4','DIR404','Direito Empresarial I','60'],
    ['5','DIR501','Direito Tributário','80'],
    ['5','DIR502','Direito do Trabalho','80'],
    ['5','DIR503','Direito Processual Penal','80'],
    ['5','DIR504','Direitos Humanos','60'],
    ['6','DIR601','Direito Internacional','60'],
    ['6','DIR602','Direito Processual do Trabalho','60'],
    ['6','DIR603','Estágio Supervisionado I','120'],
    ['7','DIR701','Direito Ambiental','60'],
    ['7','DIR702','Prática Jurídica Civil','80'],
    ['7','DIR703','Estágio Supervisionado II','120'],
    ['8','DIR801','Prática Jurídica Penal','80'],
    ['9','DIR901','TCC I','60'],
    ['10','DIR1001','TCC II','80']
  ];

  -- Engenharia Civil (30 disciplinas)
  ec_data text[][] := ARRAY[
    ['1','EC101','Cálculo I','80'],
    ['1','EC102','Geometria Analítica','60'],
    ['1','EC103','Química Geral','60'],
    ['1','EC104','Desenho Técnico','60'],
    ['1','EC105','Introdução à Engenharia','40'],
    ['2','EC201','Cálculo II','80'],
    ['2','EC202','Álgebra Linear','60'],
    ['2','EC203','Física I','80'],
    ['2','EC204','Programação','60'],
    ['3','EC301','Cálculo III','80'],
    ['3','EC302','Física II','80'],
    ['3','EC303','Mecânica dos Sólidos','80'],
    ['3','EC304','Materiais de Construção I','60'],
    ['4','EC401','Equações Diferenciais','60'],
    ['4','EC402','Resistência dos Materiais','80'],
    ['4','EC403','Topografia','60'],
    ['4','EC404','Hidráulica','60'],
    ['5','EC501','Estruturas de Concreto I','80'],
    ['5','EC502','Estruturas Metálicas','80'],
    ['5','EC503','Geotecnia I','60'],
    ['5','EC504','Saneamento','60'],
    ['6','EC601','Estruturas de Concreto II','80'],
    ['6','EC602','Instalações Prediais','60'],
    ['6','EC603','Estradas','60'],
    ['6','EC604','Planejamento de Obras','60'],
    ['7','EC701','Pontes','60'],
    ['7','EC702','Gestão de Projetos','60'],
    ['7','EC703','Estágio Supervisionado','160'],
    ['8','EC801','TCC I','60'],
    ['9','EC901','TCC II','80']
  ];

  -- ADS (24 disciplinas)
  ads_data text[][] := ARRAY[
    ['1','ADS101','Lógica de Programação','80'],
    ['1','ADS102','Fundamentos de Sistemas','60'],
    ['1','ADS103','Matemática Aplicada','60'],
    ['1','ADS104','Arquitetura de Computadores','60'],
    ['2','ADS201','Programação Orientada a Objetos','80'],
    ['2','ADS202','Estrutura de Dados','80'],
    ['2','ADS203','Banco de Dados I','80'],
    ['2','ADS204','Engenharia de Software I','60'],
    ['3','ADS301','Desenvolvimento Web I','80'],
    ['3','ADS302','Banco de Dados II','60'],
    ['3','ADS303','Sistemas Operacionais','60'],
    ['3','ADS304','Redes de Computadores','60'],
    ['4','ADS401','Desenvolvimento Web II','80'],
    ['4','ADS402','Desenvolvimento Mobile','80'],
    ['4','ADS403','Engenharia de Software II','60'],
    ['4','ADS404','Segurança da Informação','60'],
    ['5','ADS501','Interface Humano-Computador','60'],
    ['5','ADS502','Qualidade de Software','60'],
    ['5','ADS503','Gerência de Projetos','60'],
    ['5','ADS504','Estágio Supervisionado','120'],
    ['6','ADS601','Inteligência Artificial','60'],
    ['6','ADS602','Cloud Computing','60'],
    ['6','ADS603','TCC','80'],
    ['6','ADS604','Atividades Complementares','120']
  ];

  -- Base genérica para os demais cursos (8 disciplinas — placeholder editável)
  gen_data text[][] := ARRAY[
    ['1','GEN101','Metodologia Científica','60'],
    ['1','GEN102','Comunicação e Expressão','60'],
    ['1','GEN103','Fundamentos I','80'],
    ['2','GEN201','Fundamentos II','80'],
    ['2','GEN202','Estatística Aplicada','60'],
    ['3','GEN301','Práticas Profissionais I','80'],
    ['4','GEN401','Práticas Profissionais II','80'],
    ['5','GEN501','TCC','80']
  ];

  outros_cursos text[] := ARRAY[
    'Administração','Arquitetura e Urbanismo','Biomedicina','Ciência da Computação',
    'Ciências Contábeis','Educação Física','Enfermagem','Engenharia da Computação',
    'Engenharia de Produção','Engenharia Elétrica','Engenharia Mecânica',
    'Farmácia','Nutrição','Odontologia','Psicologia','Sistemas de Informação'
  ];
  v_curso text;
  row_data text[];
  idx integer;
BEGIN
  FOREACH v_uni IN ARRAY unis LOOP
    -- Pedagogia
    SELECT id INTO m_id FROM public.curriculum_matrices WHERE universidade=v_uni AND curso='Pedagogia' AND versao='2024';
    IF NOT EXISTS (SELECT 1 FROM public.curriculum_disciplines WHERE matrix_id=m_id) THEN
      idx := 0;
      FOREACH row_data SLICE 1 IN ARRAY ped_data LOOP
        idx := idx + 1;
        INSERT INTO public.curriculum_disciplines(matrix_id, ordem, periodo, codigo, nome, carga_horaria)
        VALUES (m_id, idx, row_data[1], row_data[2], row_data[3], row_data[4]::int);
      END LOOP;
    END IF;

    -- Direito
    SELECT id INTO m_id FROM public.curriculum_matrices WHERE universidade=v_uni AND curso='Direito' AND versao='2024';
    IF NOT EXISTS (SELECT 1 FROM public.curriculum_disciplines WHERE matrix_id=m_id) THEN
      idx := 0;
      FOREACH row_data SLICE 1 IN ARRAY dir_data LOOP
        idx := idx + 1;
        INSERT INTO public.curriculum_disciplines(matrix_id, ordem, periodo, codigo, nome, carga_horaria)
        VALUES (m_id, idx, row_data[1], row_data[2], row_data[3], row_data[4]::int);
      END LOOP;
    END IF;

    -- Engenharia Civil
    SELECT id INTO m_id FROM public.curriculum_matrices WHERE universidade=v_uni AND curso='Engenharia Civil' AND versao='2024';
    IF NOT EXISTS (SELECT 1 FROM public.curriculum_disciplines WHERE matrix_id=m_id) THEN
      idx := 0;
      FOREACH row_data SLICE 1 IN ARRAY ec_data LOOP
        idx := idx + 1;
        INSERT INTO public.curriculum_disciplines(matrix_id, ordem, periodo, codigo, nome, carga_horaria)
        VALUES (m_id, idx, row_data[1], row_data[2], row_data[3], row_data[4]::int);
      END LOOP;
    END IF;

    -- ADS
    SELECT id INTO m_id FROM public.curriculum_matrices WHERE universidade=v_uni AND curso='Análise e Desenvolvimento de Sistemas' AND versao='2024';
    IF NOT EXISTS (SELECT 1 FROM public.curriculum_disciplines WHERE matrix_id=m_id) THEN
      idx := 0;
      FOREACH row_data SLICE 1 IN ARRAY ads_data LOOP
        idx := idx + 1;
        INSERT INTO public.curriculum_disciplines(matrix_id, ordem, periodo, codigo, nome, carga_horaria)
        VALUES (m_id, idx, row_data[1], row_data[2], row_data[3], row_data[4]::int);
      END LOOP;
    END IF;

    -- Outros cursos: matriz-base genérica
    FOREACH v_curso IN ARRAY outros_cursos LOOP
      SELECT id INTO m_id FROM public.curriculum_matrices WHERE universidade=v_uni AND curso=v_curso AND versao='2024';
      IF NOT EXISTS (SELECT 1 FROM public.curriculum_disciplines WHERE matrix_id=m_id) THEN
        idx := 0;
        FOREACH row_data SLICE 1 IN ARRAY gen_data LOOP
          idx := idx + 1;
          INSERT INTO public.curriculum_disciplines(matrix_id, ordem, periodo, codigo, nome, carga_horaria)
          VALUES (m_id, idx, row_data[1], row_data[2], row_data[3], row_data[4]::int);
        END LOOP;
      END IF;
    END LOOP;
  END LOOP;
END $$;
