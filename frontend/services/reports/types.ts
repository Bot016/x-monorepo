export type ReportPeriod = 'ultima_semana' | 'ultimo_mes' | 'ultimo_ano';

export type ReportSexFilter = 'all' | 'm' | 'f';

export type ReportAgeFilter = 'all' | '0-5' | '6-12' | '13-18' | '18+';

export type ReportResultFilter = 'all' | 'SUSPEITO' | 'BAIXO_RISCO';

export type ReportFilters = {
  periodo: ReportPeriod;
  sexo: ReportSexFilter;
  faixaEtaria: ReportAgeFilter;
  resultado: ReportResultFilter;
};

export type ReportSymptomIncidence = {
  sintomaId: string;
  nome: string;
  ocorrencias: number;
};

export type ReportData = {
  filtros: Record<string, unknown>;
  totais: {
    suspeito: number;
    baixo_risco: number;
    total: number;
  };
  porSexo: {
    m: { suspeito: number; baixo_risco: number };
    f: { suspeito: number; baixo_risco: number };
  };
  incidenciaSintomas: ReportSymptomIncidence[];
  porPeriodo: {
    bucket: string;
    suspeito: number;
    baixo_risco: number;
  }[];
};

export type FilteredRecord = {
  id: string;
  patientName: string;
  patientCode: string;
  assessmentDate: string;
  screeningResult: 'suspected' | 'low_risk';
};
