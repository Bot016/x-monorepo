import type { EvaluationDto, PatientDto, ScreeningResult } from '@/services/types/api';

export type { EvaluationDto, PatientDto, ScreeningResult };

export type RecentEvaluation = {
  id: string;
  name: string;
  date: string;
  status: 'SUSPEITA' | 'NÃO SUSPEITO';
};

export type DashboardData = {
  assessmentsToday: number;
  suspectedCount: number;
  totalPatients: number;
  recentAssessments: RecentEvaluation[];
};

export type DashboardSyncStatus = 'loading' | 'synced' | 'offline';
