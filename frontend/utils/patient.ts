import type { PatientSex } from '@/services/types/api';

export function mapBiologicalSex(value: string): PatientSex {
  return value === 'feminino' ? 'f' : 'm';
}

export function birthDateFromAge(age: string): string {
  const parsedAge = Number.parseInt(age, 10);
  const year = Number.isNaN(parsedAge)
    ? new Date().getFullYear()
    : new Date().getFullYear() - parsedAge;

  return `${year}-01-01`;
}

export function ageFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

  if (hasNotHadBirthdayThisYear) {
    age -= 1;
  }

  return Math.max(age, 0);
}
