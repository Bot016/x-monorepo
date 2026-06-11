import { listEvaluations } from '@/services/evaluations';
import { listPatients } from '@/services/patients';
import type { EvaluationDto, ScreeningResult } from '@/services/types/api';
import type { DashboardData, RecentEvaluation } from './types';

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
  patients: Awaited<ReturnType<typeof listPatients>>,
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

export async function fetchDashboardData(): Promise<DashboardData> {
  const [patients, evaluations] = await Promise.all([listPatients(), listEvaluations()]);
  return buildDashboardData(patients, evaluations);
}
