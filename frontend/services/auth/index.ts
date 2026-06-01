export { createMockAuthService, mockAuthService } from './mockAuthService';
export { AuthError, type AuthService, type AuthUser, type LoginCredentials } from './types';

import { mockAuthService } from './mockAuthService';

/** Serviço padrão injetado no AuthProvider. Substitua quando integrar Supabase. */
export const defaultAuthService = mockAuthService;
