import { getSupabaseAuthService } from './supabaseAuthService';

export { createMockAuthService, mockAuthService } from './mockAuthService';
export { createSupabaseAuthService, getSupabaseAuthService } from './supabaseAuthService';
export {
  AuthError,
  type AuthService,
  type AuthUser,
  type LoginCredentials,
  type RegisterCredentials,
} from './types';

export const defaultAuthService = getSupabaseAuthService();
