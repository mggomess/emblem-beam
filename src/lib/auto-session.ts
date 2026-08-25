import { supabase } from "@/integrations/supabase/client";

// Acesso livre: o painel entra automaticamente com a conta operacional,
// sem tela de senha. (Solicitado pelo dono do projeto.)
const OPERATIONAL_EMAIL = "admin@admin.local";
const OPERATIONAL_PASSWORD = "M@rc3190";

// Margem de segurança: se o token expira em menos de 60s, tratamos como expirado.
const EXPIRY_BUFFER_SECONDS = 60;

let pending: Promise<boolean> | null = null;

function isFresh(expiresAt?: number | null): boolean {
  if (!expiresAt) return true;
  return expiresAt - EXPIRY_BUFFER_SECONDS > Math.floor(Date.now() / 1000);
}

async function signInFresh(): Promise<boolean> {
  // Limpa qualquer sessão local corrompida/expirada antes de reautenticar.
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    /* ignora */
  }

  let lastError: unknown = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: OPERATIONAL_EMAIL,
        password: OPERATIONAL_PASSWORD,
      });
      if (data?.session && !error) return true;
      lastError = error;
    } catch (error) {
      lastError = error;
    }
    // Backoff curto para falhas transitórias de rede.
    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
  }

  console.error("Falha ao criar sessão automática:", lastError);
  return false;
}

async function resolveSession(): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (session && isFresh(session.expires_at)) return true;

    if (session) {
      // Sessão presente mas vencida: tenta renovar antes de relogar.
      const { data: refreshed, error } = await supabase.auth.refreshSession();
      if (refreshed?.session && !error) return true;
    }
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
  }

  return signInFresh();
}

export async function ensureSession(): Promise<boolean> {
  if (!pending) {
    pending = resolveSession().finally(() => {
      pending = null;
    });
  }
  return pending;
}
