import { getApiBaseUrl } from '@/config/env';
import { ApiError, createApiClient } from '@/services/api/client';
import { getAccessToken } from '@/services/api/session';
import type { CreateEvaluationInput, EvaluationDto } from '@/services/types/api';

export async function createEvaluation(
  input: CreateEvaluationInput,
): Promise<EvaluationDto> {
  const accessToken = await getAccessToken();
  const api = createApiClient({ baseUrl: getApiBaseUrl() });

  try {
    return await api.post<EvaluationDto>('/evaluations', accessToken, input);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Error(
        'O endpoint de avaliações ainda não está disponível no backend.',
      );
    }

    throw error;
  }
}

export async function listEvaluations(): Promise<EvaluationDto[]> {
  const accessToken = await getAccessToken();
  const api = createApiClient({ baseUrl: getApiBaseUrl() });

  try {
    return await api.get<EvaluationDto[]>('/evaluations', accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }

    throw error;
  }
}
