import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Screen } from '@/components/Screen';
import { ScreenContent } from '@/components/ScreenContent';
import { DashboardOfflineBanner } from '@/components/principalComponents/offlineBanner';
import {
  FilteredRecordsTable,
  RelatoriosFilters,
  RelatoriosHeader,
  SuspectDistributionChart,
  SymptomIncidenceChart,
} from '@/components/relatoriosComponents';
import { ThemedView } from '@/components/themed-view';
import { useBreakpointLayout } from '@/hooks/useBreakpointLayout';
import { useReports } from '@/hooks/useReports';
import { exportReportPdf } from '@/services/reports';
import { navigateToEvaluationResult } from '@/utils/evaluationResult';
import { showAlert } from '@/utils/showAlert';

export default function RelatoriosScreen() {
  const router = useRouter();
  const { isStatsRow, isWide } = useBreakpointLayout();

  const {
    filters,
    updateFilters,
    report,
    records,
    totalRecords,
    canLoadMore,
    loadMoreRecords,
    status,
    errorMessage,
    isRefreshing,
    reload,
  } = useReports();

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportReportPdf(filters);
    } catch (error) {
      showAlert(
        'Exportar Dados',
        error instanceof Error
          ? error.message
          : 'Não foi possível exportar o relatório.',
      );
    } finally {
      setIsExporting(false);
    }
  }, [filters]);

  if (status === 'loading' && !report) {
    return (
      <Screen withTabBar topAppBar style={styles.centered}>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  return (
    <Screen withTabBar topAppBar>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void reload()} />
        }
      >
        <ScreenContent style={styles.content}>
          <RelatoriosHeader
            wide={isWide}
            onExport={() => void handleExport()}
            isExporting={isExporting}
          />

          <DashboardOfflineBanner
            status={status === 'synced' ? 'synced' : status === 'loading' ? 'loading' : 'offline'}
            message={
              status === 'offline'
                ? 'Modo Offline: Dados salvos localmente e serão sincronizados ao conectar.'
                : errorMessage
            }
          />

          <RelatoriosFilters filters={filters} onChange={updateFilters} />

          {report ? (
            <ThemedView style={[styles.charts, isStatsRow && styles.chartsRow]}>
              <ThemedView style={isStatsRow ? styles.chartCard : undefined}>
                <SymptomIncidenceChart symptoms={report.incidenciaSintomas} />
              </ThemedView>
              <ThemedView style={isStatsRow ? styles.chartCard : undefined}>
                <SuspectDistributionChart
                  suspect={report.totais.suspeito}
                  lowRisk={report.totais.baixo_risco}
                />
              </ThemedView>
            </ThemedView>
          ) : null}

          <FilteredRecordsTable
            records={records}
            totalCount={totalRecords}
            canLoadMore={canLoadMore}
            onLoadMore={loadMoreRecords}
            onRecordPress={(evaluationId) =>
              navigateToEvaluationResult(router, { evaluationId })
            }
          />
        </ScreenContent>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  content: {
    gap: 12,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  charts: {
    gap: 12,
  },
  chartsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  chartCard: {
    flex: 1,
  },
});
