-- 1) Novos usuários recebem papel padrão, nunca admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'usuario')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Garante que a conta admin existente permaneça admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'admin@admin.local'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Rotação da senha do admin (apenas o hash bcrypt fica versionado)
UPDATE auth.users
SET encrypted_password = '$2b$10$qABisPCLgsd2Vv196J1c0ePu0nTYV3MF4WxfIL0RlvNOH.bJQhy1y',
    updated_at = now()
WHERE email = 'admin@admin.local';

-- 3) Remove leitura pública irrestrita dos registros completos de certificados
DROP POLICY IF EXISTS "Consulta pública de certificados" ON public.certificados_registros;
REVOKE ALL ON public.certificados_registros FROM anon;
