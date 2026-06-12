import { useCallback, useState } from 'react';

import {

  ActivityIndicator,

  RefreshControl,

  ScrollView,

  StyleSheet,

} from 'react-native';



import { Screen } from '@/components/Screen';

import { DashboardOfflineBanner } from '@/components/principalComponents/offlineBanner';

import {

  FilteredRecordsTable,

  RelatoriosFilters,

  RelatoriosHeader,

  SuspectDistributionChart,

  SymptomIncidenceChart,

} from '@/components/relatoriosComponents';

import { ThemedView } from '@/components/themed-view';

import { useReports } from '@/hooks/useReports';

import { useThemeColor } from '@/hooks/use-theme-color';

import { exportReportPdf } from '@/services/reports';

import { showAlert } from '@/utils/showAlert';



export default function RelatoriosScreen() {

  const backgroundColor = useThemeColor(

    { light: '#F8F9FF', dark: '#151718' },

    'background',

  );



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

      <Screen withTabBar topAppBar backgroundColor={backgroundColor} style={styles.centered}>

        <ActivityIndicator size="large" />

      </Screen>

    );

  }



  return (

    <Screen withTabBar topAppBar backgroundColor={backgroundColor}>

      <ScrollView

        contentContainerStyle={styles.scroll}

        showsVerticalScrollIndicator={false}

        refreshControl={

          <RefreshControl refreshing={isRefreshing} onRefresh={() => void reload()} />

        }

      >

        <RelatoriosHeader onExport={() => void handleExport()} isExporting={isExporting} />



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

          <ThemedView style={styles.charts}>

            <SymptomIncidenceChart symptoms={report.incidenciaSintomas} />

            <SuspectDistributionChart

              suspect={report.totais.suspeito}

              lowRisk={report.totais.baixo_risco}

            />

          </ThemedView>

        ) : null}



        <FilteredRecordsTable

          records={records}

          totalCount={totalRecords}

          canLoadMore={canLoadMore}

          onLoadMore={loadMoreRecords}

        />

      </ScrollView>

    </Screen>

  );

}



const styles = StyleSheet.create({

  scroll: {

    paddingHorizontal: 16,

    paddingTop: 24,

    paddingBottom: 32,

    gap: 24,

  },

  centered: {

    alignItems: 'center',

    justifyContent: 'center',

  },

  charts: {

    gap: 12,

  },

});


