export type ScreeningResult = 'SUSPEITO' | 'BAIXO_RISCO';

export type EvaluationDto = {
  id: string;
  userId: string;
  patientId: string;
  score: number;
  screeningResult: ScreeningResult;
  assessmentDate: string;
  appliedThreshold: number;
};

export type PatientDto = {
  id: string;
  name: string;
  sex: 'm' | 'f';
  birthDate: string;
  guardianId: string | null;
};

export type RecentEvaluation = {
  id: string;
  name: string;
  date: string;
  status: 'SUSPEITA' | 'NORMAL';
};

export type DashboardData = {
  assessmentsToday: number;
  suspectedCount: number;
  totalPatients: number;
  recentAssessments: RecentEvaluation[];
};

export type DashboardSyncStatus = 'loading' | 'synced' | 'offline';
