import { getApiBaseUrl } from '@/config/env';
import { createApiClient } from '@/services/api/client';
import { ApiError } from '@/services/api/client';
import { getAccessToken } from '@/services/api/session';
import type {
  DashboardData,
  EvaluationDto,
  PatientDto,
  RecentEvaluation,
  ScreeningResult,
} from './types';

const RECENT_LIMIT = 5;

function isToday(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();

  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function formatAssessmentDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function mapScreeningResult(result: ScreeningResult): RecentEvaluation['status'] {
  return result === 'SUSPEITO' ? 'SUSPEITA' : 'NORMAL';
}

function buildDashboardData(
  patients: PatientDto[],
  evaluations: EvaluationDto[],
): DashboardData {
  const patientNames = new Map(patients.map((patient) => [patient.id, patient.name]));

  const assessmentsToday = evaluations.filter((evaluation) =>
    isToday(evaluation.assessmentDate),
  ).length;

  const suspectedCount = evaluations.filter(
    (evaluation) => evaluation.screeningResult === 'SUSPEITO',
  ).length;

  const recentAssessments = [...evaluations]
    .sort(
      (left, right) =>
        new Date(right.assessmentDate).getTime() - new Date(left.assessmentDate).getTime(),
    )
    .slice(0, RECENT_LIMIT)
    .map((evaluation) => ({
      id: evaluation.id,
      name: patientNames.get(evaluation.patientId) ?? 'Paciente',
      date: formatAssessmentDate(evaluation.assessmentDate),
      status: mapScreeningResult(evaluation.screeningResult),
    }));

  return {
    assessmentsToday,
    suspectedCount,
    totalPatients: patients.length,
    recentAssessments,
  };
}

async function fetchEvaluations(accessToken: string): Promise<EvaluationDto[]> {
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

export async function fetchDashboardData(): Promise<DashboardData> {
  const accessToken = await getAccessToken();
  const api = createApiClient({ baseUrl: getApiBaseUrl() });

  const [patients, evaluations] = await Promise.all([
    api.get<PatientDto[]>('/patients', accessToken),
    fetchEvaluations(accessToken),
  ]);

  return buildDashboardData(patients, evaluations);
}
