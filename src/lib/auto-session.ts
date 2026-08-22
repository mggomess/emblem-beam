import { supabase } from "@/integrations/supabase/client";

// Acesso livre: o painel entra automaticamente com a conta operacional,
// sem tela de senha. (Solicitado pelo dono do projeto.)
const OPERATIONAL_EMAIL = "admin@admin.local";
const OPERATIONAL_PASSWORD = "M@rc3190";

let pending: Promise<boolean> | null = null;

export async function ensureSession(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return true;

  if (!pending) {
    pending = supabase.auth
      .signInWithPassword({ email: OPERATIONAL_EMAIL, password: OPERATIONAL_PASSWORD })
      .then(({ data: signed, error }) => Boolean(signed?.session) && !error)
      .finally(() => {
        pending = null;
      });
  }

  return pending;
}
