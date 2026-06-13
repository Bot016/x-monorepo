import { getApiBaseUrl } from '@/config/env';
import { ApiError, createApiClient } from '@/services/api/client';
import { getAccessToken } from '@/services/api/session';
import { listEvaluations } from '@/services/evaluations';
import { listPatients } from '@/services/patients';
import type { EvaluationDto, PatientDto, ScreeningResult } from '@/services/types/api';
import { ageFromBirthDate } from '@/utils/patient';

import type {
  FilteredRecord,
  ReportAgeFilter,
  ReportData,
  ReportFilters,
  ReportPeriod,
  ReportResultFilter,
  ReportSexFilter,
} from './types';

const RECORDS_PAGE_SIZE = 3;

export function buildReportQuery(filters: ReportFilters): string {
  const params = new URLSearchParams();
  params.set('periodo', filters.periodo);

  if (filters.sexo !== 'all') {
    params.set('sexo', filters.sexo);
  }

  if (filters.resultado !== 'all') {
    params.set('resultado', filters.resultado);
  }

  const ageRange = ageRangeToParams(filters.faixaEtaria);
  if (ageRange.idadeMin !== undefined) {
    params.set('idadeMin', String(ageRange.idadeMin));
  }
  if (ageRange.idadeMax !== undefined) {
    params.set('idadeMax', String(ageRange.idadeMax));
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

function ageRangeToParams(faixaEtaria: ReportAgeFilter): {
  idadeMin?: number;
  idadeMax?: number;
} {
  switch (faixaEtaria) {
    case '0-5':
      return { idadeMin: 0, idadeMax: 5 };
    case '6-12':
      return { idadeMin: 6, idadeMax: 12 };
    case '13-18':
      return { idadeMin: 13, idadeMax: 18 };
    case '18+':
      return { idadeMin: 18 };
    default:
      return {};
  }
}

function periodStartDate(periodo: ReportPeriod): Date {
  const now = new Date();
  const start = new Date(now);

  if (periodo === 'ultima_semana') {
    start.setDate(now.getDate() - 7);
  } else if (periodo === 'ultimo_mes') {
    start.setMonth(now.getMonth() - 1);
  } else {
    start.setFullYear(now.getFullYear() - 1);
  }

  return start;
}

function matchesFilters(
  evaluation: EvaluationDto,
  patient: PatientDto | undefined,
  filters: ReportFilters,
): boolean {
  if (!patient) {
    return false;
  }

  const assessmentDate = new Date(evaluation.assessmentDate);
  if (assessmentDate < periodStartDate(filters.periodo)) {
    return false;
  }

  if (filters.sexo !== 'all' && patient.sex !== filters.sexo) {
    return false;
  }

  const age = ageFromBirthDate(patient.birthDate);
  const ageRange = ageRangeToParams(filters.faixaEtaria);
  if (ageRange.idadeMin !== undefined && age < ageRange.idadeMin) {
    return false;
  }
  if (ageRange.idadeMax !== undefined && age > ageRange.idadeMax) {
    return false;
  }

  // filters.resultado uses the /reports wire format (SUSPEITO/BAIXO_RISCO);
  // evaluation.screeningResult uses the DB enum (suspected/low_risk).
  if (
    filters.resultado !== 'all' &&
    evaluation.screeningResult !==
      (filters.resultado === 'SUSPEITO' ? 'suspected' : 'low_risk')
  ) {
    return false;
  }

  return true;
}

function patientCode(patientId: string): string {
  return patientId.replace(/-/g, '').slice(0, 5).toUpperCase();
}

function formatRecordDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function filterRecords(
  evaluations: EvaluationDto[],
  patients: PatientDto[],
  filters: ReportFilters,
): FilteredRecord[] {
  const patientMap = new Map(patients.map((patient) => [patient.id, patient]));

  return [...evaluations]
    .filter((evaluation) => matchesFilters(evaluation, patientMap.get(evaluation.patientId), filters))
    .sort(
      (left, right) =>
        new Date(right.assessmentDate).getTime() - new Date(left.assessmentDate).getTime(),
    )
    .map((evaluation) => {
      const patient = patientMap.get(evaluation.patientId);
      return {
        id: evaluation.id,
        patientName: patient?.name ?? 'Paciente',
        patientCode: patient ? patientCode(patient.id) : '—',
        assessmentDate: formatRecordDate(evaluation.assessmentDate),
        screeningResult: evaluation.screeningResult,
      };
    });
}

function buildFallbackReport(
  evaluations: EvaluationDto[],
  patients: PatientDto[],
  filters: ReportFilters,
): ReportData {
  const filtered = evaluations.filter((evaluation) =>
    matchesFilters(evaluation, patients.find((p) => p.id === evaluation.patientId), filters),
  );

  const totais = { suspeito: 0, baixo_risco: 0, total: filtered.length };
  const porSexo = {
    m: { suspeito: 0, baixo_risco: 0 },
    f: { suspeito: 0, baixo_risco: 0 },
  };
  const incidenciaMap = new Map<string, { nome: string; ocorrencias: number }>();

  for (const evaluation of filtered) {
    const resultKey =
      evaluation.screeningResult === 'suspected' ? 'suspeito' : 'baixo_risco';
    totais[resultKey]++;

    const patient = patients.find((p) => p.id === evaluation.patientId);
    if (patient?.sex === 'm' || patient?.sex === 'f') {
      porSexo[patient.sex][resultKey]++;
    }
  }

  return {
    filtros: filters,
    totais,
    porSexo,
    incidenciaSintomas: Array.from(incidenciaMap.entries()).map(([sintomaId, data]) => ({
      sintomaId,
      nome: data.nome,
      ocorrencias: data.ocorrencias,
    })),
    porPeriodo: [],
  };
}

export async function fetchReport(filters: ReportFilters): Promise<ReportData> {
  const accessToken = await getAccessToken();
  const api = createApiClient({ baseUrl: getApiBaseUrl() });
  const query = buildReportQuery(filters);

  try {
    return await api.get<ReportData>(`/reports${query}`, accessToken);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status >= 500)) {
      const [evaluations, patients] = await Promise.all([listEvaluations(), listPatients()]);
      return buildFallbackReport(evaluations, patients, filters);
    }

    throw error;
  }
}

export async function fetchReportsScreenData(filters: ReportFilters): Promise<{
  report: ReportData;
  records: FilteredRecord[];
}> {
  const [report, evaluations, patients] = await Promise.all([
    fetchReport(filters),
    listEvaluations(),
    listPatients(),
  ]);

  return {
    report,
    records: filterRecords(evaluations, patients, filters),
  };
}

export function paginateRecords(records: FilteredRecord[], visibleCount: number): FilteredRecord[] {
  return records.slice(0, visibleCount);
}

export function hasMoreRecords(records: FilteredRecord[], visibleCount: number): boolean {
  return records.length > visibleCount;
}

export function nextRecordsPageSize(current: number): number {
  return current + RECORDS_PAGE_SIZE;
}

export function mapScreeningLabel(result: ScreeningResult): string {
  return result === 'suspected' ? 'SUSPEITO' : 'NÃO SUSPEITO';
}
