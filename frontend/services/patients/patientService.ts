import { getApiBaseUrl } from '@/config/env';
import { createApiClient } from '@/services/api/client';
import { getAccessToken } from '@/services/api/session';
import type { CreatePatientInput, PatientDto } from '@/services/types/api';

export async function createPatient(input: CreatePatientInput): Promise<PatientDto> {
  const accessToken = await getAccessToken();
  const api = createApiClient({ baseUrl: getApiBaseUrl() });
  return api.post<PatientDto>('/patients', accessToken, input);
}

export async function listPatients(): Promise<PatientDto[]> {
  const accessToken = await getAccessToken();
  const api = createApiClient({ baseUrl: getApiBaseUrl() });
  return api.get<PatientDto[]>('/patients', accessToken);
}
