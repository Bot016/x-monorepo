import { useCallback, useEffect, useState } from 'react';

import {
  fetchDashboardData,
  type DashboardData,
  type DashboardSyncStatus,
} from '@/services/dashboard';

const EMPTY_DASHBOARD: DashboardData = {
  assessmentsToday: 0,
  suspectedCount: 0,
  totalPatients: 0,
  recentAssessments: [],
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [status, setStatus] = useState<DashboardSyncStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
      setStatus('synced');
    } catch (error) {
      setData(EMPTY_DASHBOARD);
      setStatus('offline');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar os dados do dashboard.',
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    status,
    errorMessage,
    reload: load,
  };
}
