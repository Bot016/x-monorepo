import { getSupabaseClient } from '@/config/supabase';
import { AuthError } from '@/services/auth/types';

export async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await getSupabaseClient().auth.getSession();

  if (error) {
    throw new AuthError('Não foi possível restaurar a sessão.');
  }

  if (!session?.access_token) {
    throw new AuthError('Sessão inválida ou expirada. Faça login novamente.');
  }

  return session.access_token;
}
