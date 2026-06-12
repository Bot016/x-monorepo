import { useCallback, useEffect, useState } from 'react';

import {
  fetchReportsScreenData,
  hasMoreRecords,
  nextRecordsPageSize,
  paginateRecords,
  type FilteredRecord,
  type ReportData,
  type ReportFilters,
} from '@/services/reports';

const DEFAULT_FILTERS: ReportFilters = {
  periodo: 'ultima_semana',
  sexo: 'all',
  faixaEtaria: 'all',
  resultado: 'all',
};

export type ReportsSyncStatus = 'loading' | 'synced' | 'offline';

export function useReports() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);
  const [report, setReport] = useState<ReportData | null>(null);
  const [records, setRecords] = useState<FilteredRecord[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [status, setStatus] = useState<ReportsSyncStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(
    async (refreshing = false) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setStatus('loading');
      }

      setErrorMessage(null);

      try {
        const data = await fetchReportsScreenData(filters);
        setReport(data.report);
        setRecords(data.records);
        setVisibleCount(3);
        setStatus('synced');
      } catch (error) {
        setReport(null);
        setRecords([]);
        setStatus('offline');
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os relatórios.',
        );
      } finally {
        setIsRefreshing(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const updateFilters = useCallback((patch: Partial<ReportFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const loadMoreRecords = useCallback(() => {
    setVisibleCount((current) => nextRecordsPageSize(current));
  }, []);

  return {
    filters,
    updateFilters,
    report,
    records: paginateRecords(records, visibleCount),
    totalRecords: records.length,
    canLoadMore: hasMoreRecords(records, visibleCount),
    loadMoreRecords,
    status,
    errorMessage,
    isRefreshing,
    reload: () => load(true),
  };
}
