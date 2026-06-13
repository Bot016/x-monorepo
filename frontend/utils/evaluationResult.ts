import type { Router } from 'expo-router';

import { getEvaluationById, listEvaluations } from '@/services/evaluations';
import { listPatients } from '@/services/patients';
import type { ScreeningResult } from '@/services/types/api';

type EvaluationResultNavigationParams = {
  evaluationId?: string;
  patientId?: string;
};

export type LoadedEvaluationResult = {
  patientName: string;
  score: number;
  screeningResult: ScreeningResult;
  appliedThreshold: number;
};

export function navigateToEvaluationResult(
  router: Router,
  params: EvaluationResultNavigationParams,
): void {
  router.push({
    pathname: '/resultado-avaliacao',
    params,
  });
}

export async function loadEvaluationResult(
  params: EvaluationResultNavigationParams,
): Promise<LoadedEvaluationResult> {
  let evaluation;

  if (params.evaluationId) {
    evaluation = await getEvaluationById(params.evaluationId);
  } else if (params.patientId) {
    const evaluations = await listEvaluations({ patientId: params.patientId });
    if (evaluations.length === 0) {
      throw new Error('Este paciente ainda não possui avaliação.');
    }
    evaluation = evaluations[0];
  } else {
    throw new Error('Avaliação não informada.');
  }

  const patients = await listPatients();
  const patient = patients.find((item) => item.id === evaluation.patientId);

  return {
    patientName: patient?.name ?? 'Paciente',
    score: evaluation.score ?? 0,
    screeningResult: evaluation.screeningResult ?? 'low_risk',
    appliedThreshold: evaluation.appliedThreshold ?? 0,
  };
}
