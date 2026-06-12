import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAsyncList } from '@/hooks/useAsyncList';
import { listEvaluations } from '@/services/evaluations';
import { listPatients } from '@/services/patients';
import type { EvaluationDto } from '@/services/types/api';

type ReportItem = EvaluationDto & {
  patientName: string;
};

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function RelatoriosScreen() {
  const loadReports = useCallback(async (): Promise<ReportItem[]> => {
    const [evaluations, patients] = await Promise.all([listEvaluations(), listPatients()]);
    const patientNames = new Map(patients.map((patient) => [patient.id, patient.name]));

    return evaluations.map((evaluation) => ({
      ...evaluation,
      patientName: patientNames.get(evaluation.patientId) ?? 'Paciente',
    }));
  }, []);

  const { items: reports, isLoading, isRefreshing, errorMessage, reload } = useAsyncList(
    loadReports,
    { errorMessage: 'Não foi possível carregar os relatórios.' },
  );

  const summary = useMemo(() => {
    const suspected = reports.filter((report) => report.screeningResult === 'SUSPEITO').length;
    return { total: reports.length, suspected };
  }, [reports]);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Relatórios</ThemedText>
      <ThemedText style={styles.subtitle}>
        {summary.total} avaliações · {summary.suspected} suspeitas
      </ThemedText>

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void reload(true)} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>
            Nenhuma avaliação registrada ainda.
          </ThemedText>
        }
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            <ThemedView style={styles.cardHeader}>
              <ThemedText style={styles.patientName}>{item.patientName}</ThemedText>
              <ThemedView
                style={[
                  styles.badge,
                  item.screeningResult === 'SUSPEITO' ? styles.badgeSuspect : styles.badgeNormal,
                ]}
              >
                <ThemedText
                  style={[
                    styles.badgeText,
                    item.screeningResult === 'SUSPEITO'
                      ? styles.badgeTextSuspect
                      : styles.badgeTextNormal,
                  ]}
                >
                  {item.screeningResult === 'SUSPEITO' ? 'SUSPEITA' : 'NORMAL'}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedText style={styles.meta}>
              {formatDate(item.assessmentDate)} · Score {item.score.toFixed(2)}
            </ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 8,
  },
  list: {
    gap: 10,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#DDE4EE',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  meta: {
    fontSize: 13,
    opacity: 0.7,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuspect: {
    backgroundColor: '#FEE2E2',
  },
  badgeNormal: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextSuspect: {
    color: '#C53030',
  },
  badgeTextNormal: {
    color: '#065F46',
  },
  empty: {
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 24,
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
  },
});
