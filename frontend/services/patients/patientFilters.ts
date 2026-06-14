import type { PatientDto } from '@/services/types/api';

import type { PatientFilters } from './types';

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase('pt-BR');
}

export function hasActivePatientFilters(filters: PatientFilters): boolean {
  return normalizeSearch(filters.search) !== '';
}

export function filterPatients(
  patients: PatientDto[],
  filters: PatientFilters,
): PatientDto[] {
  const search = normalizeSearch(filters.search);
  if (!search) {
    return patients;
  }

  return patients.filter((patient) => normalizeSearch(patient.name).includes(search));
}
