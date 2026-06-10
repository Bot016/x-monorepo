import { publicGet } from '@/services/api/client';
import type { PatientSex, SymptomDto } from '@/services/types/api';

export async function fetchSymptoms(sex: PatientSex): Promise<SymptomDto[]> {
  return publicGet<SymptomDto[]>(`/symptoms?sex=${sex}`);
}
