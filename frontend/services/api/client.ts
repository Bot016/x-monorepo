import { AuthError } from '@/services/auth/types';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiClientOptions = {
  baseUrl: string;
};

function parseErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'Não foi possível concluir a solicitação.';
  }

  const error = (payload as { error?: unknown }).error;

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }

  return 'Não foi possível concluir a solicitação.';
}

export function createApiClient({ baseUrl }: ApiClientOptions) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');

  async function request<T>(
    method: string,
    path: string,
    accessToken: string,
    body?: unknown,
  ): Promise<T> {
    const response = await fetch(`${normalizedBaseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = parseErrorMessage(payload);

      if (response.status === 401) {
        throw new AuthError('Sessão inválida ou expirada. Faça login novamente.');
      }

      throw new ApiError(response.status, message);
    }

    return response.json() as Promise<T>;
  }

  return {
    get<T>(path: string, accessToken: string) {
      return request<T>('GET', path, accessToken);
    },
  };
}
